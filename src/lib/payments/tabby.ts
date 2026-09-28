import { PaymentGateway, PaymentOrder, PaymentResult } from "./types";

// TODO(real integration): Tabby Checkout API.
// Docs: https://docs.tabby.ai/
// Needs: TABBY_PUBLIC_KEY, TABBY_SECRET_KEY in env.
// Real flow: POST /api/v2/checkout with { payment: { amount, currency, buyer,
// order }, merchant_code, lang } -> returns configuration.available_products
// and a checkout `web_url` to redirect the customer to.

export const tabbyGateway: PaymentGateway = {
  provider: "tabby",

  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    if (!process.env.TABBY_SECRET_KEY) {
      // Mocked response so checkout flow works end-to-end before real keys exist.
      return {
        success: true,
        provider: "tabby",
        redirectUrl: `${order.returnUrl}?mock_provider=tabby&order=${order.orderId}`,
        transactionId: `MOCK-TABBY-${order.orderId}`,
      };
    }

    // Real call would go here, e.g.:
    // const res = await fetch("https://api.tabby.ai/api/v2/checkout", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ... }),
    // });
    throw new Error("Tabby: real integration not yet implemented — TABBY_SECRET_KEY is set but the call is a TODO.");
  },

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    if (transactionId.startsWith("MOCK-")) {
      return { success: true, provider: "tabby", transactionId };
    }
    throw new Error("Tabby: verifyPayment not yet implemented.");
  },
};
