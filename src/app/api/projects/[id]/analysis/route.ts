import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      scoringBreakdown: analysis.scoringBreakdown,
      aiInsights: analysis.aiInsights,
      recommendedTopics: analysis.recommendedTopics,
      recommendedActions: analysis.recommendedActions,
      estimatedImplementationCost: analysis.estimatedImplementationCost,
      estimatedMonthlyCost: analysis.estimatedMonthlyCost,
      projectedYear1Savings: analysis.projectedYear1Savings,
      paybackMonths: analysis.paybackMonths,
      generatedAt: analysis.generatedAt.toISOString(),
      consultantReviewed: analysis.consultantReviewed,
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

    // Update the analysis
    const updatedAnalysis = await prisma.analysis.update({
      where: {
        id: project.analysis.id,
      },
      data: {
        opportunityScore: body.opportunityScore,
        scoringBreakdown: body.scoringBreakdown,
        aiInsights: body.aiInsights,
        recommendedTopics: body.recommendedTopics,
        recommendedActions: body.recommendedActions,
        estimatedImplementationCost: body.estimatedImplementationCost,
        estimatedMonthlyCost: body.estimatedMonthlyCost,
        projectedYear1Savings: body.projectedYear1Savings,
        paybackMonths: body.paybackMonths,
        consultantReviewed: body.consultantReviewed,
      },
    });

    return NextResponse.json({
      id: updatedAnalysis.id,
      opportunityScore: updatedAnalysis.opportunityScore,
      scoringBreakdown: updatedAnalysis.scoringBreakdown,
      aiInsights: updatedAnalysis.aiInsights,
      recommendedTopics: updatedAnalysis.recommendedTopics,
      recommendedActions: updatedAnalysis.recommendedActions,
      estimatedImplementationCost: updatedAnalysis.estimatedImplementationCost,
      estimatedMonthlyCost: updatedAnalysis.estimatedMonthlyCost,
      projectedYear1Savings: updatedAnalysis.projectedYear1Savings,
      paybackMonths: updatedAnalysis.paybackMonths,
      generatedAt: updatedAnalysis.generatedAt.toISOString(),
      consultantReviewed: updatedAnalysis.consultantReviewed,
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    return NextResponse.json(
      { error: "Failed to update analysis" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/analysis - Generate new analysis
export async function POST(
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

    // TODO: Implement your AI analysis generation logic here
    // This would typically:
    // 1. Call your AI service to generate analysis based on discovery response
    // 2. Save the analysis to the database
    // 3. Return the generated analysis

    return NextResponse.json(
      { error: "Analysis generation not implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
