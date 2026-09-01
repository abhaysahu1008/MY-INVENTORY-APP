"use server";

import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

interface JwtPayload {
  id: number;
  role: Role;
}

export async function supplierAction(formData: FormData) {
  // 1. Authenticate user from session cookie (Never trust client inputs for companyId)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Unauthorized. Please log in." };
  }

  let userId: number;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = Number(decoded.id);
  } catch {
    return { error: "Invalid or expired session token." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      companyId: true,
      company: { select: { name: true } },
    },
  });

  if (!user || !user.companyId) {
    return { error: "User is not associated with a valid company." };
  }

  if (user.role !== Role.OWNER && user.role !== Role.MANAGER) {
    return { error: "Access denied. Only Owners and Managers can add suppliers." };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;

  if (!name || name.trim() === "") {
    return { error: "Supplier name is required." };
  }

  try {
    await prisma.supplier.create({
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        companyId: user.companyId,
      },
    });

    if (user.company?.name) {
      revalidatePath(`/dashboard/${user.company.name}`);
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to create supplier:", err);
    return { error: "Failed to create supplier. Please try again." };
  }
}
