import { cookies } from "next/headers";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const admin = await getAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <div className="admin-scope adm-shell">
      <AdminSidebar admin={admin ? { name: admin.name, role: admin.role, permissions: admin.permissions } : null} />
      <main className="adm-main">{children}</main>
    </div>
  );
}
