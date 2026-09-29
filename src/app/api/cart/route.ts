import { NextRequest, NextResponse } from "next/server";
import { upsertCart } from "@/lib/carts";
import { getCustomerFromToken, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/customer-auth";

// Called (debounced) from the client cart whenever it changes, so the
// abandoned-cart job (src/app/api/cron/abandoned-carts/route.ts) has
// something to look at. Best-effort — never blocks the shopping experience.
export async function POST(req: NextRequest) {
  const { cartId, items } = await req.json();
  if (!cartId || !Array.isArray(items)) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const customer = await getCustomerFromToken(req.cookies.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);

  upsertCart({
    cartId,
    items,
    customerName: customer?.name,
    customerPhone: customer?.phone,
    customerEmail: customer?.email,
  });

  return NextResponse.json({ ok: true });
}
