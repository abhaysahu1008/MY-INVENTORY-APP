import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { prisma } from "../lib/prisma";
import { createSlug } from "../utils/helper";

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
  const { company } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId = 0;
  let userRole = "";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    userId = Number(decoded.id);
    userRole = decoded.role;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (userRole === "EMPLOYEE") {
    const companySlug = user.company?.name ? createSlug(user.company.name) : null;

    if (!companySlug) {
      redirect("/login");
    }

    // Only redirect if not already on the /pos page to prevent infinite loop
    if (company && company !== companySlug) {
      redirect(`/dashboard/${companySlug}/pos`);
    }

    // Employees only see the POS page without dashboard layout
    return children;
  }

  return (
    <main className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
