"use client";

interface SalesOrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { name: string };
}

interface SalesOrder {
  id: number;
  createdAt: Date | string;
  totalAmount: number;
  // Support BOTH shapes:
  customer?: { name: string } | null;
  customerName?: string | null;
  user?: { name: string | null; email: string } | null;
  items: SalesOrderItem[];
}

interface ReceiptModalProps {
  order: SalesOrder | null;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Resolve customer name from either shape
  const customerName =
    order.customer?.name || order.customerName || "Walk-in Customer";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white text-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl print:p-0 print:shadow-none print:w-full">
        <div id="receipt-content" className="space-y-4 text-sm font-mono">
          <div className="text-center border-b border-gray-300 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider">Ledgr Store</h2>
            <p className="text-xs text-gray-500">Official Sales Receipt</p>
            <p className="text-xs text-gray-400 mt-1">
              Order #{order.id} &bull; {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-xs space-y-1">
            <p>
              <span className="font-semibold">Customer:</span>{" "}
              {customerName}
            </p>
            <p>
              <span className="font-semibold">Cashier:</span>{" "}
              {order.user?.name || order.user?.email || "System"}
            </p>
          </div>

          <table className="w-full text-left border-t border-b border-gray-200 py-2">
            <thead>
              <tr className="border-b border-gray-200 text-xs">
                <th className="py-1">Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-1 max-w-[120px] truncate">{item.product.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-right">${item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center text-base font-bold pt-2">
            <span>TOTAL:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>

          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
            Thank you for your business!
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-sm font-medium transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-md active:scale-95"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
