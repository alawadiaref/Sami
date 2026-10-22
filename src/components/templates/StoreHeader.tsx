"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

/** Header shared by the Atelier and Porcelain versions. Collapses to a menu sheet on phones. */
export default function StoreHeader({
  storeName,
  className = "",
  basePath = "",
}: {
  storeName: string;
  className?: string;
  basePath?: string; // "/preview/atelier" when rendered as a preview, so in-page anchors still work
}) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const links = [
    { href: "/store", label: "المتجر" },
    { href: `${basePath || "/"}#collections`, label: "المجموعات" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className={`sh ${className}`}>
      <a href={basePath || "/"} className="sh-brand">
        {storeName}
      </a>
      <nav className="sh-links" aria-label="القائمة الرئيسية">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="sh-actions">
        <a href="/account" className="sh-account">
          حسابي
        </a>
        <a href="/cart" className="sh-cart">
          السلة{count > 0 ? ` (${count})` : ""}
        </a>
        <button
          type="button"
          className="sh-burger"
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className="sh-sheet" onClick={() => setOpen(false)}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="/account">حسابي</a>
        </div>
      )}
    </header>
  );
}
