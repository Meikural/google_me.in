import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    if (query.length < 2) {
      return NextResponse.json({ error: "Search query must be at least 2 characters" }, { status: 400 });
    }

    // Search for users with username containing the query (case-insensitive)
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query.toLowerCase(),
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
      },
      take: 10, // Limit to 10 results
      orderBy: {
        username: "asc",
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
