"use client";

import React, { useState } from "react";
import { createPurchaseOrder } from "../actions/createPurchaseOrder";

interface OptionItem {
  id: number;
  name: string;
}

interface ProductOption extends OptionItem {
  price: number;
}

interface PageProps {
  companyId: number;
  userId?: number;
  warehouses: OptionItem[];
  suppliers: OptionItem[];
  products: ProductOption[];
}

interface LineItem {
  productId: number;
  quantity: number;
  unitCost: number;
}

const PurchaseProductFromSupplier = ({
  companyId,
  userId,
  warehouses,
  suppliers,
  products,
}: PageProps) => {
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<LineItem[]>([
    {
      productId: products[0]?.id || 0,
      quantity: 1,
      unitCost: products[0]?.price || 0,
    },
  ]);

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      {
        productId: products[0].id,
        quantity: 1,
        unitCost: products[0].price,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        updated[index].unitCost = selectedProduct.price;
      }
    }

    setItems(updated);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeCompanyId = Number(companyId);
    const activeUserId = Number(userId) || 1;
    const activeSupplierId = Number(supplierId);
    const activeWarehouseId = Number(warehouseId);

    if (!activeSupplierId || !activeWarehouseId) {
      alert("Please select both a supplier and a warehouse.");
      return;
    }

    if (!activeCompanyId || isNaN(activeCompanyId)) {
      alert("Invalid Company ID.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      companyId: activeCompanyId,
      userId: activeUserId,
      supplierId: activeSupplierId,
      warehouseId: activeWarehouseId,
      totalAmount: Math.round(grandTotal * 100) / 100,
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        totalCost: Math.round(item.quantity * item.unitCost * 100) / 100,
      })),
    };

    const res = await createPurchaseOrder(payload);
    setIsSubmitting(false);

    if (res.success) {
      alert(`Success! Purchase Order #${res.orderId} created.`);
    } else {
      alert(`Transaction Error:\n${res.error}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl text-gray-100 space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Create Purchase Order</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Order stock from a supplier and route it to a warehouse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-base font-semibold border-b border-zinc-800 pb-2 text-white">
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplier" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Supplier
              </label>
              <select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
                required
              >
                <option value="">Select a Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="warehouse" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Destination Warehouse
              </label>
              <select
                id="warehouse"
                value={warehouseId}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
                className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
                required
              >
                <option value="">Select a Warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-base font-semibold border-b border-zinc-800 pb-2 text-white">
            Order Items
          </h2>

          {items.map((item, index) => {
            const lineTotal = item.quantity * item.unitCost;

            return (
              <div
                key={index}
                className="flex flex-wrap md:flex-nowrap items-end gap-3 bg-zinc-900 p-3 border border-zinc-800 rounded-xl"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Product
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", Number(e.target.value))
                    }
                    className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                    className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="w-32">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitCost}
                    onChange={(e) =>
                      handleItemChange(index, "unitCost", parseFloat(e.target.value) || 0)
                    }
                    className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="w-24 text-right font-semibold text-sm text-white pb-2.5">
                  ${lineTotal.toFixed(2)}
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-400 font-bold hover:text-red-300 pb-2.5 px-2 transition"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddItem}
            className="text-blue-400 text-sm font-medium hover:text-blue-300 hover:underline pt-2 inline-block transition"
          >
            + Add Another Product
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-zinc-800">
          <div className="text-lg font-bold text-white">
            Total Amount: <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-50 transition shadow-md active:scale-[0.99]"
          >
            {isSubmitting ? "Processing..." : "Submit Purchase Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseProductFromSupplier;
