import Link from 'next/link';
import React from 'react';

const Sidebar = () => {



  return (
    <aside className="min-h-screen w-[300px] bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2">
        Management
      </h2>

      <Link
        href={"/"}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors text-left"
      >
        Add Warehouse
      </Link>

      <Link
        href="/dashboard/manager/add"
        className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors text-left"
      >
        Add Manager
      </Link>

      <Link
        href="/dashboard/employee/add"
        className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors text-left"
      >
        Add Employee
      </Link>
    </aside>
  );
};

export default Sidebar;
