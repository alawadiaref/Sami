import { CartItem } from "./cart-types";

export interface StoredCart {
  cartId: string;
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  updatedAt: string;
  notifiedAt?: string; // set once an abandoned-cart notification has been sent
  completed?: boolean; // set once the cart turned into a real order
}
