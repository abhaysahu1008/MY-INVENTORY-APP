"use server";

import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";

export async function createStaff(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie?.value) {
      return { error: "Unauthorized. Please log in." };
    }

    const decoded = jwt.verify(
      tokenCookie.value,
      process.env.JWT_SECRET!
    ) as { id: number; role: Role };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || (user.role !== "OWNER" && user.role !== "MANAGER")) {
      return { error: "Unauthorized. Only owner and manager can create staff." };
    }

    if (!user.companyId) {
      return { error: "Please set up your company before adding staff." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role;

    if (!name || !email || !password || !role) {
      return { error: "All fields are required." };
    }

    const hashedPassword = await hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        companyId: user.companyId,
      },
    });

    return { success: true, staffId: newStaff.id };
  } catch (error) {
    console.error("Error creating staff:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
