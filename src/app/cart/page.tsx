import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { getContent } from "@/lib/content";
import CartClient from "./CartClient";

export default function CartPage() {
  const theme = getTheme();
  const content = getContent();
  const products = getProducts();

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>
      <CartClient allProducts={products} />
      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
