"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";


export async function registerUser(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!companyName || !name || !email || !password) {
    return { error: "All fields are required." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "A user with this email address already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      const defaultWarehouse = await tx.warehouse.create({
        data: {
          companyId: company.id,
          name: "Main Warehouse",
        },
      });

      await tx.user.create({
        data: {
          companyId: company.id,
          warehouseId: defaultWarehouse.id,
          name,
          email,
          password: hashedPassword,
          role: Role.OWNER,
        },
      });
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Failed to create account. Please try again." };
  }

  redirect("/login");
}

//login
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      company: true,
      warehouse: true,
    },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }


  redirect("/dashboard");
}
