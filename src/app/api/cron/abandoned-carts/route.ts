import { NextRequest, NextResponse } from "next/server";
import { findAbandonedCarts, markCartNotified } from "@/lib/carts";
import { emailChannel } from "@/lib/notifications/email";
import { whatsappChannel } from "@/lib/notifications/whatsapp";
import { formatPrice } from "@/lib/products-types";
import { getTheme } from "@/lib/theme";

const ABANDONED_AFTER_MINUTES = 60; // cart untouched for 1 hour = "abandoned"

// Runs on a schedule (see vercel.json's "crons") to notify customers who left
// items in their cart without completing checkout. Protect it in production
// with CRON_SECRET (Vercel Cron sends it as `Authorization: Bearer <secret>`).
export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
  }

  const theme = getTheme();
  const carts = findAbandonedCarts(ABANDONED_AFTER_MINUTES);
  const results: { cartId: string; sent: string[] }[] = [];

  for (const cart of carts) {
    const itemsList = cart.items.map((i) => `${i.name} ×${i.qty}`).join("، ");
    const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
    const body = `مرحبًا${cart.customerName ? " " + cart.customerName : ""}! لاحظنا أنك تركت ${itemsList} في سلتك بقيمة ${formatPrice(
      total
    )} في متجر ${theme.storeName}. أكمل طلبك الآن قبل نفاد الكمية.`;

    const sent: string[] = [];
    if (cart.customerEmail) {
      const res = await emailChannel.send({ to: cart.customerEmail, subject: "أكملت السلة ولم تُتمّ طلبك", body });
      if (res.success) sent.push("email");
    }
    if (cart.customerPhone) {
      const res = await whatsappChannel.send({ to: cart.customerPhone, body });
      if (res.success) sent.push("whatsapp");
    }

    if (sent.length > 0) markCartNotified(cart.cartId);
    results.push({ cartId: cart.cartId, sent });
  }

  return NextResponse.json({ checked: carts.length, results });
}
