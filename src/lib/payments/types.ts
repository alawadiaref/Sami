// Shared contract every payment provider implements. This is the interface
// checkout code depends on — swap a stub for a real integration by editing
// only that provider's file.

export interface PaymentOrder {
  orderId: string;
  amount: number; // in SAR
  currency: "SAR";
  customerName: string;
  customerPhone: string;
  returnUrl: string;
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProvider;
  /** URL to redirect the customer to for hosted checkout / 3DS, if any. */
  redirectUrl?: string;
  /** Provider-side transaction reference, once available. */
  transactionId?: string;
  error?: string;
}

export type PaymentProvider = "tabby" | "tamara" | "card" | "bank_transfer";

export interface PaymentGateway {
  provider: PaymentProvider;
  /** Kick off a payment/checkout session for the given order. */
  createPayment(order: PaymentOrder): Promise<PaymentResult>;
  /** Verify / finalize a payment after the customer returns (webhook or redirect). */
  verifyPayment(transactionId: string): Promise<PaymentResult>;
}
