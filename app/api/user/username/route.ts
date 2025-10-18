import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { invalidateUserCache, invalidateSearchCache } from "@/app/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Validate username: lowercase alphanumeric and hyphens, 3-30 chars
    const usernameRegex = /^[a-z0-9-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters, lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.clerkId !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    // Get old user data to invalidate old cache
    const oldUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Create or update user with username
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { username },
      create: {
        clerkId: userId,
        username,
      },
    });

    // Invalidate old username cache if it exists
    if (oldUser && oldUser.username !== username) {
      await invalidateUserCache(oldUser.username, oldUser.id);
    }

    // Invalidate new username cache
    await invalidateUserCache(user.username, user.id);

    // Invalidate all search caches since username changed
    await invalidateSearchCache();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error setting username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
