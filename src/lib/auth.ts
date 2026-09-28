import { NextRequest, NextResponse } from "next/server";
import { Admin, Permission, adminHasPermission, findAdminById, findAdminByCredentials } from "./admins";

// Session: a signed cookie carrying the admin's id (Web Crypto so it also
// runs in the Edge/proxy runtime). Swap for real auth (NextAuth etc.) later —
// getSessionAdmin()/requireAdmin() below are the only entry points the rest
// of the app depends on.

const SESSION_COOKIE = "admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-only-secret-change-me";

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

export function checkCredentials(username: string, password: string): Admin | undefined {
  return findAdminByCredentials(username, password);
}

export async function createSessionCookie(adminId: string): Promise<string> {
  return sign(adminId);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Server Components / API routes with access to cookies() can use this. */
export async function getSessionAdminId(token: string | undefined): Promise<string | null> {
  return verify(token);
}

export async function getAdminFromToken(token: string | undefined): Promise<Admin | null> {
  const id = await verify(token);
  if (!id) return null;
  return findAdminById(id) ?? null;
}

/** Use inside API routes: returns a 401/403 NextResponse if not authorized, otherwise null. */
export async function requireAdmin(req: NextRequest, permission?: Permission): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const admin = await getAdminFromToken(token);
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  if (permission && !adminHasPermission(admin, permission)) {
    return NextResponse.json({ error: "لا تملك صلاحية لهذا الإجراء" }, { status: 403 });
  }
  return null;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  return (await verify(token)) !== null;
}
