"use client";

import { useState, useTransition, useEffect } from "react";
import { createSalesOrder } from "../actions/createSalesOrder";
import ReceiptModal from "../components/ReceiptModal";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const totalAmount = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
        const matchedCustomer = customers.find((c) => c.id === Number(selectedCustomerId));

        setCompletedOrder({
          id: res.orderId,
          createdAt: new Date(),
          totalAmount,
          customer: matchedCustomer ? { name: matchedCustomer.name } : null,
          user: null,
          items: cart.map((item, idx) => ({
            id: idx + 1,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            product: { name: item.name },
          })),
        });

        setProductList((prevProducts) =>
          prevProducts.map((p) => {
            const cartItem = cart.find((c) => c.productId === p.id);
            return cartItem
              ? { ...p, currentStock: p.currentStock - cartItem.quantity }
              : p;
          })
        );

        setSuccessMsg(`Sale completed! Order #${res.orderId}`);
        setCart([]);
        setSelectedCustomerId("");
      } else {
        setErrorMsg(res.error || "Failed to process sale.");
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-gray-950 text-gray-100 overflow-hidden">

      {/* ===== TOP TOOLBAR ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-800 bg-gray-900/50 shrink-0">
        <div className="flex items-baseline gap-4">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Point of Sale
          </h1>
          <span className="text-sm text-gray-400 font-medium">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="relative w-full sm:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* ===== MAIN: split screen ===== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

        {/* LEFT: PRODUCT GRID (8/12) */}
        <div className="lg:col-span-8 overflow-y-auto p-6">
          {productList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <p className="text-lg font-medium text-gray-300">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Add products to your company catalog first.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4 opacity-30">🔍</div>
              <p className="text-base text-gray-300">
                No products match <span className="text-white font-semibold">{searchQuery}</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {filteredProducts.map((p) => {
                const outOfStock = p.currentStock <= 0;
                const lowStock = p.currentStock > 0 && p.currentStock <= 5;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleAddToCart(p.id)}
                    disabled={outOfStock}
                    className={`group relative flex flex-col justify-between min-h-[180px] p-5 rounded-2xl border text-left transition-all duration-200 ${outOfStock
                      ? "bg-gray-900/50 border-gray-800 opacity-40 cursor-not-allowed"
                      : "bg-gray-900 border-gray-800 hover:border-blue-500 hover:bg-gray-900/80 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.97]"
                      }`}
                  >
                    {/* Stock Badge */}
                    <span
                      className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full border ${outOfStock
                        ? "bg-red-950/80 text-red-300 border-red-800"
                        : lowStock
                          ? "bg-amber-950/80 text-amber-300 border-amber-800"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                        }`}
                    >
                      {outOfStock ? "OUT" : `${p.currentStock} left`}
                    </span>

                    <div className="pr-16">
                      <div className="font-bold text-lg text-white leading-snug line-clamp-3">
                        {p.name}
                      </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                      <span className="text-2xl font-black text-blue-400">
                        ${p.price.toFixed(2)}
                      </span>
                      {!outOfStock && (
                        <span className="text-sm font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition">
                          + Add
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: CART (4/12) */}
        <div className="lg:col-span-4 border-l border-gray-800 bg-gray-900/40 flex flex-col overflow-hidden">

          {/* Cart Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Current Order</h2>
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-sm text-red-400 hover:text-red-300 font-semibold transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Customer Selector */}
          <div className="px-6 pt-5 shrink-0">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) =>
                setSelectedCustomerId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">🚶 Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          {(errorMsg || successMsg) && (
            <div className="px-6 pt-4 shrink-0">
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-sm rounded-xl flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-950/60 border border-green-800 text-green-200 text-sm rounded-xl flex items-start gap-2">
                  <span>✓</span>
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items — scrollable, fills space */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="text-5xl mb-4 opacity-20">🛒</div>
                <p className="text-base font-medium text-gray-400">Cart is empty</p>
                <p className="text-sm text-gray-600 mt-1">
                  Click a product to add it
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 transition hover:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="font-semibold text-base text-white leading-tight flex-1">
                      {item.name}
                    </p>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 0)}
                      className="text-gray-500 hover:text-red-400 text-sm transition shrink-0"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition text-lg font-bold"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-base font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition text-lg font-bold"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-base font-bold text-white">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Totals & Submit — always visible */}
          <div className="border-t border-gray-800 p-6 space-y-3 bg-gray-900 shrink-0">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <span className="text-base font-semibold text-gray-300">Total</span>
              <span className="text-3xl font-black text-white">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isPending || cart.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-2"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Complete Sale · $${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>

      <ReceiptModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
    </div>
  );
}
