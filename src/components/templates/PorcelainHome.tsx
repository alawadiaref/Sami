import Link from "next/link";
import { Product, formatPrice, discountedPrice } from "@/lib/products-types";
import type { SiteContent } from "@/lib/content-types";
import StoreHeader from "./StoreHeader";
import PorcelainHero from "./PorcelainHero";
import WatchArt from "./WatchArt";
import TemplateFooter from "./TemplateFooter";
import ImageCarousel from "@/components/ImageCarousel";
import AddToCartButton from "@/components/AddToCartButton";

export default function PorcelainHome({
  storeName,
  products,
  content,
  basePath,
}: {
  storeName: string;
  products: Product[];
  content: SiteContent;
  basePath?: string;
}) {
  const carouselImages = products
    .filter((p) => content.homepageCarousel.productIds.includes(p.id))
    .flatMap((p) => p.images ?? []);

  return (
    <main className="tpl tpl-porcelain">
      <StoreHeader storeName={storeName} className="sh-porcelain" basePath={basePath} />
      <PorcelainHero storeName={storeName} />

      <section id="grid" className="pc-grid-wrap" aria-labelledby="pc-grid-title">
        <div className="pc-section-head">
          <h2 id="pc-grid-title">الساعات</h2>
          <Link href="/store">عرض الكل</Link>
        </div>
        <div className="pc-grid">
          {products.map((p, i) => {
            const offer = p.offerActive && p.discountPercent;
            const img = p.images?.[0];
            return (
              <article key={p.id} className="pc-card">
                <Link href={`/store/${p.id}`} className="pc-card-img">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.name} />
                  ) : (
                    <WatchArt variant="porcelain" seed={i} size={120} />
                  )}
                  {offer ? <span className="pc-badge">{p.offerLabel || `خصم ${p.discountPercent}%`}</span> : null}
                </Link>
                <div className="pc-card-body">
                  <div>
                    <Link href={`/store/${p.id}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <span className="pc-card-tag">{p.tag}</span>
                  </div>
                  <div className="pc-card-price">
                    {formatPrice(discountedPrice(p))}
                    {offer ? <s>{formatPrice(p.price)}</s> : null}
                  </div>
                </div>
                <div className="pc-card-add">
                  <AddToCartButton product={p} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="collections" className="pc-collections">
        {content.collectionRows.map((row, i) => (
          <Link key={row.title} href="/store" className="pc-collection">
            <div className="pc-collection-visual">
              {content.heroImages[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.heroImages[i]} alt="" />
              ) : (
                <WatchArt variant="porcelain" seed={i + 1} size={150} />
              )}
            </div>
            <div className="pc-collection-copy">
              <p>{row.tag}</p>
              <h2>{row.title}</h2>
              <span>{row.description}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="pc-stats" aria-label="أرقام المتجر">
        {content.stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {carouselImages.length > 0 && (
        <section className="pc-carousel">
          <h2>{content.homepageCarousel.name}</h2>
          <ImageCarousel
            images={carouselImages}
            speedMs={content.homepageCarousel.speedMs}
            transition={content.homepageCarousel.transition}
            height={420}
            rounded={24}
          />
        </section>
      )}

      <TemplateFooter storeName={storeName} social={content.socialLinks} className="tf-porcelain" />
    </main>
  );
}
