import React from "react";
import Link from "next/link";
import { LogoutUser } from "../actions/auth";

export default function Header() {
  return (
    <header className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-yellow-400 text-zinc-950 font-black text-sm rounded-lg flex items-center justify-center">
          I
        </div>
        <span className="font-bold text-lg text-zinc-100 tracking-tight">
          InventoryOS
        </span>
      </Link>

      <form action={LogoutUser}>
        <button
          type="submit"
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-200 border border-zinc-800 font-medium rounded-xl text-xs sm:text-sm transition shadow-sm"
        >
          Logout
        </button>
      </form>
    </header>
  );
}
