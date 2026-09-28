"use client";

import { useEffect, useState } from "react";
import { ThemeConfig } from "@/lib/theme-types";

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/theme")
      .then((r) => r.json())
      .then(setTheme);
  }, []);

  if (!theme) return null;

  const colorFields: { key: keyof ThemeConfig["colors"]; label: string }[] = [
    { key: "bg", label: "الخلفية الأساسية" },
    { key: "panel", label: "خلفية اللوحات" },
    { key: "panel2", label: "خلفية اللوحات (تدرج)" },
    { key: "accent", label: "اللون المميز (Accent)" },
    { key: "text", label: "لون النص" },
  ];

  async function save() {
    if (!theme) return;
    await fetch("/api/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>المظهر والألوان</h1>

      <div className="glass-panel" style={{ padding: 24, maxWidth: 480 }}>
        <label style={{ display: "block", marginBottom: 20 }}>
          <div style={{ fontSize: 13, marginBottom: 6, color: "var(--color-text-muted)" }}>اسم المتجر</div>
          <input
            value={theme.storeName}
            onChange={(e) => setTheme({ ...theme, storeName: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 4,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              color: "#fff",
            }}
          />
        </label>

        {colorFields.map((f) => (
          <label key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="color"
                value={/^#/.test(theme.colors[f.key]) ? theme.colors[f.key] : "#000000"}
                onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, [f.key]: e.target.value } })}
                style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }}
              />
              <input
                dir="ltr"
                value={theme.colors[f.key]}
                onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, [f.key]: e.target.value } })}
                style={{
                  width: 130,
                  padding: "8px 10px",
                  borderRadius: 4,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg)",
                  color: "#fff",
                  fontSize: 13,
                  textAlign: "left",
                }}
              />
            </div>
          </label>
        ))}

        <button onClick={save} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 12, maxWidth: 480 }}>
        التغييرات تنعكس فورًا على الموقع بعد الحفظ (قد تحتاج تحديث الصفحة).
      </p>
    </div>
  );
}
