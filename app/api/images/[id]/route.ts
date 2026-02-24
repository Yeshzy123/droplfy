import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id;
  const data = await req.json();

  const image = await prisma.image.findUnique({ where: { id } });
  if (!image || image.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.image.update({
    where: { id },
    data: {
      isPublic: data.isPublic !== undefined ? data.isPublic : image.isPublic,
      folderId: data.folderId !== undefined ? data.folderId : image.folderId,
      expiresAt: data.expiresAt !== undefined ? new Date(data.expiresAt) : image.expiresAt,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id;

  const image = await prisma.image.findUnique({ where: { id } });
  if (!image || image.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.image.update({ where: { id }, data: { deletedAt: new Date() } });
  await prisma.user.update({ where: { id: userId }, data: { storageUsed: { decrement: image.size } } });

  return NextResponse.json({ message: "Deleted" });
}
