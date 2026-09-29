import { Product, formatPrice, discountedPrice } from "@/lib/products-types";
import ImageCarousel from "./ImageCarousel";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div id="products" style={{ padding: "100px 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 50 }}>
        <div style={{ fontSize: 32, fontWeight: 900 }}>الأكثر مبيعًا</div>
        <a href="/store" style={{ fontSize: 14, color: "var(--color-accent)", fontWeight: 500 }}>
          عرض الكل ←
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 24 }}>
        {products.map((p) => {
          const hasOffer = p.offerActive && p.discountPercent;
          return (
            <a
              key={p.id}
              href={`/store/${p.id}`}
              style={{ background: "var(--color-panel)", borderRadius: 6, overflow: "hidden", display: "block", position: "relative" }}
            >
              {hasOffer && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    insetInlineStart: 12,
                    background: "#ff5470",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 4,
                    zIndex: 1,
                  }}
                >
                  {p.offerLabel || `خصم ${p.discountPercent}%`}
                </div>
              )}
              <ImageCarousel
                images={p.images ?? []}
                speedMs={p.carouselSpeedMs ?? 3500}
                transition={p.carouselTransition ?? "fade"}
                height={220}
                rounded={0}
              />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                  {p.tag}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                {hasOffer ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <div style={{ fontSize: 15, fontWeight: 900 }}>{formatPrice(discountedPrice(p))}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", textDecoration: "line-through" }}>
                      {formatPrice(p.price)}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 900 }}>{formatPrice(p.price)}</div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
