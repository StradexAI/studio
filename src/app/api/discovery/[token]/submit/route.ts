import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const formData = await request.json();

    // Basic validation for required fields
    if (
      !formData.companyName ||
      !formData.contactName ||
      !formData.contactEmail ||
      !formData.contactRole
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: company name, contact name, email, or role",
        },
        { status: 400 }
      );
    }

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

    if (existingResponse && formData.status === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "Discovery has already been submitted for this project",
        },
        { status: 400 }
      );
    }

    // Create or update the discovery response with the new comprehensive schema
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
      message: "Discovery submitted successfully",
      discoveryResponse,
    });
  } catch (error) {
    console.error("Error submitting discovery:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit discovery",
      },
      { status: 500 }
    );
  }
}
