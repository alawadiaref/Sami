import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";
import { mergeContent } from "@/lib/content-types";

export async function GET() {
  return NextResponse.json(getContent());
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "content");
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const current = getContent();
  const updated = mergeContent({ ...current, ...body });
  saveContent(updated);
  return NextResponse.json(updated);
}
