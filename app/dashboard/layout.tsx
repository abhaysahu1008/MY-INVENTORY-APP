import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Header from "../components/Header";

interface JWTPayload {
  id: number;
  role: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userRole = "";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    userRole = decoded.role;
  } catch {
    redirect("/login");
  }

  if (userRole === "EMPLOYEE") {
    redirect("/pos");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />
      {children}
    </main>
  );
}
