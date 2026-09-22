import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "../lib/prisma";
import { createSlug } from "../utils/helper";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

interface JWTPayload {
  id: number;
  role: string;
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ company?: string }>;
}) {


  return (
    <main className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
