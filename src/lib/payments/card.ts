import { PaymentGateway, PaymentOrder, PaymentResult } from "./types";

// TODO(real integration): card payments (Visa/Mastercard/mada).
// For Saudi merchants the common choices are Moyasar, HyperPay, or PayTabs —
// all support mada + Apple Pay. Moyasar has the simplest API if unsure:
// https://docs.moyasar.com/
// Needs: MOYASAR_SECRET_KEY (or equivalent) in env.

export const cardGateway: PaymentGateway = {
  provider: "card",

  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    if (!process.env.CARD_GATEWAY_SECRET_KEY) {
      return {
        success: true,
        provider: "card",
        redirectUrl: `${order.returnUrl}?mock_provider=card&order=${order.orderId}`,
        transactionId: `MOCK-CARD-${order.orderId}`,
      };
    }

    throw new Error("Card gateway: real integration not yet implemented — pick a provider (Moyasar/HyperPay/PayTabs) and wire it here.");
  },

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    if (transactionId.startsWith("MOCK-")) {
      return { success: true, provider: "card", transactionId };
    }
    throw new Error("Card gateway: verifyPayment not yet implemented.");
  },
};
