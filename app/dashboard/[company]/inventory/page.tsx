import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LowStockAlerts from "@/components/LowStockAlerts";
import { decodeTokenHelper } from "../../../utils/helper";
import { prisma } from "../../../lib/prisma";

const LOW_STOCK_THRESHOLD = 5; // Default minimum stock threshold

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
    select: { companyId: true },
  });

  if (!user || !user.companyId) redirect("/add-company");

  // Fetch all inventory items for this company
  const inventoryItems = await prisma.inventory.findMany({
    where: {
      warehouse: { companyId: user.companyId },
    },
    include: {
      product: { select: { name: true, price: true } },
      warehouse: { select: { name: true } },
    },
    orderBy: { quantity: "asc" },
  });

  // Filter low stock items
  const lowStockItems = inventoryItems
    .filter((inv) => inv.quantity <= LOW_STOCK_THRESHOLD)
    .map((inv) => ({
      id: inv.productId,
      productName: inv.product.name,
      warehouseName: inv.warehouse.name,
      quantity: inv.quantity,
      minStockThreshold: LOW_STOCK_THRESHOLD,
    }));

  return (
    <div className="p-6 text-gray-100 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock & Inventory</h1>
          <p className="text-xs text-gray-400">
            Real-time quantity levels across company warehouses
          </p>
        </div>
      </div>

      {/* Low Stock Monitor Widget */}
      <LowStockAlerts items={lowStockItems} />

      {/* Main Stock Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs border-b border-gray-700">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Warehouse</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No inventory data available.
                </td>
              </tr>
            ) : (
              inventoryItems.map((inv) => (
                <tr key={`${inv.productId}-${inv.warehouseId}`} className="hover:bg-gray-750 transition">
                  <td className="p-4 font-semibold text-white">{inv.product.name}</td>
                  <td className="p-4 text-gray-400">{inv.warehouse.name}</td>
                  <td className="p-4">${inv.product.price.toFixed(2)}</td>
                  <td className="p-4 font-mono text-base font-bold text-white">
                    {inv.quantity}
                  </td>
                  <td className="p-4">
                    {inv.quantity <= LOW_STOCK_THRESHOLD ? (
                      <span className="px-2 py-1 bg-red-900/60 text-red-300 border border-red-700 rounded text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-900/60 text-green-300 border border-green-700 rounded text-xs font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
