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

  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: number
  ) => {
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

  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeCompanyId = Number(companyId);
    const activeUserId = Number(userId) || 1; // Fallback to ID 1 if undefined/NaN
    const activeSupplierId = Number(supplierId);
    const activeWarehouseId = Number(warehouseId);

    // Validation Guard: Ensure no NaN values are passed to Prisma
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details Header */}
        <div className="bg-gray-50 border p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium mb-1">
                Supplier
              </label>
              <select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                className="w-full p-2 border rounded-md bg-white"
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
              <label htmlFor="warehouse" className="block text-sm font-medium mb-1">
                Destination Warehouse
              </label>
              <select
                id="warehouse"
                value={warehouseId}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
                className="w-full p-2 border rounded-md bg-white"
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

        {/* Dynamic Items List */}
        <div className="bg-gray-50 border p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Order Items</h2>

          {items.map((item, index) => {
            const lineTotal = item.quantity * item.unitCost;

            return (
              <div
                key={index}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white p-3 border rounded-md"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Product
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", Number(e.target.value))
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitCost}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "unitCost",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="w-28 text-right font-semibold pt-4">
                  ${lineTotal.toFixed(2)}
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 font-bold hover:text-red-700 pt-4 px-2"
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
            className="text-blue-600 text-sm font-medium hover:underline pt-2 inline-block"
          >
            + Add Another Product
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xl font-bold">
            Total Amount:{" "}
            <span className="text-green-600">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Submit Purchase Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseProductFromSupplier;
