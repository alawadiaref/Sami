"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/lib/orders-types";

const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: "بانتظار الدفع",
  awaiting_bank_transfer: "بانتظار التحويل البنكي",
  paid: "مدفوع",
  preparing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>الطلبات</h1>
      {orders.length === 0 && <div style={{ color: "var(--color-text-muted)" }}>لا توجد طلبات بعد.</div>}
      {orders.length > 0 && (
        <div className="glass-panel" style={{ padding: "6px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "right", fontSize: 13, color: "var(--color-text-muted)" }}>
                <th style={thStyle}>رقم الطلب</th>
                <th style={thStyle}>العميل</th>
                <th style={thStyle}>الإجمالي</th>
                <th style={thStyle}>الدفع</th>
                <th style={thStyle}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>
                    {o.customerName}
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{o.customerPhone}</div>
                  </td>
                  <td style={tdStyle}>{o.total.toLocaleString("ar-SA")} ر.س</td>
                  <td style={tdStyle}>{o.paymentProvider}</td>
                  <td style={tdStyle}>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      style={{
                        padding: "7px 12px",
                        background: "rgba(255,255,255,.05)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value} style={{ color: "#000" }}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 8px" };
const tdStyle: React.CSSProperties = { padding: "10px 8px", fontSize: 14 };
