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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      companyId: true,
      company: { select: { name: true } }
    },
  });

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

  else {
    const companySlug = user.company.name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
    redirect(`/dashboard/${companySlug}/pos`);
  }
}
