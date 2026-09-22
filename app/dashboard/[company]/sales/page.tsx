import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import SalesOrderClient, { SalesOrder } from "./SalesOrderClient";

export default async function SalesHistoryPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const payload = decodeTokenHelper(token);
  if (!payload?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { companyId: true, warehouseId: true },
  });

  if (!user || !user.companyId) redirect("/add-company");

  const rawOrders = await prisma.salesOrder.findMany({
    where: { companyId: user.companyId },
    include: {
      customer: { select: { name: true } },
      user: { select: { name: true, email: true } },
      warehouse: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const orders: SalesOrder[] = rawOrders.map((order) => ({
    id: order.id,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    customerName: order.customer?.name ?? "Walk-in Customer",
    warehouse: order.warehouse ? { name: order.warehouse.name } : null,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      product: item.product ? { name: item.product.name } : { name: "Unknown Product" },
    })),
  }));

  return <SalesOrderClient orders={orders} />;
}
