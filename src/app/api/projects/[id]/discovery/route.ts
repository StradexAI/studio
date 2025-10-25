import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DiscoveryResponse, validateDiscoveryResponse } from "@/types/analysis";

// PATCH /api/projects/[id]/discovery - Update discovery data
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

    // Validate the updated discovery data
    const validationErrors = validateDiscoveryResponse(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Discovery data validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Update the discovery response
    const updatedDiscovery = await prisma.discoveryResponse.update({
      where: {
        projectId: project.id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    // If analysis exists, mark it as needing regeneration
    const existingAnalysis = await prisma.analysis.findUnique({
      where: {
        projectId: project.id,
      },
    });

    if (existingAnalysis) {
      await prisma.analysis.update({
        where: {
          id: existingAnalysis.id,
        },
        data: {
          consultantReviewed: false, // Reset review status
          // Add a flag to indicate data was updated
          customizations: {
            ...((existingAnalysis.customizations as any) || {}),
            discoveryDataUpdated: true,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      discoveryResponse: updatedDiscovery,
      message: "Discovery data updated successfully",
    });
  } catch (error) {
    console.error("Error updating discovery data:", error);
    return NextResponse.json(
      { error: "Failed to update discovery data" },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/discovery - Fetch discovery data
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
        discoveryResponse: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.discoveryResponse) {
      return NextResponse.json(
        { error: "Discovery response not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      discoveryResponse: project.discoveryResponse,
    });
  } catch (error) {
    console.error("Error fetching discovery data:", error);
    return NextResponse.json(
      { error: "Failed to fetch discovery data" },
      { status: 500 }
    );
  }
}
