"use server";

import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import { decodeTokenHelper } from "../utils/helper";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Authentication token missing." };
    }

    const decodedToken = decodeTokenHelper(token);

    if (!decodedToken?.id) {
      return { error: "Invalid or expired token." };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(decodedToken.id),
      },
      select: {
        id: true,
        role: true,
        companyId: true,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.role !== "OWNER" && user.role !== "MANAGER") {
      return { error: "Unauthorized access. Only Owners and Managers can add categories." };
    }

    if (!user.companyId) {
      return { error: "No company associated with this account." };
    }

    const categoryName = formData.get("categoryName") as string;

    if (!categoryName || categoryName.trim() === "") {
      return { error: "Category name is required." };
    }

    const newCategory = await prisma.category.create({
      data: {
        companyId: user.companyId,
        name: categoryName.trim(),
      },
    });

    revalidatePath("/dashboard");

    return { success: true, message: "Category created successfully!" };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Something went wrong! Please try again." };
  }
}
