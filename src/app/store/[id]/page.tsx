import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getProduct } from "@/lib/products";
import { formatPrice, discountedPrice } from "@/lib/products-types";
import { recordProductView } from "@/lib/analytics";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  recordProductView(product.id);
  const theme = getTheme();
  const hasOffer = product.offerActive && product.discountPercent;

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>

      <div style={{ display: "flex", gap: 60, padding: "40px 64px 100px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 400px",
            height: 460,
            background: "linear-gradient(150deg, var(--color-panel-2), #0b0f1e)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="260" height="260" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="28" fill="#141b30" stroke="rgba(255,255,255,.25)" />
            <line x1="50" y1="50" x2="50" y2="30" stroke="var(--color-accent)" strokeWidth="2" />
            <line x1="50" y1="50" x2="64" y2="56" stroke="#fff" strokeWidth="2" />
          </svg>
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

          <button className="btn-primary" disabled={product.stock === 0}>
            إضافة إلى السلة
          </button>
        </div>
      </div>

      <Footer storeName={theme.storeName} />
    </main>
  );
}
