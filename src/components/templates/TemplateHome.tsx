import type { TemplateId } from "@/lib/templates";
import type { Product } from "@/lib/products-types";
import type { SiteContent } from "@/lib/content-types";
import MidnightHome from "./MidnightHome";
import AtelierHome from "./AtelierHome";
import PorcelainHome from "./PorcelainHome";

/** Renders the homepage of whichever version is asked for. */
export default function TemplateHome({
  template,
  storeName,
  products,
  content,
  basePath,
}: {
  template: TemplateId;
  storeName: string;
  products: Product[];
  content: SiteContent;
  basePath?: string;
}) {
  if (template === "atelier") return <AtelierHome storeName={storeName} products={products} content={content} basePath={basePath} />;
  if (template === "porcelain") return <PorcelainHome storeName={storeName} products={products} content={content} basePath={basePath} />;
  return <MidnightHome storeName={storeName} products={products} content={content} />;
}
