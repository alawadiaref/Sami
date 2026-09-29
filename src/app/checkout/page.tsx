import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getContent } from "@/lib/content";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  const theme = getTheme();
  const content = getContent();
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>
      <CheckoutClient />
      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
