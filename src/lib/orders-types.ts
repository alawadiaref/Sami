import { PaymentProvider } from "./payments/types";

export type OrderStatus =
  | "awaiting_payment"
  | "awaiting_bank_transfer"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  total: number;
  paymentProvider: PaymentProvider;
  paymentTransactionId?: string;
  deliveryTrackingId?: string;
  status: OrderStatus;
}
