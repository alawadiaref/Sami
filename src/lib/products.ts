import fs from "fs";
import path from "path";
import { Product } from "./products-types";

export type { Product } from "./products-types";
export { formatPrice } from "./products-types";

// STUB "DATABASE" for products — same pattern as lib/theme.ts. Swap for a
// real table (Prisma/Postgres etc.) once one exists; keep this file's
// function signatures the same so nothing else has to change.
// Server-only (uses fs) — client components should import from
// "./products-types" instead.

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

export function getProducts(): Product[] {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function saveProducts(products: Product[]): void {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}
