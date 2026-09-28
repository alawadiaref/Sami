import { Customer } from "./customers-types";
import { findCustomerByCredentials, findCustomerById } from "./customers";

// Session for storefront customers — mirrors src/lib/auth.ts (admin auth) but
// kept fully separate: its own cookie name/secret so a customer session can
// never be confused with an admin session.

const SESSION_COOKIE = "customer_session";
const SECRET = process.env.CUSTOMER_SESSION_SECRET || "dev-only-customer-secret-change-me";

export const CUSTOMER_SESSION_COOKIE_NAME = SESSION_COOKIE;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(sig);
}

async function sign(value: string): Promise<string> {
  return `${value}.${await hmac(value)}`;
}

async function verify(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx === -1) return null;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(value);
  return sig === expected ? value : null;
}

export function checkCustomerCredentials(email: string, password: string): Customer | undefined {
  return findCustomerByCredentials(email, password);
}

export async function createCustomerSessionCookie(customerId: string): Promise<string> {
  return sign(customerId);
}

export async function getCustomerFromToken(token: string | undefined): Promise<Customer | null> {
  const id = await verify(token);
  if (!id) return null;
  return findCustomerById(id) ?? null;
}
