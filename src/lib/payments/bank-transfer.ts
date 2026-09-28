import { PaymentGateway, PaymentOrder, PaymentResult } from "./types";

// Bank transfer has no external API: the customer transfers manually and an
// admin confirms receipt from the admin panel (see /admin/orders), which
// flips the order to "paid". Fill in the real IBAN/account details below.

export const BANK_TRANSFER_DETAILS = {
  bankName: "[اسم البنك]",
  accountName: "[اسم صاحب الحساب / اسم المتجر]",
  iban: "[SA00 0000 0000 0000 0000 0000]",
};

export const bankTransferGateway: PaymentGateway = {
  provider: "bank_transfer",

  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    // No redirect — the order is created as "awaiting bank transfer" and the
    // customer is shown BANK_TRANSFER_DETAILS plus the order reference to use.
    return {
      success: true,
      provider: "bank_transfer",
      transactionId: `BANK-${order.orderId}`,
    };
  },

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    // Verified manually by an admin (order status change), not automatically.
    return { success: true, provider: "bank_transfer", transactionId };
  },
};
