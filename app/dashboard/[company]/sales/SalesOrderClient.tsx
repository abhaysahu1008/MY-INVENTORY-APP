"use client";

import { useState } from "react";
import ReceiptModal from "../../../../components/ReceiptModal";

export interface SalesOrder {
  id: number;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  warehouse: { name: string } | null;
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: { name: string };
  }[];
}

interface ReceiptOrder {
  id: number;
  createdAt: string;
  totalAmount: number;
  customer: { name: string } | null;
  user: null;
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: { name: string };
  }[];
}

export default function SalesOrderClient({ orders }: { orders: SalesOrder[] }) {
  const [selectedOrder, setSelectedOrder] = useState<ReceiptOrder | null>(null);

  return (
    <div className="p-6 md:p-8 text-gray-100 w-full space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Sales Order History</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review past sales transactions and reprint receipts.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center bg-gray-900 border border-gray-800 rounded-2xl text-gray-400">
          No sales orders recorded yet.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/70 text-gray-400 uppercase text-xs border-b border-gray-800">
              <tr>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Warehouse</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-mono font-semibold text-white">
                    #{order.id}
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4 text-gray-400">
                    {order.warehouse?.name ?? "—"}
                  </td>
                  <td className="p-4">{order.items.length} item(s)</td>
                  <td className="p-4 font-bold text-green-400">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        setSelectedOrder({
                          id: order.id,
                          createdAt: order.createdAt,
                          totalAmount: order.totalAmount,
                          customer: { name: order.customerName },
                          user: null,
                          items: order.items,
                        })
                      }
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition active:scale-95"
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
