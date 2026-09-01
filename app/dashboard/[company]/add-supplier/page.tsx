"use client";

import React, { useState } from "react";
import { supplierAction } from "../../../actions/supplierAction";

export default function SupplierPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSupplier(formData: FormData) {
    setError(null);
    const res = await supplierAction(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-100 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Supplier</h2>

      {error && (
        <div className="p-3 mb-4 text-sm bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form action={handleSupplier} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
            Supplier Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Acme Wholesale Ltd"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="contact@supplier.com"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="178 Channiya Pura"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-yellow-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl text-sm transition"
        >
          Add Supplier
        </button>
      </form>
    </div>
  );
}
