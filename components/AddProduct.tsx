"use client";

import { useState } from "react";
import { AddProductAction } from "../actions/addProduct";

interface Category {
  id: number | string;
  name: string;
}

interface AddProductProps {
  categories: Category[];
  companySlug: string;
}

const AddProduct = ({ categories, companySlug }: AddProductProps) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleProduct(formData: FormData) {
    setIsPending(true);
    setErrorMsg("");

    try {
      formData.append("companySlug", companySlug);
      const result = await AddProductAction(formData);

      if (result?.success) {
        alert("Product added successfully!");
      } else if (result?.error) {
        setErrorMsg(result.error);
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
      setTimeout(() => setErrorMsg(""), 2000);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Add New Product</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Register a new SKU under <span className="text-blue-400 font-semibold">{companySlug}</span>
        </p>
      </div>

      <form className="space-y-4" action={handleProduct}>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
            Product Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Wireless Ergonomic Mouse"
            name="productName"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Provide a brief summary of the product..."
            name="productDesc"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Selling Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              name="SellingPrice"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Cost Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              name="costPrice"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Minimum Stock
            </label>
            <input
              required
              type="number"
              placeholder="10"
              name="minStock"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              required
              defaultValue=""
              name="categoryName"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-slate-900 text-slate-100">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm py-3 rounded-xl shadow-md transition duration-150 active:scale-[0.99] disabled:cursor-not-allowed"
          >
            {isPending ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="mt-4 text-red-400 text-xs font-medium bg-red-950/40 border border-red-900/50 rounded-lg p-3">
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
};

export default AddProduct;
