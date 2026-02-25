import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord || !keyRecord.active) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const { success } = rateLimit(`api:${apiKey}`, 60, 60000);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  await prisma.apiKey.update({ where: { id: keyRecord.id }, data: { requests: { increment: 1 }, lastUsed: new Date() } });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where: { userId: keyRecord.userId, deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, filename: true, originalName: true, size: true, mimeType: true, views: true, isPublic: true, createdAt: true },
    }),
    prisma.image.count({ where: { userId: keyRecord.userId, deletedAt: null } }),
  ]);

  const base = process.env.NEXT_PUBLIC_APP_URL;
  return NextResponse.json({
    success: true,
    data: images.map((img: any) => ({ ...img, url: `${base}${img.url}` })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord || !keyRecord.active) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const { id } = await req.json();
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image || image.userId !== keyRecord.userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.image.update({ where: { id }, data: { deletedAt: new Date() } });
  await prisma.user.update({ where: { id: keyRecord.userId }, data: { storageUsed: { decrement: image.size } } });

  return NextResponse.json({ success: true, message: "Image deleted" });
}
