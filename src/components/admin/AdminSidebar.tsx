"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Permission } from "@/lib/admins-types";

interface SidebarAdmin {
  name: string;
  role: "owner" | "admin";
  permissions: Permission[];
}

const navItems: { href: string; label: string; icon: string; permission?: Permission }[] = [
  { href: "/admin", label: "لوحة القيادة", icon: "▣" },
  { href: "/admin/products", label: "المنتجات", icon: "⌚", permission: "products" },
  { href: "/admin/orders", label: "الطلبات", icon: "▤", permission: "orders" },
  { href: "/admin/offers", label: "العروض والتخفيضات", icon: "%", permission: "offers" },
  { href: "/admin/theme", label: "المظهر والألوان", icon: "◐", permission: "theme" },
  { href: "/admin/team", label: "إدارة المشرفين", icon: "☖", permission: "team" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙", permission: "settings" },
];

export default function AdminSidebar({ admin }: { admin: SidebarAdmin | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const visibleItems = navItems.filter(
    (item) => !item.permission || admin?.role === "owner" || admin?.permissions.includes(item.permission)
  );

  return (
    <aside
      className="glass-panel"
      style={{
        width: 264,
        margin: "16px 0 16px 16px",
        background: "linear-gradient(180deg, rgba(20,26,54,.75), rgba(9,12,26,.75))",
        padding: "26px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        borderRadius: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "linear-gradient(135deg, rgba(102,128,255,.95), rgba(61,92,255,.7))",
            boxShadow: "0 6px 18px rgba(61,92,255,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
          }}
        >
          ⌚
        </div>
        <div style={{ fontWeight: 900, fontSize: 16 }}>لوحة التحكم</div>
      </div>

      {admin && (
        <div
          className="glass-panel"
          style={{
            margin: "6px 4px 18px",
            padding: "13px 14px",
            borderRadius: 14,
            background: "rgba(61,92,255,.09)",
            borderColor: "rgba(61,92,255,.22)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700 }}>{admin.name}</div>
          <div style={{ fontSize: 11, color: "var(--color-accent)", marginTop: 2 }}>
            {admin.role === "owner" ? "المالك — صلاحيات كاملة" : "مشرف"}
          </div>
        </div>
      )}

      {visibleItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-pill${active ? " active" : ""}`}
            style={{
              color: active ? "#fff" : "rgba(255,255,255,.68)",
              fontWeight: active ? 700 : 400,
            }}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 18 }}>
        <button
          onClick={async () => {
            await fetch("/api/auth/login", { method: "DELETE" });
            router.push("/admin/login");
            router.refresh();
          }}
          className="btn-ghost"
          style={{ width: "100%" }}
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
