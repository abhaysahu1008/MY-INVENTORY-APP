import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-10 font-sans">

      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-zinc-800">
        <span className="font-bold italic text-lg text-zinc-100">Ledgr</span>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-yellow-400 text-zinc-950 font-semibold rounded-lg text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-zinc-300 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-yellow-400 text-zinc-950 font-semibold rounded-lg text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto my-12 text-center space-y-6">
        <h1 className="text-3xl font-bold text-zinc-100">
          Ledgr
        </h1>

        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Stock tracking, warehouse management, and order logging for multi-tenant setups.
        </p>

        <div className="flex gap-4 justify-center pt-2">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-yellow-400 text-zinc-950 font-semibold rounded-lg text-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-yellow-400 text-zinc-950 font-semibold rounded-lg text-sm"
              >
                Register
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium rounded-lg text-sm"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-zinc-100">Warehouses</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Manage inventory across multiple stock locations.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-zinc-100">Logs</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Record sales, purchases, adjustments, and returns.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-zinc-100">POS & Orders</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Handle checkout operations and updates in real time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
        Ledgr © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
