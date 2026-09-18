"use server";

import { MovementType, OrderStatus } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateSalesOrderInput {
  companyId: number;
  warehouseId: number;
  userId: number;
  customerId?: number;
  totalAmount: number;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export async function createSalesOrder(payload: CreateSalesOrderInput) {
  try {
    if (!payload.companyId || !payload.warehouseId || !payload.userId) {
      return { success: false, error: "Missing required parameters." };
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Check stock availability for all items
        for (const item of payload.items) {
          const inv = await tx.inventory.findUnique({
            where: {
              warehouseId_productId: {
                warehouseId: payload.warehouseId,
                productId: item.productId,
              },
            },
          });

          if (!inv || inv.quantity < item.quantity) {
            throw new Error(`Insufficient stock for Product ID ${item.productId}`);
          }
        }

        // 2. Create Sales Order
        const salesOrder = await tx.salesOrder.create({
          data: {
            companyId: payload.companyId,
            warehouseId: payload.warehouseId,
            userId: payload.userId,
            customerId: payload.customerId || null,
            totalAmount: Math.round(payload.totalAmount * 100) / 100,
            status: OrderStatus.COMPLETED,
            items: {
              create: payload.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: Math.round(item.unitPrice * 100) / 100,
                totalPrice: Math.round(item.totalPrice * 100) / 100,
              })),
            },
          },
        });

        // 3. Decrement Inventory and Log Stock Movements
        for (const item of payload.items) {
          await tx.inventory.update({
            where: {
              warehouseId_productId: {
                warehouseId: payload.warehouseId,
                productId: item.productId,
              },
            },
            data: {
              quantity: { decrement: item.quantity },
            },
          });

          await tx.stockMovement.create({
            data: {
              companyId: payload.companyId,
              warehouseId: payload.warehouseId,
              productId: item.productId,
              userId: payload.userId,
              quantity: -item.quantity, // Negative for outflow
              type: MovementType.SALE,
              reference: `SO-${salesOrder.id}`,
              notes: `Customer sale via SO #${salesOrder.id}`,
            },
          });
        }

        return salesOrder;
      },
      { maxWait: 10000, timeout: 20000 }
    );

    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return { success: true, orderId: result.id };
  }
  catch (error: unknown) {
    console.error("Prisma Invocation Error Details:", error);

    const errorMessage = error instanceof Error ? error.message : "Database transaction failed.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
