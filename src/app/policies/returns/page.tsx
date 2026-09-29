import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getContent } from "@/lib/content";

export default function ReturnPolicyPage() {
  const theme = getTheme();
  const content = getContent();
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>
      <div style={{ maxWidth: 720, margin: "40px auto 100px", padding: "0 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24 }}>سياسة الاستبدال والاسترجاع</h1>
        <div style={{ whiteSpace: "pre-line", lineHeight: 2, color: "var(--color-text-muted)", fontSize: 15 }}>
          {content.returnPolicy}
        </div>
      </div>
      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
