import fs from "fs";
import path from "path";
import { ThemeConfig } from "./theme-types";

export type { ThemeConfig } from "./theme-types";
export { themeToCssVars } from "./theme-types";

// STUB "DATABASE": theme settings are persisted to a JSON file on disk.
// Swap this module for real DB calls (e.g. Prisma) when a database is wired up.
// Server-only (uses fs) — client components should import types from
// "./theme-types" instead.

const THEME_PATH = path.join(process.cwd(), "data", "theme.json");

export function getTheme(): ThemeConfig {
  const raw = fs.readFileSync(THEME_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveTheme(theme: ThemeConfig): void {
  fs.writeFileSync(THEME_PATH, JSON.stringify(theme, null, 2), "utf-8");
}
