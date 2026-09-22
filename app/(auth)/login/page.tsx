"use client";

import { useState } from "react";
import { loginUser } from "../../../actions/auth";
import Link from "next/link";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    switch (result?.user?.role) {
      case "OWNER":
      case "MANAGER":
        if (result.user.companySlug) {
          window.location.href = `/dashboard/${result.user.companySlug}`;
        } else {
          window.location.href = "/add-company";
        }
        break;

      case "EMPLOYEE":
        if (result.user.companySlug) {
          window.location.href = `/dashboard/${result.user.companySlug}/pos`;
        } else {
          setError("Your account is not assigned to a company.");
          setLoading(false);
        }
        break;

      default:
        setError("Invalid user role");
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-400 text-zinc-950 font-black text-sm rounded-lg flex items-center justify-center italic">
              L
            </div>
            <span className="font-bold text-lg text-zinc-100 tracking-tight italic">
              Ledgr
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Welcome Back</h1>
          <p className="text-xs text-zinc-400">Sign in to manage your inventory.</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900/50 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-semibold rounded-xl py-3 text-sm disabled:opacity-50 transition shadow-md active:scale-[0.99]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-yellow-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
