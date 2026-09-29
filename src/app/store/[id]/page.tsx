import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import AddToCartButton from "@/components/AddToCartButton";
import { getTheme } from "@/lib/theme";
import { getProduct, getProducts } from "@/lib/products";
import { formatPrice, discountedPrice } from "@/lib/products-types";
import { recordProductView } from "@/lib/analytics";
import { getContent } from "@/lib/content";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  recordProductView(product.id);
  const theme = getTheme();
  const content = getContent();
  const hasOffer = product.offerActive && product.discountPercent;
  const related = getProducts()
    .filter((p) => p.id !== product.id && p.tag === product.tag)
    .slice(0, 4);

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>

      <div style={{ display: "flex", gap: 60, padding: "40px 64px 60px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px" }}>
          <ImageCarousel
            images={product.images ?? []}
            name={product.carouselName}
            speedMs={product.carouselSpeedMs ?? 3500}
            transition={product.carouselTransition ?? "fade"}
            height={460}
            rounded={10}
          />
        </div>

        <div style={{ flex: "1 1 320px" }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--color-accent)", marginBottom: 12 }}>{product.tag}</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>{product.name}</h1>

          {hasOffer ? (
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{formatPrice(discountedPrice(product))}</div>
              <div style={{ fontSize: 16, color: "var(--color-text-muted)", textDecoration: "line-through" }}>{formatPrice(product.price)}</div>
              <div style={{ background: "#ff5470", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 4 }}>
                {product.offerLabel || `خصم ${product.discountPercent}%`}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 24 }}>{formatPrice(product.price)}</div>
          )}

          <div style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 30 }}>
            {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : "غير متوفر حاليًا"}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ padding: "0 64px 80px" }}>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>قد يعجبك أيضًا</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 20 }}>
            {related.map((p) => (
              <a
                key={p.id}
                href={`/store/${p.id}`}
                style={{ background: "var(--color-panel)", borderRadius: 6, overflow: "hidden", display: "block" }}
              >
                <ImageCarousel images={p.images ?? []} height={150} rounded={0} speedMs={0} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 900 }}>{formatPrice(discountedPrice(p))}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
