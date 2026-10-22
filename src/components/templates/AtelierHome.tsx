import Link from "next/link";
import { Product, formatPrice, discountedPrice } from "@/lib/products-types";
import type { SiteContent } from "@/lib/content-types";
import StoreHeader from "./StoreHeader";
import AtelierHero from "./AtelierHero";
import WatchArt from "./WatchArt";
import TemplateFooter from "./TemplateFooter";
import ImageCarousel from "@/components/ImageCarousel";

export default function AtelierHome({
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
    <main className="tpl tpl-atelier">
      <StoreHeader storeName={storeName} className="sh-atelier" basePath={basePath} />
      <AtelierHero storeName={storeName} />

      <section id="vitrine" className="at-vitrine" aria-labelledby="at-vitrine-title">
        <div className="at-section-head">
          <h2 id="at-vitrine-title">الخزانة</h2>
          <Link href="/store">كل الساعات</Link>
        </div>
        <div className="at-vitrine-row">
          {products.map((p, i) => {
            const offer = p.offerActive && p.discountPercent;
            const img = p.images?.[0];
            return (
              <Link key={p.id} href={`/store/${p.id}`} className="at-piece">
                <div className="at-piece-velvet">
                  {offer ? <span className="at-piece-offer">{p.offerLabel || `خصم ${p.discountPercent}%`}</span> : null}
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.name} />
                  ) : (
                    <WatchArt variant="atelier" seed={i} size={130} />
                  )}
                </div>
                <div className="at-piece-meta">
                  <span className="at-piece-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <span className="at-piece-price">
                    {formatPrice(discountedPrice(p))}
                    {offer ? <s>{formatPrice(p.price)}</s> : null}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="collections" className="at-collections">
        {content.collectionRows.map((row, i) => (
          <article key={row.title} className={`at-chapter ${i % 2 ? "at-chapter-rev" : ""}`}>
            <div className="at-chapter-visual">
              {content.heroImages[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.heroImages[i]} alt={row.title} />
              ) : (
                <WatchArt variant="atelier" seed={i + 1} size={200} />
              )}
            </div>
            <div className="at-chapter-copy">
              <p className="at-chapter-tag">{row.tag}</p>
              <h2>{row.title}</h2>
              <p>{row.description}</p>
              <Link className="at-btn-ghost" href="/store">
                شاهد المجموعة
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="at-ledger" aria-label="أرقام المتجر">
        {content.stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {carouselImages.length > 0 && (
        <section className="at-carousel">
          <h2>{content.homepageCarousel.name}</h2>
          <ImageCarousel
            images={carouselImages}
            speedMs={content.homepageCarousel.speedMs}
            transition={content.homepageCarousel.transition}
            height={380}
            rounded={2}
          />
        </section>
      )}

      <TemplateFooter storeName={storeName} social={content.socialLinks} className="tf-atelier" />
    </main>
  );
}
