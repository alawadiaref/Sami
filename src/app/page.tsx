import Navbar from "@/components/Navbar";
import AssemblingWatchHero from "@/components/AssemblingWatchHero";
import StatsStrip from "@/components/StatsStrip";
import CollectionRow from "@/components/CollectionRow";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import TickingBackground from "@/components/TickingBackground";
import ImageCarousel from "@/components/ImageCarousel";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { recordVisit } from "@/lib/analytics";
import { getContent } from "@/lib/content";

export default function Home() {
  recordVisit();
  const theme = getTheme();
  const products = getProducts();
  const content = getContent();
  const homepageProducts = products.filter((p) => content.homepageCarousel.productIds.includes(p.id));

  return (
    <main style={{ background: "var(--color-bg)" }}>
      <Navbar storeName={theme.storeName} />
      <AssemblingWatchHero storeName={theme.storeName} bgImage={content.heroImages[0] || undefined} />
      <StatsStrip stats={content.stats} />

      <div id="collections" style={{ position: "relative" }}>
        <TickingBackground />
        <div style={{ position: "relative" }}>
          <CollectionRow
            tag={content.collectionRows[0].tag}
            title={content.collectionRows[0].title}
            description={content.collectionRows[0].description}
            image={content.heroImages[1] || undefined}
          />
          <CollectionRow
            tag={content.collectionRows[1].tag}
            title={content.collectionRows[1].title}
            description={content.collectionRows[1].description}
            reverse
          />
        </div>
      </div>

      {homepageProducts.length > 0 && (
        <div style={{ padding: "80px 64px 0" }}>
          <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 30 }}>{content.homepageCarousel.name}</div>
          <ImageCarousel
            images={homepageProducts.flatMap((p) => p.images ?? [])}
            speedMs={content.homepageCarousel.speedMs}
            transition={content.homepageCarousel.transition}
            height={360}
            rounded={12}
          />
        </div>
      )}

      <ProductGrid products={products} />
      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
