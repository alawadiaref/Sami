// The storefront "versions" (قوالب). Every version shares the same data
// (products, orders, content) and the same watch DNA — a ticking movement and
// a watch that comes together as you scroll — but each has its own palette,
// typography and homepage composition. The owner picks one from the admin
// panel ("النسخ والقوالب"); visitors can preview all of them at /versions.
//
// Pure data, safe to import from client components.

import type { ThemeConfig } from "./theme-types";

export type TemplateId = "midnight" | "atelier" | "porcelain";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  mood: string;
  description: string;
  fontDisplay: string;
  fontBody: string;
  colors: ThemeConfig["colors"];
  // swatches shown on the picker cards
  swatches: string[];
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "midnight",
    name: "منتصف الليل",
    mood: "عصرية — كحلي وأزرق",
    description: "الساعة تتفكك ثم تتركّب قطعة قطعة مع النزول، فوق خلفية كحلية وعقرب ثوانٍ يدق.",
    fontDisplay: '"Tajawal", sans-serif',
    fontBody: '"Tajawal", sans-serif',
    colors: {
      bg: "#0d1120",
      panel: "#111731",
      panel2: "#161d3a",
      accent: "#3d5cff",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.6)",
    },
    swatches: ["#0d1120", "#161d3a", "#3d5cff", "#ffffff"],
  },
  {
    id: "atelier",
    name: "الأتيليه",
    mood: "كلاسيكية — إسبريسو وذهب",
    description: "ميناء ذهبي يعرض الوقت الحقيقي الآن، ومع النزول ينفتح الغطاء الخلفي لتظهر التروس وهي تدور.",
    fontDisplay: '"Amiri", serif',
    fontBody: '"IBM Plex Sans Arabic", sans-serif',
    colors: {
      bg: "#17120d",
      panel: "#211a13",
      panel2: "#2b2219",
      accent: "#c9a96a",
      text: "#efe6d6",
      textMuted: "rgba(239,230,214,0.62)",
    },
    swatches: ["#17120d", "#2b2219", "#c9a96a", "#efe6d6"],
  },
  {
    id: "porcelain",
    name: "البورسلان",
    mood: "مينيمال — أبيض وأخضر داكن",
    description: "مساحات بيضاء هادئة، والتمرير نفسه يحرّك عقارب الساعة ومسطرة الدقائق كأنك تدير التاج.",
    fontDisplay: '"Readex Pro", sans-serif',
    fontBody: '"Readex Pro", sans-serif',
    colors: {
      bg: "#f2f3f0",
      panel: "#ffffff",
      panel2: "#e4e7e1",
      accent: "#1f5c45",
      text: "#1b1f1d",
      textMuted: "rgba(27,31,29,0.6)",
    },
    swatches: ["#f2f3f0", "#ffffff", "#1f5c45", "#1b1f1d"],
  },
];

export const DEFAULT_TEMPLATE: TemplateId = "midnight";

export function isTemplateId(v: unknown): v is TemplateId {
  return typeof v === "string" && TEMPLATES.some((t) => t.id === v);
}

export function getTemplateMeta(id: TemplateId | undefined): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Amiri:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Readex+Pro:wght@200;300;400;500;600;700&display=swap";
