"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createStaff, getWarehouses } from "../../../actions/addStaff";

interface Warehouse {
  id: number;
  name: string;
}

export default function AddStaffPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const companyName = (params.company || params.companySlug || "") as string;
  const initialRole = searchParams.get("role") || "EMPLOYEE";
  const companyId = searchParams.get("companyId") || "";

  // Initialize with empty array to prevent .map() crash
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch warehouses when the page loads
  useEffect(() => {
    async function loadWarehouses() {
      if (!companyId) return;
      const data = await getWarehouses(companyId);
      if (data.warehouses) {
        setWarehouses(data.warehouses);
      }
    }
    loadWarehouses();
  }, [companyId]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    formData.append("company", companyName);
    formData.append("role", initialRole);
    formData.append("companyId", companyId);

    const res = await createStaff(formData);

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push(`/dashboard/${companyName}`);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl text-zinc-100">
        <h2 className="text-xl font-bold mb-1">Add Staff Member</h2>
        {companyName && (
          <p className="text-xs text-zinc-400 mb-6">
            Adding <span className="font-semibold text-yellow-200">{initialRole}</span> for{" "}
            <span className="font-semibold text-zinc-200">{companyName}</span>
          </p>
        )}

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="staff@company.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Temporary Password *</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Assigned Warehouse</label>
            <select
              name="warehouseId"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none"
            >
              <option value="">Select Warehouse (Optional)</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50 mt-2"
          >
            {loading ? "Adding Staff..." : "Add Staff Member"}
          </button>
        </form>
      </div>
    </div>
  );
}
