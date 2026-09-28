import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { formatPrice, discountedPrice } from "@/lib/products-types";

export default function StorePage() {
  const theme = getTheme();
  const products = getProducts();

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", paddingTop: 110 }}>
        <Navbar storeName={theme.storeName} />
        <div style={{ padding: "0 64px 40px" }}>
          <div style={{ fontSize: 32, fontWeight: 900 }}>كل المنتجات</div>
        </div>
      </div>

      <div style={{ padding: "0 64px 100px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 24 }}>
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
              <div style={{ height: 220, background: "var(--color-panel-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="90" height="90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="28" fill="var(--color-bg)" stroke="rgba(255,255,255,.2)" />
                  <line x1="50" y1="50" x2="50" y2="30" stroke="var(--color-accent)" strokeWidth="2" />
                  <line x1="50" y1="50" x2="64" y2="56" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{p.tag}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                {hasOffer ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <div style={{ fontSize: 15, fontWeight: 900 }}>{formatPrice(discountedPrice(p))}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", textDecoration: "line-through" }}>{formatPrice(p.price)}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 900 }}>{formatPrice(p.price)}</div>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <Footer storeName={theme.storeName} />
    </main>
  );
}
