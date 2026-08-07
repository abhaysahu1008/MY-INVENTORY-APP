import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import OwnerPage from "../../components/owner/page";
import ManagerPage from "../../components/manager/page";


interface JwtPayload {
  id: number | string;
  role: Role;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userRole: Role;

  // 1. Only wrap the JWT verification logic in try/catch
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userRole = decoded.role;
  } catch {
    redirect("/login");
  }

  // 2. Return JSX cleanly outside of the try/catch block
  if (userRole === Role.OWNER) {
    return <OwnerPage companySlug={company} />;
  }

  return <ManagerPage companySlug={company} />;
}
