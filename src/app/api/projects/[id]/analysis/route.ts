import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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
        analysis: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
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
