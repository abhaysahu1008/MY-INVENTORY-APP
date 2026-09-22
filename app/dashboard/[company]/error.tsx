"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Route Error:", error);
  }, [error]);

  return (
    <div className="p-8 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-2xl text-red-400">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
      <p className="text-xs text-gray-400 max-w-md">
        Failed to fetch operational data. This could be caused by temporary network issues or missing database connections.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-700 text-xs font-semibold transition"
      >
        Try Again
      </button>
    </div>
  );
}
