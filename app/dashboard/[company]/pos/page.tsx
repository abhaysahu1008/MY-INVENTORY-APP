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
  const { company } = await params;
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
      <div className="h-screen w-full flex items-center justify-center bg-gray-950 text-white p-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md text-center">
          <div className="text-4xl mb-3">🏢</div>
          <h2 className="text-xl font-bold mb-2">No Warehouse Assigned</h2>
          <p className="text-sm text-gray-400">
            Please create or assign a warehouse to your account before opening the POS terminal.
          </p>
        </div>
      </div>
    );
  }

  // Fetch products with their warehouse inventory relation & customers concurrently
  const [dbProducts, customers] = await Promise.all([
    prisma.product.findMany({
      where: { companyId: user.companyId },
      include: {
        inventories: {
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

  // Format products: convert Decimal prices to Numbers for Client Component serialization
  const products = dbProducts.map((prod) => ({
    id: prod.id,
    name: prod.name,
    price: Number(prod.price),
    currentStock: prod.inventories[0]?.quantity ?? 0,
  }));

  return (
    <main className="h-screen w-full overflow-hidden bg-gray-950">
      <PosTerminal
        companyId={user.companyId}
        warehouseId={targetWarehouseId}
        userId={user.id}
        products={products}
        customers={customers}
      />
    </main>
  );
}
