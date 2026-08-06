"use server";

import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";

export async function createStaff(formData: FormData) {

  console.log(formData);

  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");



    if (!tokenCookie?.value) {
      return { error: "Unauthorized. Please log in." };
    }

    const decoded = jwt.verify(
      tokenCookie.value,
      process.env.JWT_SECRET!
    ) as { id: number; role: string };

    const owner = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!owner || owner.role !== "OWNER") {
      return { error: "Unauthorized. Only owners can create staff." };
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
        companyId: owner.companyId,
      },
    });

    return { success: true, staffId: newStaff.id };
  } catch (error) {
    console.error("Error creating staff:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
