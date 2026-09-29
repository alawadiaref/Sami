export type Permission =
  | "products"
  | "orders"
  | "offers"
  | "theme"
  | "content"
  | "analytics"
  | "team"
  | "settings";

export const ALL_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "products", label: "المنتجات" },
  { key: "orders", label: "الطلبات" },
  { key: "offers", label: "العروض والتخفيضات" },
  { key: "theme", label: "المظهر والألوان" },
  { key: "content", label: "محتوى الموقع" },
  { key: "analytics", label: "الإحصائيات" },
  { key: "team", label: "إدارة المشرفين" },
  { key: "settings", label: "الإعدادات" },
];

export type AdminRole = "owner" | "admin";

export interface Admin {
  id: string;
  name: string;
  username: string;
  password: string; // plain in this stub — swap for a hashed password once a real DB is wired up
  role: AdminRole;
  permissions: Permission[]; // ignored for role "owner" (owner always has everything)
  createdAt: string;
}

export function adminHasPermission(admin: Admin, permission: Permission): boolean {
  return admin.role === "owner" || admin.permissions.includes(permission);
}
