import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManagerPage from "../../components/ManagerPage";
import OwnerPage from "../../components/OwnerPage";
import { prisma } from "../../lib/prisma";

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

  let userId: number;
  let userRole: Role;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = Number(decoded.id);
    userRole = decoded.role;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true },
  });


  if (userRole === Role.OWNER) {
    return (
      <OwnerPage
        companySlug={company}
        companyId={user?.companyId}
      />
    );
  }

  return <ManagerPage companySlug={company} />;
}
