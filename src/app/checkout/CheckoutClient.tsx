"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, getStoredCartId } from "@/components/CartContext";
import { formatPrice } from "@/lib/products-types";

const PROVIDERS: { value: string; label: string }[] = [
  { value: "card", label: "بطاقة (مدى / فيزا / ماستركارد)" },
  { value: "tabby", label: "تابي (قسّطها)" },
  { value: "tamara", label: "تمارا (قسّطها)" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

export default function CheckoutClient() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", customerPhone: "", paymentProvider: "card" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customer-auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.customer) {
          setForm((f) => ({ ...f, customerName: data.customer.name, customerPhone: data.customer.phone }));
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ padding: "80px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>سلتك فارغة</div>
        <a href="/store" className="btn-primary">
          تصفّح المنتجات
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
          cartId: getStoredCartId(),
          returnUrl: typeof window !== "undefined" ? window.location.origin + "/order/confirmation" : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر إتمام الطلب");
        setLoading(false);
        return;
      }
      clear();
      // Stub gateways resolve instantly; once real ones are wired in, this
      // becomes `router.push(data.redirectUrl)` to send the customer to the
      // hosted payment page first.
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px 64px 100px", display: "flex", gap: 50, flexWrap: "wrap" }}>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ flex: "2 1 420px", padding: 30, borderRadius: 14, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>إتمام الطلب</h1>

        <label style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          الاسم الكامل
          <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          رقم الجوال
          <input required type="tel" dir="ltr" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          طريقة الدفع
          <select value={form.paymentProvider} onChange={(e) => setForm({ ...form, paymentProvider: e.target.value })} style={inputStyle}>
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {error && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 10 }}>
          {loading ? "جارٍ التنفيذ..." : `الدفع — ${formatPrice(total)}`}
        </button>
      </form>

      <div style={{ flex: "1 1 260px" }}>
        <div className="glass-panel" style={{ padding: 22, borderRadius: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>ملخص الطلب</div>
          {items.map((i) => (
            <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "var(--color-text-muted)" }}>
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontWeight: 900, fontSize: 16 }}>
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  fontSize: 14,
};
