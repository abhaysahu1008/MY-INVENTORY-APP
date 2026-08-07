'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerUser } from '../../actions/auth';

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (name.length > 50) {
      setError("Name must be less than 50 characters");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password.length > 100) {
      setError("Password must be less than 100 characters");
      setLoading(false);
      return;
    }

    const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      setError("Password is too common. Please choose a stronger password");
      setLoading(false);
      return;
    }

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/dashboard/owner');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">

        {/* Header */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <div className="w-7 h-7 bg-yellow-400 text-zinc-950 font-black text-sm rounded-lg flex items-center justify-center">
              I
            </div>
            <span className="font-bold text-lg text-zinc-100 tracking-tight">InventoryOS</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Create Account</h1>
          <p className="text-xs text-zinc-400">Register as a business owner to start managing your organization.</p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
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
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-semibold rounded-xl py-3 text-sm transition shadow-md"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
