import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManagerPage from "../../components/ManagerPage";
import OwnerPage from "../../components/OwnerPage";


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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userRole = decoded.role;
  } catch {
    redirect("/login");
  }

  if (userRole === Role.OWNER) {
    return <OwnerPage companySlug={company} />;
  }

  return <ManagerPage companySlug={company} />;
}
