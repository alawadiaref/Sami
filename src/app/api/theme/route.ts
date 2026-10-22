import { NextRequest, NextResponse } from "next/server";
import { getTheme, saveTheme, ThemeConfig } from "@/lib/theme";
import { requireAdmin } from "@/lib/auth";
import { getTemplateMeta, isTemplateId } from "@/lib/templates";

export async function GET() {
  return NextResponse.json(getTheme());
}

/**
 * Body: Partial<ThemeConfig> plus optional `applyTemplatePalette: true`,
 * which replaces the colors with the chosen version's own palette (used when
 * switching versions from the admin "النسخ والقوالب" page).
 */
export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin(req, "theme");
  if (unauthorized) return unauthorized;

  const body = (await req.json()) as Partial<ThemeConfig> & { applyTemplatePalette?: boolean };
  const current = getTheme();
  const template = isTemplateId(body.template) ? body.template : current.template;
  const colors = body.applyTemplatePalette
    ? { ...getTemplateMeta(template).colors }
    : { ...current.colors, ...(body.colors ?? {}) };

  const next: ThemeConfig = {
    storeName: body.storeName ?? current.storeName,
    template,
    colors,
  };
  try {
    saveTheme(next);
  } catch {
    return NextResponse.json(
      { error: "تعذّر الحفظ: الاستضافة الحالية للقراءة فقط. يعمل الحفظ عند التشغيل على خادم أو بعد ربط قاعدة بيانات." },
      { status: 500 }
    );
  }
  return NextResponse.json(next);
}
