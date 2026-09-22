"use server";

import { prisma } from "../app/lib/prisma";

export async function getSalesOrders(companyId: number, warehouseId: number) {
  try {
    const orders = await prisma.salesOrder.findMany({
      where: {
        companyId,
        warehouseId,
      },
      include: {
        customer: { select: { name: true } },
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, orders };
  } catch (error) {
    return { success: false, error: "Failed to fetch sales history." };
  }
}
