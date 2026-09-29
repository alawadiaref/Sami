"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CartItem, cartCount, cartTotal } from "@/lib/cart-types";
import { Product, discountedPrice } from "@/lib/products-types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "metrique_cart_items";
const CART_ID_KEY = "metrique_cart_id";

function getCartId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupted local storage */
    }
    setLoaded(true);
  }, []);

  const syncToServer = useCallback((nextItems: CartItem[]) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: getCartId(), items: nextItems }),
        });
      } catch {
        /* best-effort — abandoned-cart tracking is not critical-path */
      }
    }, 800);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    syncToServer(items);
  }, [items, loaded, syncToServer]);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          tag: product.tag,
          price: discountedPrice(product),
          image: product.images?.[0],
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{ items, count: cartCount(items), total: cartTotal(items), addItem, removeItem, updateQty, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function getStoredCartId(): string {
  return getCartId();
}
