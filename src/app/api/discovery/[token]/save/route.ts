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

    // Create or update discovery response (save progress)
    const discoveryResponse = await prisma.discoveryResponse.upsert({
      where: { projectId: project.id },
      update: {
        ...formData,
        updatedAt: new Date(),
      },
      create: {
        projectId: project.id,
        ...formData,
      },
    });

    return NextResponse.json({
      success: true,
      discoveryResponse,
    });
  } catch (error) {
    console.error("Error saving discovery progress:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save progress",
      },
      { status: 500 }
    );
  }
}
