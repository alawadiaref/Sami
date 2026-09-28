export default function Footer({ storeName }: { storeName: string }) {
  return (
    <div
      style={{
        padding: "50px 64px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "var(--color-text-muted)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>{storeName}</div>
      <div style={{ display: "flex", gap: 50 }}>
        <a href="/policies/returns">سياسة الاستبدال</a>
        <a href="/policies/shipping">الشحن</a>
        <a href="/contact">تواصل معنا</a>
      </div>
      <div>© {new Date().getFullYear()} {storeName}</div>
    </div>
  );
}
