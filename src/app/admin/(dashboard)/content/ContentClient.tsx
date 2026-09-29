"use client";

import { useEffect, useState } from "react";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/content-types";
import { SocialPlatform, SOCIAL_PLATFORM_LABELS } from "@/lib/content-types";
import { Product } from "@/lib/products-types";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ContentClient() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setContent);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleHeroImage(index: 0 | 1, file: File) {
    const url = await fileToDataUrl(file);
    const heroImages: [string, string] = [...content.heroImages] as [string, string];
    heroImages[index] = url;
    setContent({ ...content, heroImages });
  }

  function updateRow(index: 0 | 1, field: "tag" | "title" | "description", value: string) {
    const rows = [...content.collectionRows] as [typeof content.collectionRows[0], typeof content.collectionRows[0]];
    rows[index] = { ...rows[index], [field]: value };
    setContent({ ...content, collectionRows: rows });
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    const stats = [...content.stats] as typeof content.stats;
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, stats });
  }

  function toggleHomepageProduct(id: string) {
    const ids = content.homepageCarousel.productIds.includes(id)
      ? content.homepageCarousel.productIds.filter((x) => x !== id)
      : [...content.homepageCarousel.productIds, id];
    setContent({ ...content, homepageCarousel: { ...content.homepageCarousel, productIds: ids } });
  }

  function addSocialLink() {
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { id: `soc-${Date.now()}`, platform: "whatsapp", url: "" }],
    });
  }

  function updateSocialLink(id: string, field: "platform" | "url", value: string) {
    setContent({
      ...content,
      socialLinks: content.socialLinks.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  }

  function removeSocialLink(id: string) {
    setContent({ ...content, socialLinks: content.socialLinks.filter((s) => s.id !== id) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>محتوى الموقع</h1>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "جارٍ الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ كل التغييرات"}
        </button>
      </div>

      {/* Hero images */}
      <Section title="أول صورتين في الموقع">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: 220 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8 }}>
                {i === 0 ? "الصورة الأولى (خلفية الواجهة الرئيسية)" : "الصورة الثانية (قسم المجموعة الأولى)"}
              </div>
              {content.heroImages[i] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.heroImages[i]} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleHeroImage(i as 0 | 1, e.target.files[0])} />
            </div>
          ))}
        </div>
      </Section>

      {/* Collection rows copy */}
      <Section title="نصوص أقسام المجموعات">
        {[0, 1].map((i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <input style={inputStyle} placeholder="الوسم" value={content.collectionRows[i].tag} onChange={(e) => updateRow(i as 0 | 1, "tag", e.target.value)} />
            <input style={{ ...inputStyle, flex: 2 }} placeholder="العنوان" value={content.collectionRows[i].title} onChange={(e) => updateRow(i as 0 | 1, "title", e.target.value)} />
            <input style={{ ...inputStyle, flex: 3 }} placeholder="الوصف" value={content.collectionRows[i].description} onChange={(e) => updateRow(i as 0 | 1, "description", e.target.value)} />
          </div>
        ))}
      </Section>

      {/* Stats strip */}
      <Section title="شريط الإحصائيات">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {content.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6 }}>
              <input style={{ ...inputStyle, width: 90 }} placeholder="القيمة" value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
              <input style={{ ...inputStyle, width: 110 }} placeholder="الوصف" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Homepage carousel */}
      <Section title="شريط الصور بالصفحة الرئيسية">
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <input
            style={inputStyle}
            placeholder="اسم الشريط"
            value={content.homepageCarousel.name}
            onChange={(e) => setContent({ ...content, homepageCarousel: { ...content.homepageCarousel, name: e.target.value } })}
          />
          <input
            type="number"
            style={{ ...inputStyle, width: 140 }}
            placeholder="سرعة التبديل (ms)"
            value={content.homepageCarousel.speedMs}
            onChange={(e) => setContent({ ...content, homepageCarousel: { ...content.homepageCarousel, speedMs: Number(e.target.value) } })}
          />
          <select
            style={{ ...inputStyle, width: 140 }}
            value={content.homepageCarousel.transition}
            onChange={(e) => setContent({ ...content, homepageCarousel: { ...content.homepageCarousel, transition: e.target.value as "fade" | "slide" } })}
          >
            <option value="fade">تلاشي</option>
            <option value="slide">انزلاق</option>
          </select>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8 }}>اختر المنتجات التي تظهر في هذا الشريط:</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {products.map((p) => (
            <label key={p.id} className="glass-panel" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, fontSize: 12 }}>
              <input type="checkbox" checked={content.homepageCarousel.productIds.includes(p.id)} onChange={() => toggleHomepageProduct(p.id)} />
              {p.name}
            </label>
          ))}
        </div>
      </Section>

      {/* Social links */}
      <Section title="حسابات التواصل الاجتماعي">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {content.socialLinks.map((s) => (
            <div key={s.id} style={{ display: "flex", gap: 10 }}>
              <select style={{ ...inputStyle, width: 140 }} value={s.platform} onChange={(e) => updateSocialLink(s.id, "platform", e.target.value as SocialPlatform)}>
                {Object.entries(SOCIAL_PLATFORM_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="الرابط" dir="ltr" value={s.url} onChange={(e) => updateSocialLink(s.id, "url", e.target.value)} />
              <button onClick={() => removeSocialLink(s.id)} className="btn-danger">
                حذف
              </button>
            </div>
          ))}
          <button onClick={addSocialLink} className="btn-ghost" style={{ alignSelf: "flex-start" }}>
            + إضافة حساب تواصل
          </button>
        </div>
      </Section>

      {/* Policies */}
      <Section title="سياسة الشحن">
        <textarea style={textAreaStyle} rows={6} value={content.shippingPolicy} onChange={(e) => setContent({ ...content, shippingPolicy: e.target.value })} />
      </Section>
      <Section title="سياسة الاستبدال والاسترجاع">
        <textarea style={textAreaStyle} rows={6} value={content.returnPolicy} onChange={(e) => setContent({ ...content, returnPolicy: e.target.value })} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel" style={{ padding: 20, borderRadius: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>{title}</div>
      {children}
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

const textAreaStyle: React.CSSProperties = {
  ...inputStyle,
  width: "100%",
  fontFamily: "inherit",
  lineHeight: 1.8,
  resize: "vertical",
};
