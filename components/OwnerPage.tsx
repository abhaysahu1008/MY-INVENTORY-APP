import Link from "next/link";
import { Suspense } from "react";
import Warehouses from "./Warehouses";

interface OwnerPageProps {
  companySlug?: string | null;
  companyId?: number | null;
}

export default function OwnerPage({ companySlug, companyId }: OwnerPageProps) {
  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-950 text-gray-100 space-y-8 w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Owner Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Managing company: <span className="text-blue-400 font-semibold">{companySlug}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${companySlug}/add-product?companyId=${companyId}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg active:scale-95"
          >
            + Add Product
          </Link>
          <Link
            href={`/dashboard/${companySlug}/purchase-product?companyId=${companyId}`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg active:scale-95"
          >
            Purchase Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Valuation</span>
          <p className="text-3xl font-black text-white mt-2">$45,210.00</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Alerts</span>
          <p className="text-3xl font-black text-amber-400 mt-2">3 Items</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Warehouses</span>
          <p className="text-3xl font-black text-white mt-2">2 Facilities</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Team Members</span>
          <p className="text-3xl font-black text-blue-400 mt-2">5 Active</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-400 font-bold uppercase tracking-wider text-xs mr-2">
          Quick Setup:
        </span>
        <Link
          href={`/dashboard/${companySlug}/add-staff?role=MANAGER&companyId=${companyId}`}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl border border-gray-700 transition font-medium"
        >
          + Add Manager
        </Link>
        <Link
          href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE&companyId=${companyId}`}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl border border-gray-700 transition font-medium"
        >
          + Add Employee
        </Link>
        <Link
          href={`/dashboard/${companySlug}/add-warehouse?companyId=${companyId}`}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl border border-gray-700 transition font-medium"
        >
          + Add Warehouse
        </Link>
        <Link
          href={`/dashboard/${companySlug}/add-supplier?companyId=${companyId}`}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl border border-gray-700 transition font-medium"
        >
          + Add Supplier
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Suspense fallback={<div className="text-gray-500 text-sm">Loading Warehouses...</div>}>
            {companySlug && companyId && (
              <Warehouses companyId={companyId} companySlug={companySlug} />
            )}
          </Suspense>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-white mb-2">System Roles & Staff</h2>
            <p className="text-sm text-gray-400 mb-6">
              2 Managers and 3 Employees assigned across operational warehouses.
            </p>
            <Link
              href={`/dashboard/${companySlug}/staff`}
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              View all staff members &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
