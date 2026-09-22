"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ companySlug }: { companySlug: string }) {
  const pathname = usePathname();

  const slug = companySlug || "tooyumm-coorp";

  const navItems = [
    { name: "POS Terminal", href: `/dashboard/${slug}/pos` },
    { name: "Inventory & Stock", href: `/dashboard/${slug}/inventory` },
    { name: "Sales History", href: `/dashboard/${slug}/sales` },
    { name: "Analytics", href: `/dashboard/${slug}/analytics` },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-5 space-y-6 shrink-0">
      <div className="px-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Navigation
        </h2>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
                ? "bg-gray-800 text-white font-semibold shadow-sm"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
