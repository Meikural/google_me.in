import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { invalidateUserCache } from "@/app/lib/redis";

// PATCH update a link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { url, title } = body;

    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find link and check ownership
    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (existingLink.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingLink.deletedAt) {
      return NextResponse.json({ error: "Link has been deleted" }, { status: 410 });
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
      }
    }

    // Update link
    const link = await prisma.link.update({
      where: { id },
      data: {
        ...(url && { url }),
        ...(title !== undefined && { title: title || null }),
      },
    });

    // Invalidate user cache
    await invalidateUserCache(user.username, user.id);

    return NextResponse.json({ link }, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE soft delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find link and check ownership
    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (existingLink.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingLink.deletedAt) {
      return NextResponse.json({ error: "Link already deleted" }, { status: 410 });
    }

    // Soft delete by setting deletedAt timestamp
    const link = await prisma.link.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Invalidate user cache
    await invalidateUserCache(user.username, user.id);

    return NextResponse.json({ message: "Link deleted successfully", link }, { status: 200 });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
