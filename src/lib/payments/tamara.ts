import { PaymentGateway, PaymentOrder, PaymentResult } from "./types";

// TODO(real integration): Tamara Checkout API.
// Docs: https://docs.tamara.co/
// Needs: TAMARA_API_TOKEN, TAMARA_NOTIFICATION_TOKEN in env.
// Real flow: POST /checkout with order + consumer + items -> returns
// checkout_url to redirect the customer to, then handle the webhook/redirect
// to capture the order.

export const tamaraGateway: PaymentGateway = {
  provider: "tamara",

  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    if (!process.env.TAMARA_API_TOKEN) {
      return {
        success: true,
        provider: "tamara",
        redirectUrl: `${order.returnUrl}?mock_provider=tamara&order=${order.orderId}`,
        transactionId: `MOCK-TAMARA-${order.orderId}`,
      };
    }

    throw new Error("Tamara: real integration not yet implemented — TAMARA_API_TOKEN is set but the call is a TODO.");
  },

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    if (transactionId.startsWith("MOCK-")) {
      return { success: true, provider: "tamara", transactionId };
    }
    throw new Error("Tamara: verifyPayment not yet implemented.");
  },
};
