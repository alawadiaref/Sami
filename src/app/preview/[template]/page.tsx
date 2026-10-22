import { notFound } from "next/navigation";
import { connection } from "next/server";
import TemplateHome from "@/components/templates/TemplateHome";
import VersionBar from "@/components/templates/VersionBar";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { getContent } from "@/lib/content";
import { getTemplateMeta, isTemplateId } from "@/lib/templates";
import { themeToStyle } from "@/lib/theme-types";

/**
 * Full preview of one version with its own palette and fonts, using the
 * store's real products and content. `?embed=1` hides the floating bar
 * (used for the small live thumbnails on /versions and in the admin).
 */
export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  await connection();
  const { template } = await params;
  const { embed } = await searchParams;
  if (!isTemplateId(template)) notFound();

  const meta = getTemplateMeta(template);
  const theme = getTheme();
  const style = {
    ...themeToStyle(meta.colors),
    ["--font-display" as string]: meta.fontDisplay,
    ["--font-body" as string]: meta.fontBody,
    background: meta.colors.bg,
    color: meta.colors.text,
    fontFamily: meta.fontBody,
    minHeight: "100vh",
  } as React.CSSProperties;

  return (
    <div style={style}>
      <TemplateHome
        template={template}
        storeName={theme.storeName}
        products={getProducts()}
        content={getContent()}
        basePath={`/preview/${template}`}
      />
      {embed === "1" && <style>{".chat-widget{display:none}"}</style>}
      {embed !== "1" && <VersionBar current={template} live={(theme.template ?? "midnight") === template} />}
    </div>
  );
}
