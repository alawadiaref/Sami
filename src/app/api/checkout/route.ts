import { NextRequest, NextResponse } from "next/server";
import { getGateway, PaymentProvider } from "@/lib/payments";
import { addOrder, Order } from "@/lib/orders";
import { markCartCompleted } from "@/lib/carts";

interface CheckoutBody {
  customerName: string;
  customerPhone: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  paymentProvider: PaymentProvider;
  returnUrl: string;
  cartId?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutBody;
  const total = body.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const orderId = `ORD-${Date.now()}`;

  const gateway = getGateway(body.paymentProvider);
  const paymentResult = await gateway.createPayment({
    orderId,
    amount: total,
    currency: "SAR",
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    returnUrl: body.returnUrl,
  });

  if (!paymentResult.success) {
    return NextResponse.json({ error: paymentResult.error ?? "فشل بدء عملية الدفع" }, { status: 400 });
  }

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    items: body.items,
    total,
    paymentProvider: body.paymentProvider,
    paymentTransactionId: paymentResult.transactionId,
    status: body.paymentProvider === "bank_transfer" ? "awaiting_bank_transfer" : "awaiting_payment",
  };
  addOrder(order);
  if (body.cartId) markCartCompleted(body.cartId);

  return NextResponse.json({
    orderId,
    redirectUrl: paymentResult.redirectUrl ?? `/order/${orderId}`,
  });
}
