import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { adminHasPermission, Permission } from "@/lib/admins";

/** Call at the top of a server-component admin page to enforce a permission. */
export async function requirePagePermission(permission: Permission) {
  const cookieStore = await cookies();
  const admin = await getAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!admin || !adminHasPermission(admin, permission)) {
    redirect("/admin");
  }
}
