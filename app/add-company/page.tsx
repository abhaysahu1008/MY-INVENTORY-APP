"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCompany } from "../../actions/addCompany";
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
      return;
    }

    if (res?.success) {
      const companyName = createSlug(res.companyName);
      router.refresh();
      router.push(`/dashboard/${companyName}`);
    }
  }

  return (
    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl text-zinc-100">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-100">Set Up Your Company</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Add your business details to get started.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          ⚠️ {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
            Company Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
            Address
          </label>
          <input
            type="text"
            name="address"
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
            Logo URL
          </label>
          <input
            type="url"
            name="logo"
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition shadow-md active:scale-[0.99] mt-2"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
