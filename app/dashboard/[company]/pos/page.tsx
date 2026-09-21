import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import PosTerminal from "../../../../components/PosTerminal";

export default async function PosPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const payload = decodeTokenHelper(token);
  if (!payload?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, companyId: true, warehouseId: true },
  });

  if (!user || !user.companyId) redirect("/add-company");

  // Get active warehouse or default to company's first warehouse
  let targetWarehouseId = user.warehouseId;
  if (!targetWarehouseId) {
    const defaultWarehouse = await prisma.warehouse.findFirst({
      where: { companyId: user.companyId },
      select: { id: true },
    });
    targetWarehouseId = defaultWarehouse?.id || null;
  }

  if (!targetWarehouseId) {
    return (
      <div className="p-6 text-white">
        Please create a warehouse first before using the POS.
      </div>
    );
  }

  // Fetch products with their warehouse inventory relation
  const [dbProducts, customers] = await Promise.all([
    prisma.product.findMany({
      where: { companyId: user.companyId },
      include: {
        inventories: { // <-- Fixed relation key name
          where: { warehouseId: targetWarehouseId },
          select: { quantity: true },
        },
      },
    }),
    prisma.customer.findMany({
      where: { companyId: user.companyId },
      select: { id: true, name: true },
    }),
  ]);

  // Format products and compute stock for target warehouse
  const products = dbProducts.map((prod) => ({
    id: prod.id,
    name: prod.name,
    price: prod.price,
    currentStock: prod.inventories[0]?.quantity ?? 0,
  }));

  return (
    <PosTerminal
      companyId={user.companyId}
      warehouseId={targetWarehouseId}
      userId={user.id}
      products={products}
      customers={customers}
    />
  );
}
