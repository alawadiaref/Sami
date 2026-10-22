"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES, type TemplateId } from "@/lib/templates";
import VersionThumb from "@/components/templates/VersionThumb";

export default function VersionsClient({ live, highlight }: { live: TemplateId; highlight?: TemplateId }) {
  const router = useRouter();
  const [current, setCurrent] = useState<TemplateId>(live);
  const [usePalette, setUsePalette] = useState(true);
  const [busy, setBusy] = useState<TemplateId | null>(null);
  const [message, setMessage] = useState<{ tone: "good" | "bad"; text: string } | null>(null);

  async function activate(id: TemplateId) {
    setBusy(id);
    setMessage(null);
    const res = await fetch("/api/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: id, applyTemplatePalette: usePalette }),
    });
    setBusy(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage({ tone: "bad", text: err.error ?? "تعذّر اعتماد النسخة. حاول مرة أخرى." });
      return;
    }
    setCurrent(id);
    const name = TEMPLATES.find((t) => t.id === id)?.name;
    setMessage({ tone: "good", text: `تم اعتماد نسخة «${name}». الصفحة الرئيسية تعرضها الآن.` });
    router.refresh();
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>النسخ والقوالب</h1>
          <p>اختر شكل الصفحة الرئيسية لمتجرك. المنتجات والطلبات والمحتوى لا تتغير، فقط طريقة العرض.</p>
        </div>
        <a href="/versions" target="_blank" rel="noopener" className="btn-outline">
          صفحة المقارنة للعملاء
        </a>
      </header>

      <label className="adm-check">
        <input type="checkbox" checked={usePalette} onChange={(e) => setUsePalette(e.target.checked)} />
        <span>
          استخدم ألوان النسخة الأصلية عند الاعتماد
          <small>ألغِ التحديد للإبقاء على ألوانك الحالية من صفحة «الألوان والاسم».</small>
        </span>
      </label>

      {message && (
        <div className={`adm-banner adm-tone-${message.tone}`} role="status">
          {message.text}
        </div>
      )}

      <div className="adm-versions">
        {TEMPLATES.map((t, i) => {
          const isLive = current === t.id;
          return (
            <article
              key={t.id}
              className={`glass-panel adm-version${isLive ? " is-live" : ""}${highlight === t.id && !isLive ? " is-picked" : ""}`}
            >
              <a href={`/preview/${t.id}`} target="_blank" rel="noopener" className="adm-version-frame" aria-label={`معاينة ${t.name}`}>
                <VersionThumb id={t.id} title={t.name} />
              </a>
              <div className="adm-version-body">
                <div className="adm-version-title">
                  <span className="adm-version-num">{i + 1}</span>
                  <h2>{t.name}</h2>
                  {isLive && <span className="adm-pill adm-tone-good">المعتمدة</span>}
                </div>
                <p className="adm-version-mood">{t.mood}</p>
                <p className="adm-version-desc">{t.description}</p>
                <div className="adm-swatches">
                  {t.swatches.map((c) => (
                    <span key={c} style={{ background: c }} title={c} />
                  ))}
                </div>
                <div className="adm-version-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={isLive || busy !== null}
                    onClick={() => activate(t.id)}
                  >
                    {isLive ? "معتمدة حاليًا" : busy === t.id ? "جارٍ الاعتماد…" : "اعتماد هذه النسخة"}
                  </button>
                  <a href={`/preview/${t.id}`} target="_blank" rel="noopener" className="btn-ghost">
                    معاينة كاملة
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
