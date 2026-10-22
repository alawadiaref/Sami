import type { Metadata } from "next";
import { connection } from "next/server";
import { TEMPLATES } from "@/lib/templates";
import { getTheme } from "@/lib/theme";
import VersionThumb from "@/components/templates/VersionThumb";

export const metadata: Metadata = {
  title: "اختر شكل متجرك",
  description: "ثلاث نسخ لواجهة المتجر — قارن بينها واختر ما يناسبك",
};

export default async function VersionsPage() {
  await connection();
  const theme = getTheme();
  const live = theme.template ?? "midnight";

  return (
    <main className="vp">
      <header className="vp-head">
        <p className="vp-store">{theme.storeName}</p>
        <h1>اختر شكل متجرك</h1>
        <p className="vp-lede">
          ثلاث نسخ بنفس المنتجات والمحتوى، تختلف في الألوان والخطوط وطريقة العرض. افتح أي نسخة لتجربها
          كاملة، ثم اعتمد التي تعجبك من لوحة التحكم بضغطة واحدة.
        </p>
      </header>

      <ol className="vp-list">
        {TEMPLATES.map((t, i) => (
          <li key={t.id} className="vp-card">
            <a href={`/preview/${t.id}`} className="vp-card-thumb" aria-label={`افتح معاينة ${t.name}`}>
              <VersionThumb id={t.id} title={t.name} />
            </a>
            <div className="vp-card-body">
              <div className="vp-card-title">
                <span className="vp-num">{i + 1}</span>
                <h2>{t.name}</h2>
                {live === t.id && <span className="vp-live">المعتمدة الآن</span>}
              </div>
              <p className="vp-mood">{t.mood}</p>
              <p className="vp-desc">{t.description}</p>
              <div className="vp-swatches" aria-label="ألوان النسخة">
                {t.swatches.map((c) => (
                  <span key={c} style={{ background: c }} title={c} />
                ))}
              </div>
              <div className="vp-actions">
                <a href={`/preview/${t.id}`} className="vp-btn">
                  جرّب النسخة كاملة
                </a>
                <a href={`/admin/versions?pick=${t.id}`} className="vp-btn-ghost">
                  اعتمادها
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="vp-note">
        اعتماد النسخة يتم من لوحة التحكم، ويغيّر شكل الصفحة الرئيسية فورًا دون أن يمس المنتجات أو الطلبات.
      </p>
    </main>
  );
}
