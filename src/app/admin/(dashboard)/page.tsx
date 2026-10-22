import { cookies } from "next/headers";
import { connection } from "next/server";
import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { getCarts } from "@/lib/carts";
import { getAnalytics, getVisitsLast7Days } from "@/lib/analytics";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { adminHasPermission } from "@/lib/admins";
import { getTheme } from "@/lib/theme";
import { getTemplateMeta } from "@/lib/templates";
import { formatPrice } from "@/lib/products-types";
import type { OrderStatus } from "@/lib/orders-types";
import RevenueChart from "@/components/admin/RevenueChart";
import VersionThumb from "@/components/templates/VersionThumb";

const STATUS: { key: OrderStatus; label: string; tone: "warn" | "info" | "good" | "bad" }[] = [
  { key: "awaiting_payment", label: "بانتظار الدفع", tone: "warn" },
  { key: "awaiting_bank_transfer", label: "بانتظار التحويل", tone: "warn" },
  { key: "paid", label: "مدفوع", tone: "info" },
  { key: "preparing", label: "قيد التجهيز", tone: "info" },
  { key: "shipped", label: "تم الشحن", tone: "info" },
  { key: "delivered", label: "تم التسليم", tone: "good" },
  { key: "cancelled", label: "ملغي", tone: "bad" },
];

