"use server";

import { MovementType, OrderStatus } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

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
    // Basic guard check before entering transaction
    if (!payload.companyId || !payload.supplierId || !payload.warehouseId || !payload.userId) {
      return { success: false, error: "One or more required IDs (Company, Supplier, Warehouse, User) are missing." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create PurchaseOrder Header & Nested Items using explicit schema Enums
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

      // 2. Update Inventory and Stock Movement in parallel
      await Promise.all(
        payload.items.map(async (item) => {
          // Upsert using the exact schema compound unique index
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

          // Create Stock Movement with Enum type
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
        })
      );

      return purchaseOrder;
    });

    revalidatePath("/inventory");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("Prisma Invocation Error Details:", error);
    return {
      success: false,
      error: error?.message || "Database transaction failed."
    };
  }
}
