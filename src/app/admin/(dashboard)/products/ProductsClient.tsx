"use client";

import { useEffect, useState } from "react";
import { Product, formatPrice } from "@/lib/products-types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", tag: "", price: 0, stock: 0 });

  async function load() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", tag: "", price: 0, stock: 0 });
    load();
  }

  async function updateStock(id: string, stock: number) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>المنتجات</h1>

      <form
        onSubmit={addProduct}
        className="glass-panel"
        style={{ display: "flex", gap: 10, marginBottom: 30, padding: 16 }}
      >
        <input
          placeholder="اسم المنتج"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          placeholder="التصنيف"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="number"
          placeholder="السعر"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          style={inputStyle}
          required
        />
        <input
          type="number"
          placeholder="المخزون"
          value={form.stock || ""}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          style={inputStyle}
          required
        />
        <button type="submit" className="btn-primary">
          إضافة
        </button>
      </form>

      <div className="glass-panel" style={{ padding: "6px 20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "right", fontSize: 13, color: "var(--color-text-muted)" }}>
              <th style={thStyle}>الاسم</th>
              <th style={thStyle}>التصنيف</th>
              <th style={thStyle}>السعر</th>
              <th style={thStyle}>المخزون</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.tag}</td>
                <td style={tdStyle}>{formatPrice(p.price)}</td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => updateStock(p.id, Number(e.target.value))}
                    style={{ ...inputStyle, width: 70 }}
                  />
                </td>
                <td style={tdStyle}>
                  <button onClick={() => remove(p.id)} className="btn-danger">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 4,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "#fff",
  flex: 1,
};

const thStyle: React.CSSProperties = { padding: "10px 8px" };
const tdStyle: React.CSSProperties = { padding: "10px 8px", fontSize: 14 };
