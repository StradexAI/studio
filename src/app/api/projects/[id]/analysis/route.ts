import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
