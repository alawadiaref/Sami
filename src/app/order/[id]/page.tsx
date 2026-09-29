import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import { getContent } from "@/lib/content";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products-types";
import { BANK_TRANSFER_DETAILS } from "@/lib/payments/bank-transfer";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  const theme = getTheme();
  const content = getContent();
  const isBankTransfer = order.paymentProvider === "bank_transfer";

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: 90 }}>
        <Navbar storeName={theme.storeName} />
      </div>

      <div style={{ maxWidth: 560, margin: "40px auto 100px", padding: "0 24px" }}>
        <div className="glass-panel" style={{ padding: 34, borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>تم استلام طلبك بنجاح</h1>
          <div style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 24 }}>رقم الطلب: {order.id}</div>

          <div style={{ textAlign: "start", background: "rgba(255,255,255,.04)", borderRadius: 10, padding: 18, marginBottom: 20 }}>
            {order.items.map((i) => (
              <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: 900, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 10 }}>
              <span>الإجمالي</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {isBankTransfer && (
            <div style={{ textAlign: "start", background: "rgba(61,92,255,.08)", borderRadius: 10, padding: 18, marginBottom: 20, fontSize: 13 }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>بيانات التحويل البنكي</div>
              <div>البنك: {BANK_TRANSFER_DETAILS.bankName}</div>
              <div>اسم الحساب: {BANK_TRANSFER_DETAILS.accountName}</div>
              <div>الآيبان: {BANK_TRANSFER_DETAILS.iban}</div>
              <div style={{ marginTop: 10, color: "var(--color-text-muted)" }}>يُرجى ذكر رقم الطلب {order.id} في تفاصيل التحويل.</div>
            </div>
          )}

          <a href="/store" className="btn-primary" style={{ justifyContent: "center" }}>
            متابعة التسوق
          </a>
        </div>
      </div>

      <Footer storeName={theme.storeName} social={content.socialLinks} />
    </main>
  );
}
