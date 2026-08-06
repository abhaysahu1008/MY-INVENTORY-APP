"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface JWTPayload {
  id: number;
  role: string;
}

export async function createCompany(formData: FormData) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    return { error: "Not authenticated. Please log in." };
  }

  let decoded: JWTPayload;
  try {
    decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as JWTPayload;
  } catch {
    return { error: "Invalid or expired session. Please log in again." };
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.role !== "OWNER") {
    return { error: "Only owners can create a company." };
  }

  if (user.companyId) {
    return { error: "You already have a company assigned." };
  }

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const logo = (formData.get("logo") as string) || null;

  if (!name || name.trim() === "") {
    return { error: "Company name is required." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name,
          email,
          phone,
          address,
          logoUrl: logo,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { companyId: company.id },
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Database error creating company:", err);
    return { error: "Failed to create company. Please try again." };
  }

}
