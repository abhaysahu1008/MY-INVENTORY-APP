import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user = null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number | string };

    user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
      include: { company: true },
    });
  } catch (error) {
    console.log(error);

    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  if (user.company?.name) {
    const companySlug = user.company.name.toLowerCase().replace(/\s+/g, "-");
    redirect(`/dashboard/${companySlug}`);
  }

  redirect("/add-company");
}
