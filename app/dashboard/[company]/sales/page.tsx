import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import SalesOrderClient from "./SalesOrderClient";

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

  const orders = await prisma.salesOrder.findMany({
    where: { companyId: user.companyId },
    include: {
      customer: { select: { name: true } },
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <SalesOrderClient orders={orders} />;
}
