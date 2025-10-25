import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DiscoveryResponse,
  ClaudeAgentforceResponse,
  validateDiscoveryResponse,
  calculateOpportunityScore,
} from "@/types/analysis";

// Generate the optimized Agentforce-focused prompt
function generateAgentforceAnalysisPrompt(
  discoveryData: DiscoveryResponse,
  clientName: string
): string {
  return `You are an Agentforce consultant analyzing a presales opportunity. 

CLIENT: ${clientName}
COMPANY: ${discoveryData.companyName || "Not provided"} (${discoveryData.companySize || "Not provided"})
INDUSTRY: ${discoveryData.industry || "Not provided"}
DEPARTMENT: ${discoveryData.primaryDepartment || "Not provided"}
SELECTED USE CASES: ${Array.isArray(discoveryData.useCases) ? discoveryData.useCases.join(", ") : discoveryData.useCases || "Not provided"}
MONTHLY VOLUME: ${discoveryData.monthlyVolume || "Not provided"}
PAIN POINTS: ${discoveryData.painPoints || "Not provided"}
COMMON QUESTIONS: ${discoveryData.commonQuestions || "Not provided"}
CURRENT CHANNELS: ${Array.isArray(discoveryData.currentChannels) ? discoveryData.currentChannels.join(", ") : discoveryData.currentChannels || "Not provided"}
SALESFORCE PRODUCTS: ${Array.isArray(discoveryData.salesforceProducts) ? discoveryData.salesforceProducts.join(", ") : discoveryData.salesforceProducts || "Not provided"}
BUDGET: ${discoveryData.budgetRange || "Not provided"}

Generate exactly 3 Agentforce use cases prioritized by ROI and feasibility.

Return JSON:
{
  "opportunityScore": 0-100,
  "agentforceFitScore": 0-100,
  "platformRequirements": {
    "salesforceProducts": ["Service Cloud", "Sales Cloud"],
    "dataCloudRequired": true/false,
    "dataCloudReason": "why needed",
    "agentforceEdition": "Flex" | "Unlimited"
  },
  "useCases": [
    {
      "name": "string",
      "description": "string",
      "priority": "high" | "medium" | "low",
      "channels": ["Chat", "Voice", "Messaging"],
      "topics": [
        {"name": "topic_name", "displayName": "Display", "description": "what it handles"}
      ],
      "actions": [
        {"name": "Action_Name", "type": "flow"|"apex", "description": "what it does"}
      ],
      "variables": [
        {"name": "var_name", "type": "string"|"boolean"|"number", "description": "purpose"}
      ],
      "integrations": [
        {"system": "System Name", "required": true/false, "complexity": "low"|"medium"|"high"}
      ],
      "sampleConversations": [
        {
          "scenario": "string",
          "conversation": [
            {"speaker": "Customer"|"Agent", "message": "string"}
          ]
        }
      ],
      "pricing": {
        "implementationCost": number,
        "monthlyConversationVolume": number,
        "avgActionsPerConversation": number,
        "monthlyAgentforceCost": number
      }
    }
  ],
  "costEstimates": {
    "totalImplementation": number,
    "monthlyPlatformCost": number,
    "annualPlatformCost": number
  },
  "roiProjections": {
    "currentAnnualCost": number,
    "projectedYear1Savings": number,
    "paybackMonths": number,
    "threeYearRoi": number
  }
}

IMPORTANT GUIDELINES:
1. Base ALL estimates on the specific information provided
2. Be realistic and conservative with financial projections
3. Consider the company size and industry in your estimates
4. If budget info is provided, ensure estimates align with it
5. Opportunity score should reflect genuine potential - be honest about weak opportunities
6. Agentforce fit score: how well suited is this for Agentforce platform specifically
7. Make insights specific to their situation, not generic advice
8. Recommended topics should be practical and achievable
9. Recommended actions should be prioritized and actionable
10. DO NOT output anything except valid JSON - no markdown, no explanations, just pure JSON

Your entire response must be a single valid JSON object.`;
}

