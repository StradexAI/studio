import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations";
import { generateDiscoveryToken } from "@/lib/utils/token";

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = {
      consultantId: session.user.id,
      ...(status && { status: status as any }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        select: {
          id: true,
          clientName: true,
          status: true,
          createdAt: true,
          discoveryResponse: {
            select: { id: true },
          },
          analysis: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.project.count({ where }),
    ]);

    const projectsWithFlags = projects.map((project) => ({
      id: project.id,
      clientName: project.clientName,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      hasDiscoveryResponse: !!project.discoveryResponse,
      hasAnalysis: !!project.analysis,
    }));

    return NextResponse.json({
      projects: projectsWithFlags,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const discoveryToken = generateDiscoveryToken();

    const project = await prisma.project.create({
      data: {
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientContactName: validatedData.clientContactName,
        discoveryToken,
        consultantId: session.user.id,
        status: "DISCOVERY",
      },
    });

    const discoveryUrl = `${process.env.NEXTAUTH_URL}/discover/${discoveryToken}`;

    return NextResponse.json(
      {
        id: project.id,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        status: project.status,
        discoveryToken: project.discoveryToken,
        discoveryUrl,
        createdAt: project.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
