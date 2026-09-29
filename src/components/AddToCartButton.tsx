"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { Product } from "@/lib/products-types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button className="btn-primary" disabled={product.stock === 0} onClick={handleClick}>
      {added ? "أُضيف إلى السلة ✓" : "إضافة إلى السلة"}
    </button>
  );
}
