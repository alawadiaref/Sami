// Pure types + helpers with no server-only dependencies (fs), safe to import
// from client components. Server-side reads/writes live in lib/products.ts.

export interface Product {
  id: string;
  tag: string;
  name: string;
  price: number;
  stock: number;
  discountPercent?: number; // 0-100
  offerLabel?: string;
  offerActive?: boolean;
  // Product image gallery (data URIs or absolute URLs). images[0] is used as
  // the card thumbnail everywhere a single image is needed.
  images?: string[];
  // Per-product gallery carousel settings — the owner can rename it, change
  // how fast it auto-advances, and how it transitions between images.
  carouselName?: string;
  carouselSpeedMs?: number; // auto-advance interval; 0 disables auto-advance
  carouselTransition?: "fade" | "slide";
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-SA")} ر.س`;
}

export function discountedPrice(product: Product): number {
  if (!product.offerActive || !product.discountPercent) return product.price;
  return Math.round(product.price * (1 - product.discountPercent / 100));
}
