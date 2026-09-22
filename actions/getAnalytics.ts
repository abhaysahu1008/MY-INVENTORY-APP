"use server";

import { prisma } from "../app/lib/prisma";

export async function getCompanyAnalytics(companyId: number, warehouseId?: number) {
  try {
    const whereCondition = warehouseId ? { companyId, warehouseId } : { companyId };

    const totalSales = await prisma.salesOrder.aggregate({
      where: whereCondition,
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const allOrders = await prisma.salesOrder.findMany({
      where: whereCondition,
      orderBy: { createdAt: "asc" },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Group sales revenue by date (YYYY-MM-DD) for chart rendering
    const chartMap = new Map<string, number>();
    allOrders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const current = chartMap.get(dateStr) || 0;
      chartMap.set(dateStr, current + order.totalAmount);
    });

    const chartData = Array.from(chartMap.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    const recentSales = await prisma.salesOrder.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
    });

    return {
      success: true,
      data: {
        totalRevenue: totalSales._sum.totalAmount || 0,
        totalOrders: totalSales._count.id || 0,
        averageOrderValue: totalSales._count.id
          ? (totalSales._sum.totalAmount || 0) / totalSales._count.id
          : 0,
        chartData,
        recentSales,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to load analytics." };
  }
}
