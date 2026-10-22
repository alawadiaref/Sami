import TemplateHome from "@/components/templates/TemplateHome";
import { getTheme } from "@/lib/theme";
import { getProducts } from "@/lib/products";
import { recordVisit } from "@/lib/analytics";
import { getContent } from "@/lib/content";
import { DEFAULT_TEMPLATE } from "@/lib/templates";
import { connection } from "next/server";

export default async function Home() {
  await connection(); // always render with the live theme/version
  try {
    recordVisit();
  } catch {
    // read-only hosting (e.g. Vercel preview): skip the visit counter
  }
  const theme = getTheme();

  return (
    <TemplateHome
      template={theme.template ?? DEFAULT_TEMPLATE}
      storeName={theme.storeName}
      products={getProducts()}
      content={getContent()}
    />
  );
}
