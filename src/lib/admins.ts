import fs from "fs";
import path from "path";
import { Admin } from "./admins-types";

export type { Admin, AdminRole, Permission } from "./admins-types";
export { ALL_PERMISSIONS, adminHasPermission } from "./admins-types";

const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");
const ADMINS_EXAMPLE_PATH = path.join(process.cwd(), "data", "admins.example.json");

export function getAdmins(): Admin[] {
  // data/admins.json holds real credentials and is gitignored (see README) —
  // on a fresh clone it won't exist yet, so fall back to the example seed
  // (default owner: admin / changeme123) until the first real write happens.
  try {
    return JSON.parse(fs.readFileSync(ADMINS_PATH, "utf-8"));
  } catch {
    return JSON.parse(fs.readFileSync(ADMINS_EXAMPLE_PATH, "utf-8"));
  }
}

export function saveAdmins(admins: Admin[]): void {
  fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf-8");
}

export function findAdminById(id: string): Admin | undefined {
  return getAdmins().find((a) => a.id === id);
}

export function findAdminByCredentials(username: string, password: string): Admin | undefined {
  return getAdmins().find((a) => a.username === username && a.password === password);
}

export function usernameTaken(username: string): boolean {
  return getAdmins().some((a) => a.username === username);
}

export function createAdmin(admin: Omit<Admin, "id" | "createdAt">): Admin {
  const admins = getAdmins();
  const newAdmin: Admin = {
    ...admin,
    id: `admin-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  saveAdmins(admins);
  return newAdmin;
}

export function deleteAdmin(id: string): void {
  const admins = getAdmins().filter((a) => a.id !== id || a.role === "owner");
  saveAdmins(admins);
}

export function updateAdminPermissions(id: string, permissions: Admin["permissions"]): Admin | undefined {
  const admins = getAdmins();
  const admin = admins.find((a) => a.id === id);
  if (admin && admin.role !== "owner") {
    admin.permissions = permissions;
    saveAdmins(admins);
  }
  return admin;
}
