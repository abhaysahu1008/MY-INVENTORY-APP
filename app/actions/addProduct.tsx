"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { decodeTokenHelper } from "../utils/helper";

type id = string;

export async function AddProductAction(formData: FormData) {
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
      where: { id: Number(decodedToken.id) },
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
      return { error: "Unauthorized access. Only Owners and Managers can add products." };
    }

    if (!user.companyId) {
      return { error: "No company associated with this account." };
    }

    const name = formData.get("productName") as string;
    const categoryId = formData.get("categoryName") as string; // Receiving category ID from select
    const productDesc = formData.get("productDesc") as string;
    const minStock = formData.get("minStock") as string;
    const sellingPrice = formData.get("SellingPrice") as string; // FIXED: Capital 'S' to match form input
    const costPrice = formData.get("costPrice") as string;
    const sku = formData.get("sku") as string;
    const companySlug = formData.get("companySlug") as string;

    if (!name || name.trim() === "") {
      return { error: "Product name is required." };
    }

    if (!categoryId || categoryId.trim() === "") {
      return { error: "Category selection is required." };
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        companyId: user.companyId
      },
    });

    if (!category) {
      return { error: "Selected category does not exist or access is restricted." };
    }

    // 4. Create Product
    const newProduct = await prisma.product.create({
      data: {
        companyId: user.companyId,
        name: name.trim(),
        sku: sku ? sku.trim() : `SKU-${Date.now()}`,
        description: productDesc ? productDesc.trim() : null,
        minStock: minStock ? parseInt(minStock, 10) : 5,
        price: parseFloat(sellingPrice) || 0,
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        categoryId: category.id,
      },
    });

    revalidatePath(`/dashboard/${companySlug}`);

    return {
      success: true,
      message: "Product created successfully!",
      productId: newProduct.id,
    };

  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Something went wrong! Please try again." };
  }
}
