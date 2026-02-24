import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalImages,
    activeSubscriptions,
    flaggedImages,
    reports,
    recentUsers,
    recentImages,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.image.count({ where: { deletedAt: null } }),
    prisma.subscription.count({ where: { status: "active", plan: { not: "free" } } }),
    prisma.image.count({ where: { flagged: true, deletedAt: null } }),
    prisma.report.count({ where: { resolved: false } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, plan: true, banned: true, createdAt: true, storageUsed: true },
    }),
    prisma.image.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  const totalStorage = await prisma.user.aggregate({ _sum: { storageUsed: true } });

  const monthlyGrowth = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: true,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    totalUsers,
    totalImages,
    activeSubscriptions,
    flaggedImages,
    unresolvedReports: reports,
    totalStorageUsed: totalStorage._sum.storageUsed || 0,
    recentUsers,
    recentImages,
  });
}
