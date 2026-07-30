"use client";

import { useState } from "react";
import { registerUser } from "../actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form action={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Register Company</h2>

        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input name="companyName" required className="w-full mt-1 border p-2 rounded" placeholder="Acme Corp" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Your Full Name</label>
          <input name="name" required className="w-full mt-1 border p-2 rounded" placeholder="John Doe" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input name="email" type="email" required className="w-full mt-1 border p-2 rounded" placeholder="john@acme.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required className="w-full mt-1 border p-2 rounded" placeholder="••••••••" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </div>
  );
}
