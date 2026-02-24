import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true, _count: { select: { images: true, apiKeys: true } } },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    plan: user.plan,
    role: user.role,
    storageUsed: user.storageUsed,
    subscription: user.subscription,
    imageCount: user._count.images,
    apiKeyCount: user._count.apiKeys,
    createdAt: user.createdAt,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { name } = await req.json();
  const user = await prisma.user.update({ where: { id: userId }, data: { name } });
  return NextResponse.json({ name: user.name });
}
