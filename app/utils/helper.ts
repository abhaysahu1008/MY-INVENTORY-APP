import jwt from "jsonwebtoken";


export type UserRole = "OWNER" | "MANAGER" | "EMPLOYEE";

export interface TokenPayload {
  id: number;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export function createSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function decodeTokenHelper(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing from environment variables.");
      return null;
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;

    return {
      ...decoded,
      id: Number(decoded.id),
    };
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}
