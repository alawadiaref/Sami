import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getContent } from "@/lib/content";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/content-types";

export default function ContactPage() {
  const theme = getTheme();
  const content = getContent();
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>
      <div style={{ maxWidth: 560, margin: "40px auto 100px", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 16 }}>تواصل معنا</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 30 }}>
          نسعد بتواصلك معنا عبر أي من الوسائل التالية، أو عبر مساعد الدردشة الآلي أسفل الصفحة.
        </p>
        {content.socialLinks.length === 0 ? (
          <div style={{ color: "var(--color-text-muted)" }}>لم يتم إضافة حسابات تواصل بعد.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {content.socialLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: 260, justifyContent: "center" }}>
                {SOCIAL_PLATFORM_LABELS[s.platform]}
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
