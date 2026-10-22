import type { CSSProperties } from "react";
import type { TemplateId } from "./templates";

export interface ThemeConfig {
  storeName: string;
  // Which storefront version (قالب) is live. Missing = "midnight" (the original design).
  template?: TemplateId;
  colors: {
    bg: string;
    panel: string;
    panel2: string;
    accent: string;
    text: string;
    textMuted: string;
  };
}

export function themeToCssVars(theme: Pick<ThemeConfig, "colors">): string {
  return `
    --color-bg: ${theme.colors.bg};
    --color-panel: ${theme.colors.panel};
    --color-panel-2: ${theme.colors.panel2};
    --color-accent: ${theme.colors.accent};
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
  `;
}

/** Same vars as a React style object, for scoping a palette to one subtree (previews). */
export function themeToStyle(colors: ThemeConfig["colors"]): CSSProperties {
  return {
    ["--color-bg" as string]: colors.bg,
    ["--color-panel" as string]: colors.panel,
    ["--color-panel-2" as string]: colors.panel2,
    ["--color-accent" as string]: colors.accent,
    ["--color-text" as string]: colors.text,
    ["--color-text-muted" as string]: colors.textMuted,
  } as CSSProperties;
}
