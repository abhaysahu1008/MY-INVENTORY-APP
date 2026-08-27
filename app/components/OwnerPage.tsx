import Link from "next/link";
import React, { Suspense } from "react";
import StaffList from "./Employees";
import Warehouses from "./Warehouses";
import Categories from "./Categories";

interface OwnerPageProps {
  companySlug?: string | null;
  companyId?: number | null;
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
                  Add Manager
                </Link>

                <Link
                  href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE&companyId=${companyId}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-950 hover:bg-black text-yellow-50 font-semibold rounded-xl text-sm transition shadow-md w-full"
                >
                  Add Employee
                </Link>

                <Link
                  href={`/dashboard/${companySlug}/add-warehouse?companyId=${companyId}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-950 hover:bg-black text-yellow-50 font-semibold rounded-xl text-sm transition shadow-md w-full"
                >
                  Add Warehouse
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
          <Categories />
          <Link
            href={`/dashboard/${companySlug}/add-product?companyId=${companyId}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            <span className="text-2xl">+ Add Product</span>
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading Staffs...</div>}>
        {companySlug && companyId && <StaffList companyId={companyId} />}

      </Suspense>
      <Suspense fallback={<div>Loading Warehouse...</div>}>
        {companySlug && companyId && <Warehouses companyId={companyId} companySlug={companySlug} />}
      </Suspense>

    </div>
  );
}
