"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { decodeTokenHelper } from "../utils/helper";

export async function AddProductAction(formData: FormData) {
  try {
    // 1. Authenticate user session
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Authentication token missing." };
    }

    const decodedToken = decodeTokenHelper(token);
    if (!decodedToken?.id) {
      return { error: "Invalid or expired token." };
    }

    // 2. Authorize user and verify company context
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

    // 3. Extract and parse form fields
    const name = formData.get("name") as string;
    const categoryName = formData.get("categoryName") as string;
    const productDesc = formData.get("productDesc") as string;
    const minStock = formData.get("minStock") as string;
    const sellingPrice = formData.get("sellingPrice") as string; // Standardized to lowercase
    const costPrice = formData.get("costPrice") as string;
    const sku = formData.get("sku") as string;

    if (!name || name.trim() === "") {
      return { error: "Product name is required." };
    }

    if (!categoryName || categoryName.trim() === "") {
      return { error: "Category selection is required." };
    }

    // 4. Find or resolve category ID
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return { error: "Selected category does not exist." };
    }

    // 5. Create product with type-casted numerical fields
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

    // 6. Refresh cached Next.js product pages automatically
    revalidatePath("/products");

    return {
      success: true,
      message: "Product created successfully!",
      productId: newProduct.id
    };

  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Something went wrong! Please try again." };
  }
}
