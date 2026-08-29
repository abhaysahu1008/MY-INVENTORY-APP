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
      setTimeout(() => {

        setErrorMsg("");
      }, 2000);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full h-full p-6 bg-black text-slate-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">Add New Product</h2>
      </div>

      <form className="space-y-4" action={handleProduct}>
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Product Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Wireless Ergonomic Mouse"
            name="productName"
            className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Provide a brief summary of the product..."
            name="productDesc"
            className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Selling Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              name="SellingPrice"
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Cost Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              name="costPrice"
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Stock & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Minimum Stock
            </label>
            <input
              required
              type="number"
              placeholder="10"
              name="minStock"
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              required
              defaultValue=""
              name="categoryName"
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
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

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-sm py-2.5 rounded-lg shadow-md transition duration-150 active:scale-[0.99] disabled:cursor-not-allowed"
          >
            {isPending ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="mt-4 text-red-400 text-sm font-medium">{errorMsg}</p>
      )}
    </div>
  );
};

export default AddProduct;
