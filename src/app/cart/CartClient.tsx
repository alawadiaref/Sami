"use client";

import { useMemo } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/products-types";
import type { Product } from "@/lib/products-types";
import ImageCarousel from "@/components/ImageCarousel";

export default function CartClient({ allProducts }: { allProducts: Product[] }) {
  const { items, total, updateQty, removeItem } = useCart();

  // "نواقص" — products sharing a tag with something already in the cart,
  // that the customer hasn't added yet: a lightweight "complete your order" prompt.
  const suggestions = useMemo(() => {
    const inCartIds = new Set(items.map((i) => i.productId));
    const cartTags = new Set(items.map((i) => i.tag));
    return allProducts
      .filter((p) => !inCartIds.has(p.id) && (cartTags.size === 0 || cartTags.has(p.tag)))
      .slice(0, 4);
  }, [items, allProducts]);

  if (items.length === 0) {
    return (
      <div style={{ padding: "80px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>سلتك فارغة</div>
        <div style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>لم تُضِف أي منتج إلى سلتك بعد.</div>
        <a href="/store" className="btn-primary">
          تصفّح المنتجات
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 64px 100px", display: "flex", gap: 50, flexWrap: "wrap" }}>
      <div style={{ flex: "2 1 480px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 28 }}>سلة التسوق</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((item) => (
            <div
              key={item.productId}
              className="glass-panel"
              style={{ display: "flex", alignItems: "center", gap: 18, padding: 16, borderRadius: 12 }}
            >
              <div style={{ width: 84, flexShrink: 0 }}>
                <ImageCarousel images={item.image ? [item.image] : []} height={70} rounded={8} speedMs={0} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{item.tag}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn-ghost" style={{ width: 30, height: 30, padding: 0 }} onClick={() => updateQty(item.productId, item.qty - 1)}>
                  −
                </button>
                <span style={{ minWidth: 22, textAlign: "center" }}>{item.qty}</span>
                <button className="btn-ghost" style={{ width: 30, height: 30, padding: 0 }} onClick={() => updateQty(item.productId, item.qty + 1)}>
                  +
                </button>
              </div>
              <div style={{ width: 100, textAlign: "left", fontWeight: 800 }}>{formatPrice(item.price * item.qty)}</div>
              <button onClick={() => removeItem(item.productId)} className="btn-danger" style={{ padding: "6px 12px" }}>
                حذف
              </button>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>أكمل طلبك — قد يعجبك أيضًا</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
              {suggestions.map((p) => (
                <a key={p.id} href={`/store/${p.id}`} style={{ background: "var(--color-panel)", borderRadius: 8, overflow: "hidden", display: "block" }}>
                  <ImageCarousel images={p.images ?? []} height={110} rounded={0} speedMs={0} />
                  <div style={{ padding: 10, fontSize: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontWeight: 900 }}>{formatPrice(p.price)}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: "1 1 280px" }}>
        <div className="glass-panel" style={{ padding: 24, borderRadius: 14, position: "sticky", top: 110 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>ملخص الطلب</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "var(--color-text-muted)" }}>
            <span>عدد القطع</span>
            <span>{items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 18, fontWeight: 900 }}>
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>
          <a href="/checkout" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            إتمام الطلب
          </a>
        </div>
      </div>
    </div>
  );
}
