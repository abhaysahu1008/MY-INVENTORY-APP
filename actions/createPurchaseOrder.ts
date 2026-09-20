"use server";

import { revalidatePath } from "next/cache";
import { MovementType, OrderStatus } from "../app/generated/prisma/enums";
import { prisma } from "../app/lib/prisma";

export interface CreatePurchaseOrderInput {
  companyId: number;
  supplierId: number;
  warehouseId: number;
  userId: number;
  totalAmount: number;
  items: Array<{
    productId: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
}

export async function createPurchaseOrder(payload: CreatePurchaseOrderInput) {
  try {
    if (!payload.companyId || !payload.supplierId || !payload.warehouseId || !payload.userId) {
      return { success: false, error: "One or more required IDs are missing." };
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Create PurchaseOrder Header and Line Items
        const purchaseOrder = await tx.purchaseOrder.create({
          data: {
            companyId: payload.companyId,
            supplierId: payload.supplierId,
            warehouseId: payload.warehouseId,
            userId: payload.userId,
            totalAmount: Math.round(payload.totalAmount * 100) / 100,
            status: OrderStatus.COMPLETED,
            items: {
              create: payload.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitCost: Math.round(item.unitCost * 100) / 100,
                totalCost: Math.round(item.totalCost * 100) / 100,
              })),
            },
          },
        });

        // 2. Process updates sequentially using for...of loop
        for (const item of payload.items) {
          await tx.inventory.upsert({
            where: {
              warehouseId_productId: {
                warehouseId: payload.warehouseId,
                productId: item.productId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              companyId: payload.companyId,
              warehouseId: payload.warehouseId,
              productId: item.productId,
              quantity: item.quantity,
            },
          });

          await tx.stockMovement.create({
            data: {
              companyId: payload.companyId,
              warehouseId: payload.warehouseId,
              productId: item.productId,
              userId: payload.userId,
              quantity: item.quantity,
              type: MovementType.PURCHASE,
              reference: `PO-${purchaseOrder.id}`,
              notes: `Purchased stock via PO #${purchaseOrder.id}`,
            },
          });
        }

        return purchaseOrder;
      },
      {
        maxWait: 10000,
        timeout: 20000,
      }
    );

    revalidatePath("/inventory");
    return { success: true, orderId: result.id };
  } catch (error: unknown) {
    console.error("Prisma Invocation Error Details:", error);

    const errorMessage = error instanceof Error ? error.message : "Database transaction failed.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
