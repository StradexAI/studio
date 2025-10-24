import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
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
        discoveryResponse: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.discoveryResponse) {
      return NextResponse.json(
        { error: "Discovery response not found" },
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
        { error: "Analysis already exists for this project" },
        { status: 400 }
      );
    }

    // TODO: Call Claude API to generate analysis
    // For now, create a placeholder analysis
    const mockAnalysis = {
      opportunityScore: 85,
      scoringBreakdown: {
        volume: 18,
        repeatability: 17,
        complexity: 16,
        data: 17,
        roi: 17,
      },
      aiInsights: [
        {
          type: "positive",
          message: "Good fit - moderate volume with clear processes",
        },
        {
          type: "warning",
          message: "May need additional API integrations",
        },
      ],
      recommendedTopics: [
        {
          name: "customer_support",
          displayName: "Customer Support",
          description: "Handle support inquiries and tickets",
          priority: "high",
        },
      ],
      recommendedActions: [
        {
          name: "Create_Case",
          description: "Create a new support case",
          type: "flow",
          inputs: ["customer_id", "issue_description"],
          outputs: ["case_id"],
          complexity: "low",
        },
      ],
      recommendedVariables: [
        {
          name: "customer_id",
          type: "string",
          description: "Unique customer identifier",
        },
      ],
      integrationRequirements: [
        {
          system: "Salesforce Service Cloud",
          required: true,
          complexity: "medium",
          notes: "Primary ticketing system",
        },
      ],
      estimatedImplementationCost: 55000,
      estimatedMonthlyCost: 1850,
      estimatedAnnualCost: 22200,
      currentAnnualCost: 300000,
      projectedYear1Savings: 150000,
      paybackMonths: 4.4,
      threeYearRoi: 200,
    };

    // Create the analysis record
    await prisma.analysis.create({
      data: {
        projectId: project.id,
        opportunityScore: mockAnalysis.opportunityScore,
        scoringBreakdown: mockAnalysis.scoringBreakdown,
        aiInsights: mockAnalysis.aiInsights,
        recommendedTopics: mockAnalysis.recommendedTopics,
        recommendedActions: mockAnalysis.recommendedActions,
        recommendedVariables: mockAnalysis.recommendedVariables,
        integrationRequirements: mockAnalysis.integrationRequirements,
        estimatedImplementationCost: mockAnalysis.estimatedImplementationCost,
        estimatedMonthlyCost: mockAnalysis.estimatedMonthlyCost,
        estimatedAnnualCost: mockAnalysis.estimatedAnnualCost,
        currentAnnualCost: mockAnalysis.currentAnnualCost,
        projectedYear1Savings: mockAnalysis.projectedYear1Savings,
        paybackMonths: mockAnalysis.paybackMonths,
        threeYearRoi: mockAnalysis.threeYearRoi,
      },
    });

    // Update project status
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        status: "PROPOSAL_DRAFT",
      },
    });

    return NextResponse.json(
      {
        message: "Analysis generation started",
        estimatedTime: "3-5 minutes",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
