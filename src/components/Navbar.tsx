import CartLink from "./CartLink";

export default function Navbar({ storeName }: { storeName: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "30px 64px",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 1 }}>{storeName}</div>
      <nav style={{ display: "flex", gap: 34, fontSize: 13 }}>
        <a href="#">الرجالي</a>
        <a href="#">النسائي</a>
        <a href="#">الرياضي</a>
        <a href="#">المتجر</a>
      </nav>
      <div style={{ display: "flex", gap: 20, fontSize: 14, alignItems: "center" }}>
        <a href="/account">تسجيل الدخول</a>
        <CartLink />
      </div>
    </div>
  );
}
