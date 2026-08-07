import Link from "next/link";
import React from "react";

interface OwnerPageProps {
  companySlug?: string | null;
}

export default function OwnerPage({ companySlug }: OwnerPageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Owner Dashboard</h1>
        <p className="text-sm text-zinc-400">
          {companySlug ? `Managing: ${companySlug}` : "No company set up yet"}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {companySlug ? (
          <>
            <Link
              href={`/dashboard/${companySlug}/add-staff?role=MANAGER`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition"
            >
              Add Manager
            </Link>

            <Link
              href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE`}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg text-sm transition"
            >
              Add Employee
            </Link>
          </>
        ) : (
          <Link
            href="/add-company"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition"
          >
            + Create Company
          </Link>
        )}
      </div>
    </div>
  );
}
