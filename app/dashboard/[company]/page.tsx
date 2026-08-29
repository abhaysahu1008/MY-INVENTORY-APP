import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = Number(decoded.id);
  } catch {
    redirect("/login");
  }

  // Fetch fresh user and company details simultaneously
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      companyId: true,
      company: { select: { name: true } } // Assuming Company table has a 'slug' field
    },
  });

  // Redirect if user no longer exists or lacks a company association
  if (!user || !user.companyId) {
    redirect("/login");
  }

  if (user.company?.name !== company) {
    notFound();
  }

  if (user.role === Role.OWNER) {
    return (
      <OwnerPage
        companySlug={company}
        companyId={user.companyId}
      />
    );
  }

  if (user.role === Role.MANAGER) {
    return <ManagerPage companySlug={company} />;
  }

  redirect(`/dashboard/${company}/pos`);
}
