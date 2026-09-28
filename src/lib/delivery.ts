// Delivery service stub. Swap for a real courier integration (e.g. a local
// KSA courier API, or a custom in-house driver system) — the interface below
// is what order-creation and the admin panel depend on.

export interface DeliveryRequest {
  orderId: string;
  address: {
    city: string;
    district: string;
    street: string;
    notes?: string;
  };
  customerName: string;
  customerPhone: string;
}

export interface DeliveryResult {
  success: boolean;
  trackingId?: string;
  estimatedDays?: number;
  error?: string;
}

export async function requestDelivery(req: DeliveryRequest): Promise<DeliveryResult> {
  if (!process.env.DELIVERY_PROVIDER_API_KEY) {
    // Mocked: order is marked "قيد التجهيز" and a fake tracking id is issued.
    return {
      success: true,
      trackingId: `MOCK-DLV-${req.orderId}`,
      estimatedDays: 2,
    };
  }

  // TODO(real integration): call the chosen courier's API here once picked
  // (e.g. Aramex, SMSA, or a custom delivery-fleet service).
  throw new Error("Delivery: real integration not yet implemented.");
}

export async function trackDelivery(trackingId: string): Promise<{ status: string }> {
  if (trackingId.startsWith("MOCK-")) {
    return { status: "قيد التجهيز" };
  }
  throw new Error("Delivery: trackDelivery not yet implemented.");
}
