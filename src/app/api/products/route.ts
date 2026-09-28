import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, Product } from "@/lib/products";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "products");
  if (unauthorized) return unauthorized;

  const body = (await req.json()) as Omit<Product, "id">;
  const products = getProducts();
  const product: Product = { ...body, id: `p${Date.now()}` };
  products.push(product);
  saveProducts(products);
  return NextResponse.json(product, { status: 201 });
}
