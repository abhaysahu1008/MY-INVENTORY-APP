"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ companySlug }: { companySlug: string }) {
  const pathname = usePathname();

  // Guard against undefined prop fallback
  const slug = companySlug || "tooyumm-coorp";

  const navItems = [
    { name: "POS Terminal", href: `/dashboard/${slug}/pos` },
    { name: "Inventory & Stock", href: `/dashboard/${slug}/inventory` },
    { name: "Sales History", href: `/dashboard/${slug}/sales` },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-4">


      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                ? "bg-gray-800 text-white font-semibold"
                : "text-gray-400 hover:bg-gray-850 hover:text-gray-200"
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
