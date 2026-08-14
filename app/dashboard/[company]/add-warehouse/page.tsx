"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { addWarehouseAction } from "../../../actions/addWarehouse";

export default function AddWarehouse() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const params = useParams();
  console.log("company:", params.company);

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
      router.push(`/dashboard/${params.company}`)
    }
  }

  return (
    <div className="max-w-md p-4">
      <form action={addWarehousefunc} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Name *" required className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Address" className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Phone" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold">
          Add Warehouse
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${message.isError ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
