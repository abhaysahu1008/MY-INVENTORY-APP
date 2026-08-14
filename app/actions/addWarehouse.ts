"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { decodeTokenHelper } from "../utils/helper";

export async function addWarehouseAction(formData: FormData) {
  try {
    // 1. Get and convert companyId from string to actual number
    const rawCompanyId = formData.get("companyId");
    if (!rawCompanyId) {
      return { error: "Company ID is required!" };
    }
    const companyId = Number(rawCompanyId);

    // 2. Safely get the token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Unauthorized: Please log in." };
    }

    // 3. Decode token and verify it is not null
    const decodedToken = decodeTokenHelper(token);
    if (!decodedToken) {
      return { error: "Invalid or expired session. Please log in again." };
    }

    // 4. Query user by unique ID
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user || user.role !== "OWNER") {
      return { error: "Warehouses can only be added by an Owner!" };
    }

    // 5. Extract form fields
    const name = formData.get("name")?.toString();
    const address = formData.get("address")?.toString() || null;
    const phone = formData.get("phone")?.toString() || null;

    if (!name) {
      return { error: "Warehouse name is required!" };
    }

    await prisma.warehouse.create({
      data: {
        companyId,
        name,
        phone,
        address,
      },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Add warehouse action error:", error);
    return { error: "Something went wrong on the server!" };
  }
}
