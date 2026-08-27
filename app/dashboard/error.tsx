// 📁 app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-full min-w-full  flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-center my-6">
      <h2 className="text-lg font-bold text-red-400 mb-2">
        Something went wrong!
      </h2>
      <p className="text-sm text-slate-400 mb-6 max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  );
}
