import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const formData = await request.json();

    // Find project by discovery token
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

    if (existingResponse && formData.status === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "Discovery questionnaire has already been submitted",
        },
        { status: 400 }
      );
    }

    // Create or update discovery response
    const discoveryResponse = existingResponse
      ? await prisma.discoveryResponse.update({
          where: { projectId: project.id },
          data: {
            ...formData,
            updatedAt: new Date(),
          },
        })
      : await prisma.discoveryResponse.create({
          data: {
            projectId: project.id,
            ...formData,
          },
        });

    // Update project status if completed
    if (formData.status === "COMPLETED") {
      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          status: "PENDING_REVIEW",
        },
      });
    }

    return NextResponse.json({
      success: true,
      discoveryResponse,
    });
  } catch (error) {
    console.error("Error submitting discovery form:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit discovery form",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Debug: Log environment and connection info
    console.log("Discovery API Debug:", {
      token,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
    });

    // Find project by discovery token
    const project = await prisma.project.findUnique({
      where: {
        discoveryToken: token,
      },
      include: {
        discoveryResponse: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid or expired discovery link",
        },
        { status: 404 }
      );
    }

    // Check if discovery has already been submitted
    const alreadySubmitted = !!project.discoveryResponse;

    return NextResponse.json({
      valid: true,
      project: {
        id: project.id,
        clientName: project.clientName,
        status: project.status,
      },
      alreadySubmitted,
    });
  } catch (error) {
    console.error("Error validating discovery token:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      token,
    });
    return NextResponse.json(
      {
        valid: false,
        error: "Failed to validate discovery link",
        debug:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}
