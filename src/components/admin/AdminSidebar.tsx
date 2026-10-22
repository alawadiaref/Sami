"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Permission } from "@/lib/admins-types";

interface SidebarAdmin {
  name: string;
  role: "owner" | "admin";
  permissions: Permission[];
}

type NavItem = { href: string; label: string; icon: React.ReactNode; permission?: Permission };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "الرئيسية",
    items: [{ href: "/admin", label: "لوحة القيادة", icon: <IconGauge /> }],
  },
  {
    title: "المتجر",
    items: [
      { href: "/admin/products", label: "المنتجات", icon: <IconWatch />, permission: "products" },
      { href: "/admin/orders", label: "الطلبات", icon: <IconBox />, permission: "orders" },
      { href: "/admin/offers", label: "العروض والتخفيضات", icon: <IconTag />, permission: "offers" },
    ],
  },
  {
    title: "واجهة المتجر",
    items: [
      { href: "/admin/versions", label: "النسخ والقوالب", icon: <IconLayers />, permission: "theme" },
      { href: "/admin/theme", label: "الألوان والاسم", icon: <IconDrop />, permission: "theme" },
      { href: "/admin/content", label: "محتوى الموقع", icon: <IconPen />, permission: "content" },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { href: "/admin/team", label: "المشرفون", icon: <IconUsers />, permission: "team" },
      { href: "/admin/settings", label: "الإعدادات", icon: <IconGear />, permission: "settings" },
    ],
  },
];

export default function AdminSidebar({ admin }: { admin: SidebarAdmin | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  // close the phone drawer after navigating
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    if (open) setOpen(false);
  }

  const can = (item: NavItem) =>
    !item.permission || admin?.role === "owner" || admin?.permissions.includes(item.permission);

  const current = groups.flatMap((g) => g.items).find((i) => i.href === pathname);

  return (
    <>
      {/* phone top bar */}
      <div className="adm-topbar">
        <button
          type="button"
          className="adm-icon-btn"
          aria-label="فتح القائمة"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <IconMenu />
        </button>
        <span className="adm-topbar-title">{current?.label ?? "لوحة التحكم"}</span>
        <a href="/" target="_blank" rel="noopener" className="adm-icon-btn" aria-label="عرض المتجر">
          <IconEye />
        </a>
      </div>

      {open && <div className="adm-scrim" onClick={() => setOpen(false)} />}

      <aside className={`adm-side${open ? " is-open" : ""}`} aria-label="أقسام لوحة التحكم">
        <div className="adm-brand">
          <span className="adm-brand-mark">
            <IconWatch />
          </span>
          <div>
            <strong>لوحة التحكم</strong>
            {admin && <small>{admin.role === "owner" ? `${admin.name} · المالك` : `${admin.name} · مشرف`}</small>}
          </div>
          <button type="button" className="adm-icon-btn adm-close" aria-label="إغلاق القائمة" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <nav className="adm-nav">
          {groups.map((g) => {
            const items = g.items.filter(can);
            if (items.length === 0) return null;
            return (
              <div key={g.title} className="adm-nav-group">
                <p>{g.title}</p>
                {items.map((item) => {
                  const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`adm-nav-item${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="adm-nav-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener" className="adm-nav-item">
            <span className="adm-nav-icon">
              <IconEye />
            </span>
            عرض المتجر
          </a>
          <button
            onClick={async () => {
              await fetch("/api/auth/login", { method: "DELETE" });
              router.push("/admin/login");
              router.refresh();
            }}
            className="adm-nav-item adm-logout"
          >
            <span className="adm-nav-icon">
              <IconOut />
            </span>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}

/* ---- small line icons (stroke = currentColor) ---- */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
function IconGauge() {
  return <Svg><path d="M4 17a8 8 0 1 1 16 0" /><path d="M12 17l4-5" /><circle cx="12" cy="17" r="1.2" /></Svg>;
}
function IconWatch() {
  return <Svg><circle cx="12" cy="12" r="6" /><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3M12 9.5V12l1.5 1.5" /></Svg>;
}
function IconBox() {
  return <Svg><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" /></Svg>;
}
function IconTag() {
  return <Svg><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></Svg>;
}
function IconLayers() {
  return <Svg><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></Svg>;
}
function IconDrop() {
  return <Svg><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></Svg>;
}
function IconPen() {
  return <Svg><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" /></Svg>;
}
function IconUsers() {
  return <Svg><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></Svg>;
}
function IconGear() {
  return <Svg><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></Svg>;
}
function IconEye() {
  return <Svg><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>;
}
function IconOut() {
  return <Svg><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></Svg>;
}
function IconMenu() {
  return <Svg><path d="M4 7h16M4 12h16M4 17h10" /></Svg>;
}
