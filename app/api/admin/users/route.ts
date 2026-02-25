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
  const limit = 20;
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";

  const where: any = search ? { OR: [{ email: { contains: search } }, { name: { contains: search } }] } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, plan: true, role: true, banned: true, createdAt: true, storageUsed: true },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, banned, plan, role } = await req.json();
  const data: any = {};
  if (banned !== undefined) data.banned = banned;
  if (plan !== undefined) data.plan = plan;
  if (role !== undefined) data.role = role;

  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json(user);
}
