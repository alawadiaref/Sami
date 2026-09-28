import { cookies } from "next/headers";
import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { getAnalytics, getVisitsLast7Days } from "@/lib/analytics";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { adminHasPermission } from "@/lib/admins";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const admin = await getAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const canSeeAnalytics = admin ? adminHasPermission(admin, "analytics") : false;
  const canSeeOrders = admin ? adminHasPermission(admin, "orders") : false;

  const orders = getOrders();
  const products = getProducts();
  const analytics = getAnalytics();
  const last7 = getVisitsLast7Days();
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const cards = [
    ...(canSeeOrders
      ? [
          { label: "الطلبات", value: orders.length },
          { label: "بانتظار الدفع", value: orders.filter((o) => o.status === "awaiting_payment" || o.status === "awaiting_bank_transfer").length },
        ]
      : []),
    { label: "المنتجات", value: products.length },
    ...(canSeeAnalytics
      ? [
          { label: "الإيرادات (ر.س)", value: totalRevenue.toLocaleString("ar-SA") },
          { label: "إجمالي الزيارات", value: analytics.totalVisits },
          { label: "زيارات اليوم", value: last7[last7.length - 1]?.count ?? 0 },
        ]
      : []),
  ];

  const viewsByProduct = products
    .map((p) => ({ ...p, views: analytics.productViews[p.id] ?? 0 }))
    .sort((a, b) => b.views - a.views);

  const mostViewed = viewsByProduct.slice(0, 3);
  const leastViewed = [...viewsByProduct].reverse().slice(0, 3);
  const maxDaily = Math.max(1, ...last7.map((d) => d.count));

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>لوحة القيادة</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <div key={c.label} className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {canSeeAnalytics && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>الزيارات آخر 7 أيام</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
              {last7.map((d) => (
                <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(4, (d.count / maxDaily) * 100)}px`,
                      background: "var(--color-accent)",
                      borderRadius: 3,
                    }}
                  />
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{d.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>الأكثر زيارة</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mostViewed.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{p.name}</span>
                  <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>{p.views}</span>
                </div>
              ))}
              {mostViewed.length === 0 && <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>لا توجد بيانات بعد</div>}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>الأقل زيارة</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {leastViewed.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{p.name}</span>
                  <span style={{ color: "var(--color-text-muted)", fontWeight: 700 }}>{p.views}</span>
                </div>
              ))}
              {leastViewed.length === 0 && <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>لا توجد بيانات بعد</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
