import fs from "fs";
import path from "path";
import { SiteContent, mergeContent } from "./content-types";

export type { SiteContent } from "./content-types";
export { DEFAULT_SITE_CONTENT, SOCIAL_PLATFORM_LABELS, mergeContent } from "./content-types";

// STUB "DATABASE" for site content — same pattern as lib/theme.ts / lib/products.ts.
// Server-only (uses fs) — client components should import from "./content-types" instead.

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export function getContent(): SiteContent {
  try {
    return mergeContent(JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8")));
  } catch {
    return mergeContent(null);
  }
}

export function saveContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
