import Link from "next/link";
import React from "react";
import StaffList from "./Employees";
import Warehouses from "./Warehouses";

interface OwnerPageProps {
  companySlug?: string | null;
  companyId?: number | null; // Updated to allow null/undefined
}

export default function OwnerPage({ companySlug, companyId }: OwnerPageProps) {
  return (
    <div className="p-4 p-6 md:p-10 min-h-screen bg-zinc-950 space-y-10">

      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Owner Dashboard
        </h1>
        <p className="text-base text-zinc-400 mt-2">
          {companySlug ? (
            <span>Currently managing: <strong className="text-yellow-200">{companySlug}</strong></span>
          ) : (
            "No company set up yet. Create one below to begin."
          )}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <h2 className="text-xl font-bold text-yellow-950">
              {companySlug ? "Staff Management Portal" : "Company Initialization"}
            </h2>
            <p className="text-sm text-yellow-800 mt-1 max-w-lg">
              {companySlug
                ? "Assign new Managers or Employees to this company. Staff accounts will gain scoped access to dashboard features."
                : "Setup your primary company to activate staff management and dashboard features."}
            </p>
          </div>

          <div className="flex-shrink-0">
            {companySlug ? (

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                <Link
                  href={`/dashboard/${companySlug}/add-staff?role=MANAGER&companyId=${companyId}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-950 hover:bg-black text-yellow-50 font-semibold rounded-xl text-sm transition shadow-md w-full"
                >
                  👤 Add Manager
                </Link>

                <Link
                  href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE&companyId=${companyId}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-yellow-100 text-yellow-950 font-semibold rounded-xl text-sm border border-yellow-300 transition shadow-sm w-full"
                >
                  👥 Add Employee
                </Link>

                <Link
                  href={`/dashboard/${companySlug}/add-warehouse?companyId=${companyId}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-yellow-100 text-yellow-950 font-semibold rounded-xl text-sm border border-yellow-300 transition shadow-sm w-full"
                >
                  🏭 Add Warehouse
                </Link>
              </div>
            ) : (
              <Link
                href="/add-company"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-950 hover:bg-black text-yellow-50 font-semibold rounded-xl text-sm transition shadow-lg"
              >
                🏢 + Create Your Company
              </Link>
            )}
          </div>
        </div>
      </div>

      {companySlug && companyId && <StaffList companyId={companyId} />}
      {companySlug && companyId && <Warehouses companyId={companyId} companySlug={companySlug} />}

    </div>
  );
}
