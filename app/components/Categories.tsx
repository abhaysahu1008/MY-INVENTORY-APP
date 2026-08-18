"use client";

import React, { useState } from "react";
import { createCategory } from "../actions/addCategory";

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await createCategory(formData);

    setLoading(false);

    // Fix 3: Check result.success / result.error properly
    if (result?.error) {
      setMessage({ text: result.error, isError: true });
    } else if (result?.success) {
      setMessage({ text: result.message || "Category created!", isError: false });
    }
  }

  return (
    <div className="p-4 bg-zinc-900 rounded-lg max-w-sm">
      <form action={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          required
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-100 flex-1 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-yellow-400 text-zinc-950 font-semibold rounded text-sm hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-xs ${message.isError ? "text-red-400" : "text-green-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Categories;
