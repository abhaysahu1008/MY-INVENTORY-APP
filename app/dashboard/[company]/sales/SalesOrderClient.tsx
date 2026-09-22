"use client";

import { useState } from "react";
import ReceiptModal, { SalesOrder } from "../../../../components/ReceiptModal";

interface SalesOrderClientProps {
  orders: SalesOrder[];
}

export default function SalesOrderClient({ orders }: SalesOrderClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-950 text-gray-100 space-y-8 w-full">
      {/* Header Bar */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sales Order History
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review past sales transactions, filter records, and reprint customer receipts.
          </p>
        </div>
        <div className="text-xs font-bold px-4 py-2 bg-gray-900 text-gray-300 rounded-full border border-gray-800 self-start sm:self-auto">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Main Content Area */}
      {orders.length === 0 ? (
        <div className="p-12 text-center bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 text-base shadow-sm">
          No sales orders recorded yet.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-gray-200">
              <thead className="bg-gray-950/70 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                <tr>
                  <th className="py-4 px-6 font-bold">Order ID</th>
                  <th className="py-4 px-6 font-bold">Date & Time</th>
                  <th className="py-4 px-6 font-bold">Facility</th>
                  <th className="py-4 px-6 font-bold">Total Amount</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/50 transition">
                    <td className="py-4 px-6 font-mono text-white font-bold">
                      #{order.id.toString().padStart(5, "0")}
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      {order.warehouse?.name ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                          {order.warehouse.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">General POS</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-400 text-base font-mono">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs rounded-xl border border-gray-700 transition active:scale-95"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal View */}
      {selectedOrder && (
        <ReceiptModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
