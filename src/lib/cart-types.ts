export interface CartItem {
  productId: string;
  name: string;
  tag: string;
  price: number;
  image?: string;
  qty: number;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
