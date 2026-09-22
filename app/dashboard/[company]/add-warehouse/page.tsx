"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addWarehouseAction } from "../../../../actions/addWarehouse";

export default function AddWarehouse() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const params = useParams();
  const router = useRouter();

  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function addWarehousefunc(formData: FormData) {
    setMessage(null);

    if (companyId) {
      formData.append("companyId", companyId);
    }

    const result = await addWarehouseAction(formData);

    if (result?.error) {
      setMessage({ text: result.error, isError: true });
    } else if (result?.success) {
      setMessage({ text: "✅ Warehouse added successfully!", isError: false });
      router.push(`/dashboard/${params.company}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-zinc-100 mb-1">Add Warehouse</h2>
        <p className="text-xs text-zinc-400 mb-6">
          Create a new storage facility for your company.
        </p>

        <form action={addWarehousefunc} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Main Warehouse"
              required
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              placeholder="123 Storage St."
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-md active:scale-[0.99] mt-2"
          >
            Add Warehouse
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-xs font-medium ${message.isError ? "text-red-400" : "text-green-400"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
