"use client";

import { useCart } from "./CartContext";

export default function CartLink() {
  const { count } = useCart();
  return (
    <a
      href="/cart"
      style={{
        position: "relative",
        background: "var(--color-accent)",
        padding: "9px 18px",
        borderRadius: 2,
        color: "var(--color-bg)",
        fontWeight: 700,
      }}
    >
      السلة
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -8,
            insetInlineStart: -8,
            background: "#ff5470",
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {count}
        </span>
      )}
    </a>
  );
}
