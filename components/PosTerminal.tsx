"use client";

import { useState, useTransition, useEffect } from "react";
import { createSalesOrder } from "@/actions/createSalesOrder";

interface ProductOption {
  id: number;
  name: string;
  price: number;
  currentStock: number;
}

interface CustomerOption {
  id: number;
  name: string;
}

interface PosProps {
  companyId: number;
  warehouseId: number;
  userId: number;
  products?: ProductOption[];
  customers?: CustomerOption[];
}

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  maxStock: number;
}

export default function PosTerminal({
  companyId,
  warehouseId,
  userId,
  products = [],
  customers = [],
}: PosProps) {
  const [productList, setProductList] = useState<ProductOption[]>(products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProductList(products);
  }, [products]);

  // Add Product to Cart
  const handleAddToCart = (productId: number) => {
    const product = productList.find((p) => p.id === productId);
    if (!product) return;

    if (product.currentStock <= 0) {
      setErrorMsg(`"${product.name}" is out of stock!`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === productId);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          setErrorMsg(`Cannot add more than available stock (${product.currentStock}).`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
          maxStock: product.currentStock,
        },
      ];
    });
    setErrorMsg(null);
  };

  // Update Cart Quantity
  const handleQuantityChange = (productId: number, qty: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.productId === productId) {
            const validQty = Math.max(0, Math.min(qty, item.maxStock));
            return { ...item, quantity: validQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Total Calculation
  const totalAmount = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  // Submit Sale Order
  const handleSubmitOrder = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (cart.length === 0) {
      setErrorMsg("Cart is empty.");
      return;
    }

    startTransition(async () => {
      const payload = {
        companyId,
        warehouseId,
        userId,
        customerId: selectedCustomerId ? Number(selectedCustomerId) : undefined,
        totalAmount,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      };

      const res = await createSalesOrder(payload);

      if (res.success) {
        setProductList((prevProducts) =>
          prevProducts.map((p) => {
            const cartItem = cart.find((c) => c.productId === p.id);
            return cartItem
              ? { ...p, currentStock: p.currentStock - cartItem.quantity }
              : p;
          })
        );

        setSuccessMsg(`Sale completed successfully! Order ID: #${res.orderId}`);
        setCart([]);
        setSelectedCustomerId("");
      } else {
        setErrorMsg(res.error || "Failed to process sale.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 text-gray-100">
      {/* LEFT: Product Catalog */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-white">Select Products</h2>
        {productList.length === 0 ? (
          <div className="p-8 text-center bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
            No products found. Add products to your company catalog first.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productList.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAddToCart(p.id)}
                disabled={p.currentStock <= 0}
                className={`p-4 border rounded-lg text-left shadow-sm transition ${p.currentStock <= 0
                  ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed text-gray-500"
                  : "bg-gray-800 border-gray-700 hover:border-blue-500 text-white"
                  }`}
              >
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-gray-300">${p.price.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-2">
                  Stock: {p.currentStock}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Cart & Checkout */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Current Order</h2>

          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Customer (Optional)
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) =>
                setSelectedCustomerId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500 text-green-200 text-sm rounded">
              {successMsg}
            </div>
          )}

          {/* Cart Items List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border-b border-gray-700 pb-2 text-white"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={item.maxStock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, Number(e.target.value))
                      }
                      className="w-16 bg-gray-900 border border-gray-700 text-white rounded p-1 text-center text-sm"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.productId, 0)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer: Totals & Submit */}
        <div className="border-t border-gray-700 pt-4 mt-6">
          <div className="flex justify-between font-bold text-lg mb-4 text-white">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmitOrder}
            disabled={isPending || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition"
          >
            {isPending ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
