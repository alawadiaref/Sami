import fs from "fs";
import path from "path";
import { StoredCart } from "./carts-types";

export type { StoredCart } from "./carts-types";

// STUB "DATABASE" for live/abandoned carts — same pattern as the rest of
// lib/*.ts. Used by the abandoned-cart notification job (see
// src/app/api/cron/abandoned-carts/route.ts) to find carts nobody finished.

const CARTS_PATH = path.join(process.cwd(), "data", "carts.json");

export function getCarts(): StoredCart[] {
  try {
    return JSON.parse(fs.readFileSync(CARTS_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function saveCarts(carts: StoredCart[]): void {
  fs.writeFileSync(CARTS_PATH, JSON.stringify(carts, null, 2), "utf-8");
}

export function upsertCart(data: {
  cartId: string;
  items: StoredCart["items"];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}): void {
  const carts = getCarts();
  const existing = carts.find((c) => c.cartId === data.cartId);
  const now = new Date().toISOString();

  if (data.items.length === 0) {
    // an emptied cart is no longer "abandoned" — drop it
    saveCarts(carts.filter((c) => c.cartId !== data.cartId));
    return;
  }

  if (existing) {
    existing.items = data.items;
    existing.customerName = data.customerName ?? existing.customerName;
    existing.customerPhone = data.customerPhone ?? existing.customerPhone;
    existing.customerEmail = data.customerEmail ?? existing.customerEmail;
    existing.updatedAt = now;
    // any further activity means the cart is live again, not abandoned
    existing.notifiedAt = undefined;
  } else {
    carts.push({ cartId: data.cartId, items: data.items, customerName: data.customerName, customerPhone: data.customerPhone, customerEmail: data.customerEmail, updatedAt: now });
  }
  saveCarts(carts);
}

export function markCartCompleted(cartId: string): void {
  const carts = getCarts();
  const cart = carts.find((c) => c.cartId === cartId);
  if (cart) {
    cart.completed = true;
    saveCarts(carts);
  }
}

export function markCartNotified(cartId: string): void {
  const carts = getCarts();
  const cart = carts.find((c) => c.cartId === cartId);
  if (cart) {
    cart.notifiedAt = new Date().toISOString();
    saveCarts(carts);
  }
}

/** Carts untouched for at least `minutes` minutes, never notified, never completed, non-empty. */
export function findAbandonedCarts(minutes: number): StoredCart[] {
  const cutoff = Date.now() - minutes * 60 * 1000;
  return getCarts().filter(
    (c) => !c.completed && !c.notifiedAt && c.items.length > 0 && new Date(c.updatedAt).getTime() < cutoff
  );
}