// Parse and validate Claude's Agentforce response
function parseClaudeResponse(responseText: string): ClaudeAgentforceResponse {
  try {
    // Clean up response - remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, "");
    cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    cleanedResponse = cleanedResponse.trim();

    const parsed = JSON.parse(cleanedResponse);

    // Validate structure
    if (
      typeof parsed.opportunityScore !== "number" ||
      typeof parsed.agentforceFitScore !== "number" ||
      !parsed.platformRequirements ||
      !parsed.useCases ||
      !Array.isArray(parsed.useCases) ||
      parsed.useCases.length !== 3 ||
      !parsed.costEstimates ||
      !parsed.roiProjections
    ) {
      throw new Error("Invalid response structure from Claude");
    }

    return parsed as ClaudeAgentforceResponse;
  } catch (error) {
    console.error("Error parsing Claude response:", error);
    console.error("Raw response:", responseText);
    throw new Error("Failed to parse Claude's Agentforce analysis response");
  }
}

// Call Claude API
async function callClaudeAPI(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      temperature: 0.3, // Lower temperature for more consistent structured output
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Claude API error:", errorData);
    throw new Error(
      `Claude API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();

  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error("Invalid response format from Claude API");
  }

  return data.content[0].text;
}

// GET /api/projects/[id]/analysis - Fetch analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = params;

    // Verify the project belongs to the consultant
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        consultantId: session.user.id,
      },
      include: {
        analysis: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    const analysis = project.analysis;

    return NextResponse.json({
      id: analysis.id,
      opportunityScore: analysis.opportunityScore,
      agentforceFitScore: analysis.agentforceFitScore,
      useCases: analysis.useCases,
      platformRequirements: analysis.platformRequirements,
      estimatedImplementationCost: analysis.estimatedImplementationCost,
      estimatedMonthlyCost: analysis.estimatedMonthlyCost,
      estimatedAnnualCost: analysis.estimatedAnnualCost,
      currentAnnualCost: analysis.currentAnnualCost,
      projectedYear1Savings: analysis.projectedYear1Savings,
      paybackMonths: analysis.paybackMonths,
      threeYearRoi: analysis.threeYearRoi,
      generatedAt: analysis.generatedAt.toISOString(),
      consultantReviewed: analysis.consultantReviewed,
      consultantNotes: analysis.consultantNotes,
      customizations: analysis.customizations,
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id]/analysis - Update analysis
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = params;
    const body = await request.json();

    // Verify the project belongs to the consultant
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        consultantId: session.user.id,
      },
      include: {
        analysis: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Update the analysis with new Agentforce structure
    const updatedAnalysis = await prisma.analysis.update({
      where: {
        id: project.analysis.id,
      },
      data: {
        opportunityScore: body.opportunityScore,
        agentforceFitScore: body.agentforceFitScore,
        useCases: body.useCases as any,
        platformRequirements: body.platformRequirements as any,
        estimatedImplementationCost: body.estimatedImplementationCost,
        estimatedMonthlyCost: body.estimatedMonthlyCost,
        estimatedAnnualCost: body.estimatedAnnualCost,
        currentAnnualCost: body.currentAnnualCost,
        projectedYear1Savings: body.projectedYear1Savings,
        paybackMonths: body.paybackMonths,
        threeYearRoi: body.threeYearRoi,
        consultantReviewed: body.consultantReviewed,
        consultantNotes: body.consultantNotes,
        customizations: body.customizations as any,
        reviewedAt: body.consultantReviewed ? new Date() : null,
      },
    });

    // If marked as reviewed, update project status
    if (body.consultantReviewed) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "ANALYSIS_REVIEWED" },
      });
    }

    return NextResponse.json({
      id: updatedAnalysis.id,
      opportunityScore: updatedAnalysis.opportunityScore,
      agentforceFitScore: updatedAnalysis.agentforceFitScore,
      useCases: updatedAnalysis.useCases,
      platformRequirements: updatedAnalysis.platformRequirements,
      estimatedImplementationCost: updatedAnalysis.estimatedImplementationCost,
      estimatedMonthlyCost: updatedAnalysis.estimatedMonthlyCost,
      estimatedAnnualCost: updatedAnalysis.estimatedAnnualCost,
      currentAnnualCost: updatedAnalysis.currentAnnualCost,
      projectedYear1Savings: updatedAnalysis.projectedYear1Savings,
      paybackMonths: updatedAnalysis.paybackMonths,
      threeYearRoi: updatedAnalysis.threeYearRoi,
      generatedAt: updatedAnalysis.generatedAt.toISOString(),
      consultantReviewed: updatedAnalysis.consultantReviewed,
      consultantNotes: updatedAnalysis.consultantNotes,
      customizations: updatedAnalysis.customizations,
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    return NextResponse.json(
      { error: "Failed to update analysis" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/analysis - Generate new analysis with Claude
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      );
    }

    const { id: projectId } = params;

    // Verify the project belongs to the consultant
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        consultantId: session.user.id,
      },
      include: {
        discoveryResponse: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.discoveryResponse) {
      return NextResponse.json(
        { error: "Discovery response not found" },
        { status: 400 }
      );
    }

    // Validate discovery response data
    const validationErrors = validateDiscoveryResponse(
      project.discoveryResponse as DiscoveryResponse
    );
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Discovery response is incomplete",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Check if analysis already exists
    const existingAnalysis = await prisma.analysis.findUnique({
      where: {
        projectId: project.id,
      },
    });

    if (existingAnalysis) {
      return NextResponse.json(
        {
          error:
            "Analysis already exists. Please use the edit function or delete the existing analysis first.",
          existingAnalysis: existingAnalysis,
        },
        { status: 400 }
      );
    }

    console.log(`Generating Agentforce analysis for project ${projectId}...`);

    // Generate the optimized Agentforce prompt
    const prompt = generateAgentforceAnalysisPrompt(
      project.discoveryResponse as DiscoveryResponse,
      project.clientName
    );

    // Call Claude API
    console.log("Calling Claude API...");
    const claudeResponse = await callClaudeAPI(prompt);

    // Parse the response
    console.log("Parsing Claude response...");
    const analysisData = parseClaudeResponse(claudeResponse);

    // Save to database with new Agentforce structure
    const savedAnalysis = await prisma.analysis.create({
      data: {
        projectId: project.id,
        opportunityScore: analysisData.opportunityScore,
        agentforceFitScore: analysisData.agentforceFitScore,
        useCases: analysisData.useCases as any,
        platformRequirements: analysisData.platformRequirements as any,
        estimatedImplementationCost:
          analysisData.costEstimates.totalImplementation,
        estimatedMonthlyCost: analysisData.costEstimates.monthlyPlatformCost,
        estimatedAnnualCost: analysisData.costEstimates.annualPlatformCost,
        currentAnnualCost: analysisData.roiProjections.currentAnnualCost,
        projectedYear1Savings:
          analysisData.roiProjections.projectedYear1Savings,
        paybackMonths: analysisData.roiProjections.paybackMonths,
        threeYearRoi: analysisData.roiProjections.threeYearRoi,
        consultantReviewed: false,
        generatedAt: new Date(),
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "ANALYSIS_GENERATED" },
    });

    console.log("Agentforce analysis generated successfully");

    return NextResponse.json(
      {
        id: savedAnalysis.id,
        opportunityScore: savedAnalysis.opportunityScore,
        agentforceFitScore: savedAnalysis.agentforceFitScore,
        useCases: savedAnalysis.useCases,
        platformRequirements: savedAnalysis.platformRequirements,
        costEstimates: analysisData.costEstimates,
        roiProjections: analysisData.roiProjections,
        generatedAt: savedAnalysis.generatedAt.toISOString(),
        consultantReviewed: savedAnalysis.consultantReviewed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating analysis:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/analysis - Delete analysis
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = params;

    // Add query parameter check for confirmation
    const { confirm } = Object.fromEntries(request.nextUrl.searchParams);
    if (confirm !== "true") {
      return NextResponse.json(
        {
          error:
            "Confirmation required to delete analysis. Add ?confirm=true to the URL.",
        },
        { status: 400 }
      );
    }

    // Verify the project belongs to the consultant
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        consultantId: session.user.id,
      },
      include: {
        analysis: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Delete the analysis
    await prisma.analysis.delete({
      where: {
        id: project.analysis.id,
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "PENDING_REVIEW" },
    });

    return NextResponse.json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis" },
      { status: 500 }
    );
  }
}
