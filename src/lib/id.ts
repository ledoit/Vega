export function newId(): string {
  return crypto.randomUUID();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "album";
}

export function deliveryToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
