export function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-")  // Replace spaces with hyphens
    .replace(/^-+|-+$/g, "");  // Trim hyphens from start/end
}
