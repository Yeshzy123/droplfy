import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { PLANS } from "@/lib/stripe";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { success } = rateLimit(`upload:${userId}`, 30, 60000);
  if (!success) {
    return NextResponse.json({ error: "Upload rate limit exceeded" }, { status: 429 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const plan = user.plan as keyof typeof PLANS;
    const planConfig = PLANS[plan] || PLANS.free;
    const storageLimit = planConfig.storage;
    const maxFileSize = planConfig.maxFileSize;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string | null;
    const isPublic = formData.get("isPublic") !== "false";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: `File too large. Max size is ${maxFileSize / 1024 / 1024}MB` }, { status: 400 });
    }

    if (user.storageUsed + file.size > storageLimit) {
      return NextResponse.json({ error: "Storage limit exceeded. Please upgrade your plan." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/${filename}`;

    const image = await prisma.image.create({
      data: {
        userId,
        folderId: folderId || null,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        thumbnailUrl: url,
        isPublic,
        hash,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { storageUsed: { increment: file.size } },
    });

    return NextResponse.json({
      id: image.id,
      url: `${process.env.NEXT_PUBLIC_APP_URL}${url}`,
      directUrl: `${process.env.NEXT_PUBLIC_APP_URL}${url}`,
      htmlEmbed: `<img src="${process.env.NEXT_PUBLIC_APP_URL}${url}" alt="${file.name}" />`,
      markdownEmbed: `![${file.name}](${process.env.NEXT_PUBLIC_APP_URL}${url})`,
      bbcodeEmbed: `[img]${process.env.NEXT_PUBLIC_APP_URL}${url}[/img]`,
      filename: image.filename,
      originalName: image.originalName,
      size: image.size,
      createdAt: image.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
