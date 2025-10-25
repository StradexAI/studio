import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Test basic environment
    const envInfo = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    // Test database connection
    let dbStatus = "unknown";
    let projectCount = 0;

    try {
      projectCount = await prisma.project.count();
      dbStatus = "connected";
    } catch (dbError) {
      dbStatus = `error: ${dbError instanceof Error ? dbError.message : "Unknown error"}`;
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envInfo,
      database: {
        status: dbStatus,
        projectCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
