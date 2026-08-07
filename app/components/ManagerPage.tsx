import Link from "next/link";
import React from "react";

interface ManagerPageProps {
  companySlug?: string | null;
}

export default function ManagerPage({ companySlug }: ManagerPageProps) {
  return (
    <div className="p-4 p-6 md:p-10 min-h-screen bg-zinc-950 space-y-10">
      {/* 1. Header Section */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Manager Dashboard
        </h1>
        <p className="text-base text-zinc-400 mt-2">
          {companySlug ? (
            <span>Managing branch: <strong className="text-yellow-200">{companySlug}</strong></span>
          ) : (
            "No company context assigned."
          )}
        </p>
      </div>

      {/* 2. Main Action Panel */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Label Section */}
          <div>
            <h2 className="text-xl font-bold text-yellow-950">
              Staff Portal
            </h2>
            <p className="text-sm text-yellow-800 mt-1 max-w-lg">
              Add new operational employees to your assigned warehouse branch.
            </p>
          </div>

          {/* Action Section */}
          <div className="flex-shrink-0">
            {companySlug ? (
              <Link
                href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-950 hover:bg-black text-yellow-50 font-semibold rounded-xl text-sm transition shadow-md"
              >
                👥 Add Employee
              </Link>
            ) : (
              <p className="text-sm font-medium text-yellow-900">
                Contact your business owner for branch access.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
