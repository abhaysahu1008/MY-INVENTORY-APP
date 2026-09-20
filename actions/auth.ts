"use server";

import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../app/lib/prisma";
import { createSlug } from "../app/utils/helper";

// Helper to ensure JWT_SECRET is present
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }
  return secret;
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists!" };
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "OWNER",
        companyId: null,
        warehouseId: null,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      getJwtSecret(),
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!existingUser) {
      return { error: "Invalid email or password." };
    }

    const isValidPass = await bcrypt.compare(password, existingUser.password);

    if (!isValidPass) {
      return { error: "Invalid email or password." };
    }

    const token = jwt.sign(
      { id: existingUser.id, role: existingUser.role },
      getJwtSecret(),
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        companySlug: existingUser.company?.name
          ? createSlug(existingUser.company.name)
          : null,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  redirect("/login");
}
