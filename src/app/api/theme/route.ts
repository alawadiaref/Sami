import { NextRequest, NextResponse } from "next/server";
import { getTheme, saveTheme, ThemeConfig } from "@/lib/theme";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getTheme());
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "theme");
  if (unauthorized) return unauthorized;

  const body = (await req.json()) as Partial<ThemeConfig>;
  const current = getTheme();
  const next: ThemeConfig = {
    storeName: body.storeName ?? current.storeName,
    colors: { ...current.colors, ...(body.colors ?? {}) },
  };
  saveTheme(next);
  return NextResponse.json(next);
}
