export interface ThemeConfig {
  storeName: string;
  colors: {
    bg: string;
    panel: string;
    panel2: string;
    accent: string;
    text: string;
    textMuted: string;
  };
}

export function themeToCssVars(theme: ThemeConfig): string {
  return `
    --color-bg: ${theme.colors.bg};
    --color-panel: ${theme.colors.panel};
    --color-panel-2: ${theme.colors.panel2};
    --color-accent: ${theme.colors.accent};
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
  `;
}
