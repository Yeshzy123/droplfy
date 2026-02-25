import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const flagged = searchParams.get("flagged") === "true";
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = { deletedAt: null };
  if (flagged) where.flagged = true;

  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } }, _count: { select: { reports: true } } },
    }),
    prisma.image.count({ where }),
  ]);

  return NextResponse.json({ images, total, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, flagged } = await req.json();
  const image = await prisma.image.update({ where: { id }, data: { flagged } });
  return NextResponse.json(image);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.image.update({ where: { id }, data: { deletedAt: new Date() } });
  await prisma.user.update({ where: { id: image.userId }, data: { storageUsed: { decrement: image.size } } });

  return NextResponse.json({ message: "Deleted" });
}
