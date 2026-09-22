"use client";

import { useState } from "react";
import ReceiptModal from "../../../../components/ReceiptModal";

export default function SalesOrderClient({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <div className="p-6 text-gray-100 max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sales Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
          No sales orders recorded yet.
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 text-gray-400 uppercase text-xs border-b border-gray-700">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-750 transition">
                  <td className="p-4 font-mono font-semibold text-white">#{order.id}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">{order.customer?.name || "Walk-in Customer"}</td>
                  <td className="p-4">{order.items.length} item(s)</td>
                  <td className="p-4 font-bold text-green-400">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
