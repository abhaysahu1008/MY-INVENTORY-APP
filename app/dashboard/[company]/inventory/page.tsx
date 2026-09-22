import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import LowStockAlerts from "@/components/LowStockAlerts";

export default async function InventoryPage({
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
    select: { id: true, companyId: true, warehouseId: true, role: true },
  });

  if (!user || !user.companyId) redirect("/add-company");

  const isManagerOrAdmin = user.role === "OWNER";

  const whereClause = isManagerOrAdmin
    ? { warehouse: { companyId: user.companyId } }
    : { warehouseId: user.warehouseId || undefined };

  const inventoryItems = await prisma.inventory.findMany({
    where: whereClause,
    include: {
      product: {
        select: { name: true, price: true, costPrice: isManagerOrAdmin },
      },
      warehouse: { select: { name: true } },
    },
    orderBy: { quantity: "asc" },
  });

  const lowStockItems = inventoryItems
    .filter((inv) => inv.quantity <= 5)
    .map((inv) => ({
      id: inv.productId,
      productName: inv.product.name,
      warehouseName: inv.warehouse.name,
      quantity: inv.quantity,
      minStockThreshold: 5,
    }));

  return (
    <div className="p-6 md:p-8 text-gray-100 w-full space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Stock & Inventory</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isManagerOrAdmin
            ? "All Warehouses View (Admin/Manager)"
            : "Local Warehouse View (Employee)"}
        </p>
      </div>

      <LowStockAlerts items={lowStockItems} />

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-950/70 text-gray-400 uppercase text-xs border-b border-gray-800">
            <tr>
              <th className="p-4 font-bold">Product</th>
              <th className="p-4 font-bold">Warehouse</th>
              <th className="p-4 font-bold">Retail Price</th>
              <th className="p-4 font-bold">Stock Level</th>
              {isManagerOrAdmin && <th className="p-4 font-bold">Cost Price</th>}
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {inventoryItems.map((inv) => (
              <tr
                key={`${inv.productId}-${inv.warehouseId}`}
                className="hover:bg-gray-800/50 transition"
              >
                <td className="p-4 font-semibold text-white">{inv.product.name}</td>
                <td className="p-4 text-gray-400">{inv.warehouse.name}</td>
                <td className="p-4">${inv.product.price.toFixed(2)}</td>
                <td className="p-4 font-mono font-bold text-white">{inv.quantity}</td>
                {isManagerOrAdmin && (
                  <td className="p-4 text-gray-400">
                    ${inv.product.costPrice ? inv.product.costPrice.toFixed(2) : "0.00"}
                  </td>
                )}
                <td className="p-4">
                  {inv.quantity <= 5 ? (
                    <span className="px-2.5 py-1 bg-red-950/60 text-red-300 border border-red-800 rounded-lg text-xs font-semibold">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-green-950/60 text-green-300 border border-green-800 rounded-lg text-xs font-semibold">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
