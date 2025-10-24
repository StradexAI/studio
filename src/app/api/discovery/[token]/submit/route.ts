import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { discoveryFormSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    
    // Validate the discovery form data
    const validatedData = discoveryFormSchema.parse(body);

    // Find the project by discovery token
    const project = await prisma.project.findUnique({
      where: {
        discoveryToken: token,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired discovery link",
        },
        { status: 404 }
      );
    }

    // Check if discovery has already been submitted
    const existingResponse = await prisma.discoveryResponse.findUnique({
      where: {
        projectId: project.id,
      },
    });

    if (existingResponse) {
      return NextResponse.json(
        {
          success: false,
          error: "Discovery has already been submitted for this project",
        },
        { status: 400 }
      );
    }

    // Create the discovery response
    await prisma.discoveryResponse.create({
      data: {
        projectId: project.id,
        useCaseName: validatedData.useCaseName,
        useCaseDescription: validatedData.useCaseDescription,
        monthlyVolume: validatedData.monthlyVolume,
        channels: validatedData.channels,
        peakHours: validatedData.peakHours,
        currentProcess: validatedData.currentProcess,
        currentTeamSize: validatedData.currentTeamSize,
        avgResponseTime: validatedData.avgResponseTime,
        currentCsat: validatedData.currentCsat,
        existingSystems: validatedData.existingSystems,
        dataInSalesforce: validatedData.dataInSalesforce,
        hasApis: validatedData.hasApis,
        apiDetails: validatedData.apiDetails,
        successMetrics: validatedData.successMetrics,
        desiredTimeline: validatedData.desiredTimeline,
        additionalNotes: validatedData.additionalNotes,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // Update project status to PENDING_REVIEW
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        status: "PENDING_REVIEW",
      },
    });

    // TODO: Send email notification to consultant
    // TODO: Trigger AI analysis generation

    return NextResponse.json({
      success: true,
      message: "Discovery submitted successfully",
      projectId: project.id,
    });
  } catch (error) {
    console.error("Error submitting discovery:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit discovery",
      },
      { status: 500 }
    );
  }
}
