"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompany } from "../actions/addCompany";
import { createSlug } from "../utils/helper";

export default function AddCompanyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const res = await createCompany(formData);

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      alert(res.error)
      return;
    }


    if (res?.success) {
      const companyName = createSlug(res.companyName);
      alert("Company created successfully");
      router.refresh();
      router.push(`/dashboard/${companyName}`);
    }
  }

  return (
    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-zinc-100 mb-4">Set Up Your Company</h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Company Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Address</label>
          <input
            type="text"
            name="address"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Logo URL</label>
          <input
            type="url"
            name="logo"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
