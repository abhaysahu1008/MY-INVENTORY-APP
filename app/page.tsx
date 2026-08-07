import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            I
          </div>
          <span className="text-xl font-bold text-gray-900">InventoryOS</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full mb-6">
          Multi-Tenant Warehouse Management
        </span>

        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 max-w-3xl">
          Complete Inventory & Stock Control for Your Business
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Track stock across multiple warehouses, manage sales and purchase orders, receive low-stock alerts, and keep complete audit logs in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mb-16">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition text-center"
          >
            Register Company
          </Link>
          <Link
            href="/dashboard"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg border border-gray-300 shadow-sm transition text-center"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
              📦
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Warehouse</h3>
            <p className="text-sm text-gray-600">
              Manage inventory balances across multiple stock locations, assign staff to specific warehouses, and track movements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Movement Logs</h3>
            <p className="text-sm text-gray-600">
              Complete stock movement history for sales, purchases, adjustments, and returns with automated ledger entries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
              🛒
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sales & Purchase Orders</h3>
            <p className="text-sm text-gray-600">
              Streamline supplier purchase orders and customer POS sales orders directly linked to your stock balances.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} InventoryOS. All rights reserved.</p>
      </footer>
    </div>
  );
}
