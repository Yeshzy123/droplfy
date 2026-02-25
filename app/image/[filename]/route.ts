import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(process.cwd(), "public", "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    const imageBuffer = fs.readFileSync(filePath);
    const ext = filename.split('.').pop()?.toLowerCase();
    
    const contentType = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'bmp': 'image/bmp'
    }[ext || ''] || 'application/octet-stream';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Image serve error:", error);
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}
