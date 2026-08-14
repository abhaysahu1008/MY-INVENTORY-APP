import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

export function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-")  // Replace spaces with hyphens
    .replace(/^-+|-+$/g, "");  // Trim hyphens from start/end
}

export interface tokenPayload {
  id: number;
  role: Role;
}

export function decodeTokenHelper(token: string): tokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");

    const decoded = jwt.verify(token, secret) as tokenPayload;
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}
