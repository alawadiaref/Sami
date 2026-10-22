import { SocialLink, SOCIAL_PLATFORM_LABELS } from "@/lib/content-types";

const SOCIAL_ICON: Record<string, string> = {
  whatsapp: "🟢",
  snapchat: "👻",
  instagram: "📷",
  twitter: "𝕏",
};

export default function Footer({ storeName, social = [] }: { storeName: string; social?: SocialLink[] }) {
  return (
    <div
      className="mn-footer"
      style={{
        padding: "50px 64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
        fontSize: 13,
        color: "var(--color-text-muted)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 20, color: "var(--color-text)" }}>{storeName}</div>
      <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>
        <a href="/policies/returns">سياسة الاستبدال</a>
        <a href="/policies/shipping">الشحن</a>
        <a href="/contact">تواصل معنا</a>
      </div>
      {social.length > 0 && (
        <div style={{ display: "flex", gap: 16 }}>
          {social.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={SOCIAL_PLATFORM_LABELS[s.platform]}
              style={{ fontSize: 18 }}
            >
              {SOCIAL_ICON[s.platform] ?? "🔗"}
            </a>
          ))}
        </div>
      )}
      <div>© {new Date().getFullYear()} {storeName}</div>
    </div>
  );
}
