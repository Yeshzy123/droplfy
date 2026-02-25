import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { PLANS } from "@/lib/stripe";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord || !keyRecord.active) {
    return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
  }

  const { success } = rateLimit(`api:${apiKey}`, 60, 60000);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { requests: { increment: 1 }, lastUsed: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: keyRecord.userId } });
  if (!user || user.banned) return NextResponse.json({ error: "Account not found or banned" }, { status: 403 });

  const plan = user.plan as keyof typeof PLANS;
  const planConfig = PLANS[plan] || PLANS.free;

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > planConfig.maxFileSize) {
    return NextResponse.json({ error: "File too large for your plan" }, { status: 400 });
  }

  if (user.storageUsed + file.size > planConfig.storage) {
    return NextResponse.json({ error: "Storage limit exceeded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  const url = `/uploads/${filename}`;

  const image = await prisma.image.create({
    data: {
      userId: user.id,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      thumbnailUrl: url,
      hash,
    },
  });

  await prisma.user.update({ where: { id: user.id }, data: { storageUsed: { increment: file.size } } });

  const base = process.env.NEXT_PUBLIC_APP_URL;
  return NextResponse.json({
    success: true,
    data: {
      id: image.id,
      url: `${base}${url}`,
      directUrl: `${base}${url}`,
      htmlEmbed: `<img src="${base}${url}" alt="${file.name}" />`,
      markdownEmbed: `![${file.name}](${base}${url})`,
      bbcodeEmbed: `[img]${base}${url}[/img]`,
      size: image.size,
      filename: image.filename,
      createdAt: image.createdAt,
    },
  });
}
