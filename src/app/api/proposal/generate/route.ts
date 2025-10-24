import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { proposalGenerationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = proposalGenerationSchema.parse(body);
    const { projectId, customizations } = validatedData;

    // Verify the project belongs to the consultant
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        consultantId: session.user.id,
      },
      include: {
        analysis: true,
        discoveryResponse: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.analysis) {
      return NextResponse.json(
        { error: "Analysis not found. Please generate analysis first." },
        { status: 400 }
      );
    }

    // Check if proposal already exists
    const existingProposal = await prisma.proposal.findUnique({
      where: {
        projectId: project.id,
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "Proposal already exists for this project" },
        { status: 400 }
      );
    }

    // Generate proposal content based on analysis
    const proposalContent = {
      executiveSummary: {
        title: `Agentforce Implementation for ${project.clientName}`,
        overview: `Based on our analysis, we recommend implementing Agentforce to automate your ${project.discoveryResponse?.useCaseName || "business processes"}.`,
        keyBenefits: [
          `Reduce operational costs by ${project.analysis.projectedYear1Savings ? Math.round((project.analysis.projectedYear1Savings / (project.analysis.currentAnnualCost || 1)) * 100) : 50}%`,
          `Improve response times and customer satisfaction`,
          `Scale operations without proportional headcount increase`,
        ],
      },
      architecture: {
        topics: project.analysis.recommendedTopics,
        actions: project.analysis.recommendedActions,
        integrations: project.analysis.integrationRequirements,
      },
      timeline: {
        phases: [
          { name: "Discovery & Planning", duration: "2 weeks" },
          { name: "Development & Configuration", duration: "4-6 weeks" },
          { name: "Testing & Training", duration: "2 weeks" },
          { name: "Deployment & Go-Live", duration: "1 week" },
        ],
        totalDuration: "8-10 weeks",
      },
      pricingOptions: customizations?.pricingOptions || [
        {
          name: "Standard Implementation",
          price: project.analysis.estimatedImplementationCost,
          timeline: "8-10 weeks",
          includes: [
            "Full Agentforce configuration",
            "Integration setup",
            "Testing and validation",
            "Training and documentation",
            "30-day post-deployment support",
          ],
        },
      ],
      caseStudies: customizations?.includedCaseStudies || [
        "retailco",
        "financebank",
      ],
      terms: {
        paymentSchedule: "50% upfront, 50% on completion",
        warranty: "90-day warranty on all deliverables",
        support: "30-day included support, ongoing support available",
      },
    };

    // Create the proposal record
    const proposal = await prisma.proposal.create({
      data: {
        projectId: project.id,
        executiveSummary: proposalContent.executiveSummary,
        architecture: proposalContent.architecture,
        timeline: proposalContent.timeline,
        pricingOptions: proposalContent.pricingOptions,
        caseStudies: proposalContent.caseStudies,
        terms: proposalContent.terms,
        status: "DRAFT",
      },
    });

    // TODO: Generate PDF and store in Vercel Blob
    const pdfUrl = `https://blob.vercel-storage.com/proposals/${project.clientName.toLowerCase().replace(/\s+/g, "-")}-proposal.pdf`;

    // Update proposal with PDF URL
    await prisma.proposal.update({
      where: {
        id: proposal.id,
      },
      data: {
        pdfUrl,
        pdfGenerated: true,
      },
    });

    return NextResponse.json(
      {
        proposalId: proposal.id,
        pdfUrl,
        status: "DRAFT",
        createdAt: proposal.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating proposal:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
