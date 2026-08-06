"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createStaff } from "../actions/addStaff";

const AddStaffPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function addStaff(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !password || !role) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (role !== "EMPLOYEE" && role !== "MANAGER") {
      setError("Please select a valid role");
      setLoading(false);
      return;
    }

    const result = await createStaff(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(`✅ ${role} added successfully!`);
    setLoading(false);

    const form = document.querySelector("form") as HTMLFormElement;
    form?.reset();

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Staff Member</h2>

        <form action={addStaff} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            name="name"
            className="p-2 border border-gray-300 rounded"
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            name="email"
            className="p-2 border border-gray-300 rounded"
          />

          <input
            type="password"
            placeholder="Temporary Password (min 8 chars)"
            required
            name="password"
            minLength={8}
            className="p-2 border border-gray-300 rounded"
          />

          <select
            name="role"
            id="role"
            required
            defaultValue=""
            className="p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="MANAGER">MANAGER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
              ❌ {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-sm bg-green-50 p-2 rounded">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffPage;
