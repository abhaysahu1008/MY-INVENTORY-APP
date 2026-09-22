"use client";

interface LowStockItem {
  id: number;
  productName: string;
  warehouseName: string;
  quantity: number;
  minStockThreshold: number;
}

interface LowStockAlertsProps {
  items: LowStockItem[];
}

export default function LowStockAlerts({ items }: LowStockAlertsProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 bg-green-950/40 border border-green-800 rounded-2xl text-green-300 text-sm flex items-center justify-between">
        <span>All product inventory levels are healthy!</span>
        <span className="font-bold">✓ Normal</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
          <h3 className="font-bold text-white text-lg">Low Stock Warnings</h3>
        </div>
        <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-full font-semibold">
          {items.length} item(s) low
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.warehouseName}`}
            className="flex items-center justify-between bg-gray-950/80 border border-gray-800 p-3 rounded-xl text-sm"
          >
            <div>
              <p className="font-semibold text-white">{item.productName}</p>
              <p className="text-xs text-gray-400">Warehouse: {item.warehouseName}</p>
            </div>
            <div className="text-right">
              <p className="text-red-400 font-bold">{item.quantity} remaining</p>
              <p className="text-xs text-gray-500">
                Min Threshold: {item.minStockThreshold}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
