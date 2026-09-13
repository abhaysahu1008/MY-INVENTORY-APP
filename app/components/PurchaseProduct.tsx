"use client";

import React, { useState } from "react";

interface OptionItem {
  id: number;
  name: string;
}

interface ProductOption extends OptionItem {
  price: number;
}

interface PageProps {
  companyId: number;
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
  warehouses,
  suppliers,
  products,
}: PageProps) => {
  // State for dynamic order items
  const [items, setItems] = useState<LineItem[]>([
    {
      productId: products[0]?.id || 0,
      quantity: 1,
      unitCost: products[0]?.price || 0,
    },
  ]);

  // Add new product row
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

  // Remove product row
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update dynamic fields
  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill cost when selected product changes
    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        updated[index].unitCost = selectedProduct.price;
      }
    }

    setItems(updated);
  };

  // Grand Total Calculation
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>

      <form className="space-y-6">
        <input type="hidden" name="companyId" value={companyId} />

        {/* Order Details Header */}
        <div className="bg-gray-50 border p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium mb-1">
                Supplier
              </label>
              <select
                name="supplierId"
                id="supplier"
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
                name="warehouseId"
                id="warehouse"
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

        {/* Dynamic Line Items Section */}
        <div className="bg-gray-50 border p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Order Items</h2>

          {items.map((item, index) => {
            const lineTotal = item.quantity * item.unitCost;

            return (
              <div
                key={index}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white p-3 border rounded-md"
              >
                {/* Product Dropdown */}
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

                {/* Quantity */}
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

                {/* Unit Cost */}
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

                {/* Line Total */}
                <div className="w-28 text-right font-semibold pt-4">
                  ${lineTotal.toFixed(2)}
                </div>

                {/* Delete Row Button */}
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

        {/* Footer Summary & Action */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xl font-bold">
            Total Amount:{" "}
            <span className="text-green-600">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Submit Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseProductFromSupplier;
