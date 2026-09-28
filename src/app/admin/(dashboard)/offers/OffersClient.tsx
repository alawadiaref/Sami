"use client";

import { useEffect, useState } from "react";
import { Product, formatPrice, discountedPrice } from "@/lib/products-types";

export default function AdminOffersPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function updateOffer(id: string, patch: Partial<Product>) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>العروض والتخفيضات</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 28 }}>
        فعّل خصمًا على أي منتج وحدد نسبته — يظهر فورًا على الموقع مع شارة العرض.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {products.map((p) => (
          <div key={p.id} className="glass-panel" style={{ padding: 18, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                السعر الأصلي: {formatPrice(p.price)}
                {p.offerActive && p.discountPercent ? ` → السعر بعد الخصم: ${formatPrice(discountedPrice(p))}` : ""}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              نسبة الخصم %
              <input
                type="number"
                min={0}
                max={90}
                defaultValue={p.discountPercent ?? 0}
                onBlur={(e) => updateOffer(p.id, { discountPercent: Number(e.target.value) })}
                style={{ width: 70, padding: "6px 8px", borderRadius: 4, background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "#fff" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              اسم العرض
              <input
                type="text"
                defaultValue={p.offerLabel ?? ""}
                placeholder="مثال: عرض نهاية الأسبوع"
                onBlur={(e) => updateOffer(p.id, { offerLabel: e.target.value })}
                style={{ width: 160, padding: "6px 8px", borderRadius: 4, background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "#fff" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!p.offerActive} onChange={(e) => updateOffer(p.id, { offerActive: e.target.checked })} />
              مفعّل
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
