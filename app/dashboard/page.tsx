import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ManagerPage from "../components/ManagerPage";
import OwnerPage from "../components/OwnerPage";
import { prisma } from "../lib/prisma";
import { createSlug } from "../utils/helper";

interface JwtPayload {
  id: number | string;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const decodedCompanyParam = decodeURIComponent(company);

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

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
      company: { select: { name: true } },
    },
  });

  if (!user || !user.companyId || !user.company?.name) {
    redirect("/add-company");
  }

  const targetSlug = createSlug(user.company.name.trim());

  // FIX: Redirect to correct canonical slug instead of hard 404 if slug mismatch is minor
  if (targetSlug !== decodedCompanyParam) {
    // If you prefer strict authorization, keep notFound() here after verifying your createSlug implementation.
    redirect(`/dashboard/${targetSlug}`);
  }

  if (user.role === Role.OWNER) {
    return <OwnerPage companySlug={targetSlug} companyId={user.companyId} />;
  }

  if (user.role === Role.MANAGER) {
    return <ManagerPage companySlug={targetSlug} />;
  }

  redirect(`/dashboard/${targetSlug}/pos`);
}
