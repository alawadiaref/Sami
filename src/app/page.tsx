import Navbar from "@/components/Navbar";
import AssemblingWatchHero from "@/components/AssemblingWatchHero";
import StatsStrip from "@/components/StatsStrip";
import CollectionRow from "@/components/CollectionRow";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import TickingBackground from "@/components/TickingBackground";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { recordVisit } from "@/lib/analytics";

export default function Home() {
  recordVisit();
  const theme = getTheme();
  const products = getProducts();

  return (
    <main style={{ background: "var(--color-bg)" }}>
      <Navbar storeName={theme.storeName} />
      <AssemblingWatchHero storeName={theme.storeName} />
      <StatsStrip />

      <div id="collections" style={{ position: "relative" }}>
        <TickingBackground />
        <div style={{ position: "relative" }}>
          <CollectionRow
            tag="مجموعة السبورت"
            title="مصممة لمن يقود يومه بثقة"
            description="هيكل مقاوم للصدمات مع دقة سويسرية داخلية، لكل تحدٍ يومي."
          />
          <CollectionRow
            tag="مجموعة كلاسيك"
            title="أناقة تناسب كل الأوقات"
            description="خطوط نظيفة وتصميم دائم لا يتأثر بتغير الموضة."
            reverse
          />
        </div>
      </div>

      <ProductGrid products={products} />
      <Footer storeName={theme.storeName} />
    </main>
  );
}
