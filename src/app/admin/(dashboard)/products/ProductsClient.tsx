"use client";

import React, { useEffect, useState } from "react";
import { Product, formatPrice } from "@/lib/products-types";
import ImageCarousel from "@/components/ImageCarousel";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", tag: "", price: 0, stock: 0 });
  const [galleryOpenFor, setGalleryOpenFor] = useState<string | null>(null);

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

  async function patchProduct(id: string, body: Partial<Product>) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function updateStock(id: string, stock: number) {
    await patchProduct(id, { stock });
  }

  async function remove(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  async function addImages(product: Product, files: FileList) {
    const dataUrls = await Promise.all(Array.from(files).map(fileToDataUrl));
    await patchProduct(product.id, { images: [...(product.images ?? []), ...dataUrls] });
  }

  async function removeImage(product: Product, index: number) {
    const images = (product.images ?? []).filter((_, i) => i !== index);
    await patchProduct(product.id, { images });
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
              <React.Fragment key={p.id}>
                <tr style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
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
                  <td style={{ ...tdStyle, display: "flex", gap: 8 }}>
                    <button onClick={() => setGalleryOpenFor(galleryOpenFor === p.id ? null : p.id)} className="btn-ghost">
                      {galleryOpenFor === p.id ? "إغلاق" : "الصور والمعرض"}
                    </button>
                    <button onClick={() => remove(p.id)} className="btn-danger">
                      حذف
                    </button>
                  </td>
                </tr>
                {galleryOpenFor === p.id && (
                  <tr>
                    <td colSpan={5} style={{ padding: "16px 8px" }}>
                      <div className="glass-panel" style={{ padding: 18, display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div style={{ width: 200 }}>
                          <ImageCarousel
                            images={p.images ?? []}
                            name={p.carouselName}
                            speedMs={p.carouselSpeedMs ?? 3500}
                            transition={p.carouselTransition ?? "fade"}
                            height={150}
                            rounded={8}
                          />
                        </div>
                        <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <label style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                            إضافة صور
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => e.target.files && addImages(p, e.target.files)}
                              style={{ display: "block", marginTop: 6 }}
                            />
                          </label>
                          {(p.images ?? []).length > 0 && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {(p.images ?? []).map((img, i) => (
                                <div key={i} style={{ position: "relative" }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={img} alt="" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} />
                                  <button
                                    onClick={() => removeImage(p, i)}
                                    style={{ position: "absolute", top: -6, right: -6, background: "#ff5470", color: "#fff", border: "none", borderRadius: 999, width: 18, height: 18, fontSize: 11, cursor: "pointer" }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <label style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                            اسم شريط الصور
                            <input
                              defaultValue={p.carouselName ?? ""}
                              onBlur={(e) => patchProduct(p.id, { carouselName: e.target.value })}
                              style={inputStyle}
                            />
                          </label>
                          <div style={{ display: "flex", gap: 10 }}>
                            <label style={{ fontSize: 12, color: "var(--color-text-muted)", flex: 1 }}>
                              سرعة التبديل (مللي ثانية)
                              <input
                                type="number"
                                defaultValue={p.carouselSpeedMs ?? 3500}
                                onBlur={(e) => patchProduct(p.id, { carouselSpeedMs: Number(e.target.value) })}
                                style={inputStyle}
                              />
                            </label>
                            <label style={{ fontSize: 12, color: "var(--color-text-muted)", flex: 1 }}>
                              طريقة الانتقال
                              <select
                                defaultValue={p.carouselTransition ?? "fade"}
                                onChange={(e) => patchProduct(p.id, { carouselTransition: e.target.value as "fade" | "slide" })}
                                style={inputStyle}
                              >
                                <option value="fade">تلاشي</option>
                                <option value="slide">انزلاق</option>
                              </select>
                            </label>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
