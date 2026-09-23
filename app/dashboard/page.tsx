import { Role } from "../../app/generated/prisma/enums";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
;
import { prisma } from "../lib/prisma";
import { createSlug } from "../utils/helper";
import OwnerPage from "../../components/OwnerPage";
import ManagerPage from "../../components/ManagerPage";

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

  if (targetSlug !== decodedCompanyParam) {

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
