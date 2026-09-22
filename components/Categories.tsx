"use client";

import { useState } from "react";
import { createCategory } from "../actions/addCategory";

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await createCategory(formData);

    setLoading(false);

    if (result?.error) {
      setMessage({ text: result.error, isError: true });
    } else if (result?.success) {
      setMessage({ text: result.message || "Category created!", isError: false });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  return (
    <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
        Add Category
      </h3>
      <form action={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          required
          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 flex-1 focus:outline-none focus:border-yellow-400 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-yellow-400 text-zinc-950 font-semibold rounded-xl text-sm hover:bg-yellow-300 disabled:opacity-50 transition"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-xs font-medium ${message.isError ? "text-red-400" : "text-green-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Categories;