const PAY_LABEL: Record<string, string> = {
  tabby: "تابي",
  tamara: "تمارا",
  card: "بطاقة",
  bank_transfer: "تحويل بنكي",
};

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboard() {
  await connection();
  const cookieStore = await cookies();
  const admin = await getAdminFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const canAnalytics = admin ? adminHasPermission(admin, "analytics") : false;
  const canOrders = admin ? adminHasPermission(admin, "orders") : false;
  const canProducts = admin ? adminHasPermission(admin, "products") : false;
  const canTheme = admin ? adminHasPermission(admin, "theme") : false;

  const orders = getOrders();
  const products = getProducts();
  const analytics = getAnalytics();
  const visits7 = getVisitsLast7Days();
  let carts: ReturnType<typeof getCarts> = [];
  try {
    carts = getCarts();
  } catch {
    carts = [];
  }
  const theme = getTheme();
  const version = getTemplateMeta(theme.template);

  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const aov = valid.length ? Math.round(revenue / valid.length) : 0;
  const visitsToday = visits7[visits7.length - 1]?.count ?? 0;
  const visitsYesterday = visits7[visits7.length - 2]?.count ?? 0;
  const pending = orders.filter((o) => ["awaiting_payment", "awaiting_bank_transfer", "paid", "preparing"].includes(o.status));
  const abandoned = carts.filter((c) => !c.completed && c.items.length > 0).length;

  // revenue per day, last 14 days
  const days: { date: string; value: number; orders: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: dayKey(d), value: 0, orders: 0 });
  }
  for (const o of valid) {
    const day = days.find((d) => d.date === o.createdAt.slice(0, 10));
    if (day) {
      day.value += o.total;
      day.orders += 1;
    }
  }
  const rev14 = days.reduce((s, d) => s + d.value, 0);

  const statusCounts = STATUS.map((s) => ({ ...s, count: orders.filter((o) => o.status === s.key).length }));
  const maxStatus = Math.max(1, ...statusCounts.map((s) => s.count));

  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const views = products
    .map((p) => ({ id: p.id, name: p.name, views: analytics.productViews[p.id] ?? 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const maxViews = Math.max(1, ...views.map((v) => v.views));

  const greeting = (() => {
    const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", hour: "numeric", hour12: false }).format(new Date()));
    return h < 12 ? "صباح الخير" : "مساء الخير";
  })();
  const today = new Intl.DateTimeFormat("ar-SA", { timeZone: "Asia/Riyadh", weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const kpis = [
    ...(canAnalytics
      ? [
          { label: "الإيرادات", value: formatPrice(revenue), note: `${formatPrice(rev14)} في آخر 14 يومًا` },
          { label: "متوسط قيمة الطلب", value: formatPrice(aov), note: `من ${valid.length.toLocaleString("ar-SA")} طلب مكتمل أو جارٍ` },
        ]
      : []),
    ...(canOrders
      ? [{ label: "طلبات تحتاج إجراء", value: pending.length.toLocaleString("ar-SA"), note: `من أصل ${orders.length.toLocaleString("ar-SA")} طلب`, href: "/admin/orders" }]
      : []),
    ...(canAnalytics
      ? [
          {
            label: "زيارات اليوم",
            value: visitsToday.toLocaleString("ar-SA"),
            note: visitsYesterday ? `أمس: ${visitsYesterday.toLocaleString("ar-SA")}` : `الإجمالي: ${analytics.totalVisits.toLocaleString("ar-SA")}`,
            spark: visits7.map((d) => d.count),
          },
        ]
      : []),
  ];

  return (
    <div className="adm-page">
      <header className="adm-hello">
        <div>
          <p>{today}</p>
          <h1>
            {greeting}، {admin?.name ?? ""}
          </h1>
        </div>
        <div className="adm-quick">
          {canProducts && (
            <a href="/admin/products" className="btn-primary">
              إضافة منتج
            </a>
          )}
          {canOrders && (
            <a href="/admin/orders" className="btn-outline">
              الطلبات
            </a>
          )}
          <a href="/" target="_blank" rel="noopener" className="btn-ghost">
            عرض المتجر
          </a>
        </div>
      </header>

      {kpis.length > 0 && (
        <section className="adm-kpis" aria-label="المؤشرات الرئيسية">
          {kpis.map((k) => {
            const body = (
              <>
                <span className="adm-kpi-label">{k.label}</span>
                <strong className="adm-kpi-value">{k.value}</strong>
                <span className="adm-kpi-note">{k.note}</span>
                {"spark" in k && k.spark && <Spark values={k.spark} />}
              </>
            );
            return "href" in k && k.href ? (
              <a key={k.label} href={k.href} className="glass-panel adm-kpi adm-kpi-link">
                {body}
              </a>
            ) : (
              <div key={k.label} className="glass-panel adm-kpi">
                {body}
              </div>
            );
          })}
        </section>
      )}

      <section className="adm-grid">
        {canAnalytics && (
          <div className="glass-panel adm-card adm-span-2">
            <div className="adm-card-head">
              <h2>الإيرادات اليومية</h2>
              <span>آخر 14 يومًا</span>
            </div>
            <RevenueChart data={days} />
          </div>
        )}

        {canOrders && (
          <div className="glass-panel adm-card">
            <div className="adm-card-head">
              <h2>حالة الطلبات</h2>
              <a href="/admin/orders">إدارة</a>
            </div>
            {orders.length === 0 ? (
              <p className="adm-empty">لا توجد طلبات بعد. عند أول طلب ستظهر هنا مراحل التجهيز والشحن.</p>
            ) : (
              <ul className="adm-status">
                {statusCounts
                  .filter((s) => s.count > 0)
                  .map((s) => (
                    <li key={s.key}>
                      <span className={`adm-dot adm-tone-${s.tone}`} aria-hidden />
                      <span className="adm-status-label">{s.label}</span>
                      <span className="adm-status-bar">
                        <span style={{ width: `${(s.count / maxStatus) * 100}%` }} />
                      </span>
                      <strong>{s.count.toLocaleString("ar-SA")}</strong>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {canOrders && (
          <div className="glass-panel adm-card adm-span-2">
            <div className="adm-card-head">
              <h2>أحدث الطلبات</h2>
              <a href="/admin/orders">كل الطلبات</a>
            </div>
            {orders.length === 0 ? (
              <p className="adm-empty">لم يصل أي طلب حتى الآن. شارك رابط متجرك لتبدأ المبيعات.</p>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>الطلب</th>
                      <th>العميل</th>
                      <th>الدفع</th>
                      <th>الحالة</th>
                      <th>المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map((o) => {
                      const st = STATUS.find((s) => s.key === o.status);
                      return (
                        <tr key={o.id}>
                          <td dir="ltr" className="adm-mono">#{o.id.slice(-6)}</td>
                          <td>{o.customerName}</td>
                          <td>{PAY_LABEL[o.paymentProvider] ?? o.paymentProvider}</td>
                          <td>
                            <span className={`adm-pill adm-tone-${st?.tone ?? "info"}`}>{st?.label ?? o.status}</span>
                          </td>
                          <td>{formatPrice(o.total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {canProducts && (
          <div className="glass-panel adm-card">
            <div className="adm-card-head">
              <h2>تنبيهات المخزون</h2>
              <a href="/admin/products">المنتجات</a>
            </div>
            {lowStock.length === 0 ? (
              <p className="adm-empty">كل المنتجات متوفرة بكميات كافية.</p>
            ) : (
              <ul className="adm-list">
                {lowStock.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span className={`adm-pill ${p.stock === 0 ? "adm-tone-bad" : "adm-tone-warn"}`}>
                      {p.stock === 0 ? "نفد" : `متبقٍ ${p.stock}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {abandoned > 0 && (
              <p className="adm-foot-note">
                {abandoned.toLocaleString("ar-SA")} سلة متروكة — يُرسل لأصحابها تذكير تلقائي.
              </p>
            )}
          </div>
        )}

        {canAnalytics && (
          <div className="glass-panel adm-card">
            <div className="adm-card-head">
              <h2>الأكثر مشاهدة</h2>
              <span>صفحات المنتجات</span>
            </div>
            {views.every((v) => v.views === 0) ? (
              <p className="adm-empty">لم تُسجَّل مشاهدات للمنتجات بعد.</p>
            ) : (
              <ul className="adm-bars">
                {views.map((v) => (
                  <li key={v.id}>
                    <div>
                      <span>{v.name}</span>
                      <strong>{v.views.toLocaleString("ar-SA")}</strong>
                    </div>
                    <span className="adm-status-bar">
                      <span style={{ width: `${(v.views / maxViews) * 100}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {canTheme && (
          <div className="glass-panel adm-card adm-version-card">
            <div className="adm-card-head">
              <h2>شكل المتجر</h2>
              <a href="/admin/versions">تغيير النسخة</a>
            </div>
            <a href="/admin/versions" className="adm-version-thumb" aria-label="النسخ والقوالب">
              <VersionThumb id={version.id} title={version.name} />
            </a>
            <p className="adm-version-name">
              <strong>{version.name}</strong>
              <span>{version.mood}</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Spark({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - (v / max) * 24}`).join(" ");
  return (
    <svg className="adm-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--adm-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
