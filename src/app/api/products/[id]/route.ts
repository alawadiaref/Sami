import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products";
import { requireAdmin, getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { adminHasPermission } from "@/lib/admins";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const admin = await getAdminFromToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  const touchesOfferFields = "discountPercent" in body || "offerLabel" in body || "offerActive" in body;
  const requiredPermission = touchesOfferFields ? "offers" : "products";
  if (!admin || !adminHasPermission(admin, requiredPermission)) {
    return NextResponse.json({ error: "لا تملك صلاحية لهذا الإجراء" }, { status: 403 });
  }

  const { id } = await params;
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  Object.assign(product, body);
  saveProducts(products);
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req, "products");
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return NextResponse.json({ ok: true });
}
