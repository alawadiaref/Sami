import Navbar from "@/components/Navbar";
import AssemblingWatchHero from "@/components/AssemblingWatchHero";
import StatsStrip from "@/components/StatsStrip";
import CollectionRow from "@/components/CollectionRow";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import TickingBackground from "@/components/TickingBackground";
import ImageCarousel from "@/components/ImageCarousel";
import type { Product } from "@/lib/products-types";
import type { SiteContent } from "@/lib/content-types";

/** The original approved design (نموذج 2 — كحلي وأزرق), now one of the selectable versions. */
export default function MidnightHome({
  storeName,
  products,
  content,
}: {
  storeName: string;
  products: Product[];
  content: SiteContent;
}) {
  const homepageProducts = products.filter((p) => content.homepageCarousel.productIds.includes(p.id));

  return (
    <main className="tpl tpl-midnight" style={{ background: "var(--color-bg)" }}>
      <Navbar storeName={storeName} />
      <AssemblingWatchHero storeName={storeName} bgImage={content.heroImages[0] || undefined} />
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
        <div className="mn-carousel" style={{ padding: "80px 64px 0" }}>
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
      <Footer storeName={storeName} social={content.socialLinks} />
    </main>
  );
}
