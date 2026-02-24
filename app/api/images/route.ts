import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const folderId = searchParams.get("folderId");
  const skip = (page - 1) * limit;

  const where: any = { userId, deletedAt: null };
  if (folderId) where.folderId = folderId;

  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.image.count({ where }),
  ]);

  return NextResponse.json({ images, total, page, pages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No image IDs provided" }, { status: 400 });
  }

  const images = await prisma.image.findMany({
    where: { id: { in: ids }, userId },
  });

  const totalSize = images.reduce((sum, img) => sum + img.size, 0);

  await prisma.image.updateMany({
    where: { id: { in: ids }, userId },
    data: { deletedAt: new Date() },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { storageUsed: { decrement: totalSize } },
  });

  return NextResponse.json({ message: "Images deleted" });
}
