import { cookies } from "next/headers";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const admin = await getAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <div
      className="admin-scope"
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 15% 0%, rgba(61,92,255,.08), transparent 60%), #080a14",
      }}
    >
      <AdminSidebar admin={admin ? { name: admin.name, role: admin.role, permissions: admin.permissions } : null} />
      <main style={{ flex: 1, padding: "32px 44px" }}>{children}</main>
    </div>
  );
}
