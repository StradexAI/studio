import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

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
    return NextResponse.json(
      {
        valid: false,
        error: "Failed to validate discovery link",
      },
      { status: 500 }
    );
  }
}
