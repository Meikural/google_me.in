import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { redis, cacheKeys, CACHE_TTL } from "@/app/lib/redis";

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

    // Check cache first
    const cacheKey = cacheKeys.search(query);
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Cache hit for search:", query);
      return NextResponse.json({ users: cached }, { status: 200 });
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

    // Cache the result
    await redis.setex(cacheKey, CACHE_TTL.SEARCH, JSON.stringify(users));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
