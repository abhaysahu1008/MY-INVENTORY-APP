"use client";

import { useState } from "react";
import { supplierAction } from "../../../../actions/supplierAction";

export default function SupplierPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSupplier(formData: FormData) {
    setError(null);
    setLoading(true);
    const res = await supplierAction(formData);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center p-6">
      <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-100 shadow-xl space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-bold text-zinc-100">Add New Supplier</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Register a vendor to purchase stock from.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <form action={handleSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Acme Wholesale Ltd"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="contact@supplier.com"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="178 Channiya Pura"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm text-zinc-100 placeholder-zinc-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-zinc-950 font-semibold rounded-xl text-sm transition shadow-md active:scale-[0.99]"
          >
            {loading ? "Adding..." : "Add Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
}
