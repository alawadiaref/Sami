import { requirePagePermission } from "@/lib/require-page-permission";

const integrations = [
  { name: "Tabby (دفع بالتقسيط)", envVar: "TABBY_SECRET_KEY" },
  { name: "Tamara (دفع بالتقسيط)", envVar: "TAMARA_API_TOKEN" },
  { name: "بطاقات (Visa/Mastercard/مدى)", envVar: "CARD_GATEWAY_SECRET_KEY" },
  { name: "خدمة التوصيل", envVar: "DELIVERY_PROVIDER_API_KEY" },
];

export default async function AdminSettingsPage() {
  await requirePagePermission("settings");
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>الإعدادات</h1>

      <div className="glass-panel" style={{ padding: 24, maxWidth: 560 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>حالة الربط مع بوابات الدفع والتوصيل</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {integrations.map((i) => {
            const connected = Boolean(process.env[i.envVar]);
            return (
              <div key={i.envVar} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14 }}>{i.name}</div>
                <div
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: connected ? "rgba(61,220,151,.15)" : "rgba(255,255,255,.08)",
                    color: connected ? "#3ddc97" : "var(--color-text-muted)",
                  }}
                >
                  {connected ? "مفعّل" : "بحاجة لمفاتيح API — قيد التجربة (وهمي)"}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 18, lineHeight: 1.8 }}>
          كل بوابة تعمل الآن بوضع تجريبي (Mock) بحيث تكتمل رحلة الشراء بالكامل بدون مفاتيح حقيقية. عند توفر
          حسابات تابي/تمارا/بوابة البطاقات وشركة التوصيل، تُضاف مفاتيحها كمتغيرات بيئة بنفس الأسماء أعلاه
          ويتحول العمل تلقائيًا للوضع الحقيقي.
        </p>
      </div>
    </div>
  );
}
