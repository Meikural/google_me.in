import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { redis, cacheKeys, CACHE_TTL } from "@/app/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check cache first
    const cacheKey = cacheKeys.userProfile(username);
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Cache hit for user profile:", username);
      return NextResponse.json({ user: cached }, { status: 200 });
    }

    // Find user by username and include their non-deleted links
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        links: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            url: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cache the result
    await redis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(user));

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
