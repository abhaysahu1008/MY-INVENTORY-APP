import Link from "next/link";
import { logoutUser } from "../actions/auth";

export default function Header() {
  return (
    <header className="w-full bg-zinc-950 border-b border-zinc-800 px-6 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-yellow-400 text-zinc-950 font-black text-sm rounded-lg flex items-center justify-center italic">
          L
        </div>
        <span className="font-bold text-lg text-zinc-100 tracking-tight italic">
          Ledgr
        </span>
      </Link>

      <form action={logoutUser}>
        <button
          type="submit"
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-200 border border-zinc-800 font-medium rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-95"
        >
          Logout
        </button>
      </form>
    </header>
  );
}
