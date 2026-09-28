"use client";

import { useEffect, useState } from "react";
import { ALL_PERMISSIONS, Permission } from "@/lib/admins-types";

interface SafeAdmin {
  id: string;
  name: string;
  username: string;
  role: "owner" | "admin";
  permissions: Permission[];
}

export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<SafeAdmin[]>([]);
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [newPermissions, setNewPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admins");
    if (res.ok) setAdmins(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, permissions: newPermissions }),
    });
    if (res.ok) {
      setForm({ name: "", username: "", password: "" });
      setNewPermissions([]);
      load();
    } else {
      const data = await res.json();
      setError(data.error ?? "خطأ");
    }
  }

  async function togglePermission(admin: SafeAdmin, perm: Permission) {
    const next = admin.permissions.includes(perm)
      ? admin.permissions.filter((p) => p !== perm)
      : [...admin.permissions, perm];
    await fetch(`/api/admins/${admin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: next }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admins/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>إدارة المشرفين</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 28 }}>
        أنشئ حسابات مشرفين جدد وحدد بالضبط أي أقسام من لوحة التحكم يقدرون يوصلونها.
      </p>

      <form
        onSubmit={addAdmin}
        className="glass-panel"
        style={{ padding: 22, marginBottom: 32, maxWidth: 620 }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>إضافة مشرف جديد</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
          <input placeholder="اسم المستخدم" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={inputStyle} required />
          <input placeholder="كلمة المرور" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8 }}>الصلاحيات:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          {ALL_PERMISSIONS.map((p) => (
            <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={newPermissions.includes(p.key)}
                onChange={(e) =>
                  setNewPermissions((prev) => (e.target.checked ? [...prev, p.key] : prev.filter((x) => x !== p.key)))
                }
              />
              {p.label}
            </label>
          ))}
        </div>
        {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="btn-primary">
          إضافة المشرف
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {admins.map((a) => (
          <div key={a.id} className="glass-panel" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: a.role === "owner" ? 0 : 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                <div dir="ltr" style={{ fontSize: 12, color: "var(--color-text-muted)", textAlign: "right" }}>
                  @{a.username}
                </div>
              </div>
              {a.role === "owner" ? (
                <span style={{ fontSize: 12, color: "var(--color-accent)", fontWeight: 700 }}>المالك — كل الصلاحيات</span>
              ) : (
                <button onClick={() => remove(a.id)} className="btn-danger">
                  حذف
                </button>
              )}
            </div>
            {a.role !== "owner" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ALL_PERMISSIONS.map((p) => (
                  <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <input type="checkbox" checked={a.permissions.includes(p.key)} onChange={() => togglePermission(a, p.key)} />
                    {p.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "#fff",
};
