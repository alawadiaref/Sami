import { requirePagePermission } from "@/lib/require-page-permission";
import { getTheme } from "@/lib/theme";
import { isTemplateId } from "@/lib/templates";
import VersionsClient from "./VersionsClient";

export default async function Page({ searchParams }: { searchParams: Promise<{ pick?: string }> }) {
  await requirePagePermission("theme");
  const { pick } = await searchParams;
  const theme = getTheme();
  return (
    <VersionsClient
      live={theme.template ?? "midnight"}
      highlight={isTemplateId(pick) ? pick : undefined}
    />
  );
}
