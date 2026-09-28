import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, OrderStatus } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req, "orders");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { status } = (await req.json()) as { status: OrderStatus };
  const order = updateOrderStatus(id, status);
  if (!order) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(order);
}
