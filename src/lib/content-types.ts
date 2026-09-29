// Pure types for the site's admin-editable content (copy, hero images,
// homepage carousel, social links, shipping/return policy). Safe to import
// from client components. Server-side reads/writes live in lib/content.ts.

export type SocialPlatform = "whatsapp" | "snapchat" | "instagram" | "twitter";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface CollectionRowContent {
  tag: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SiteContent {
  // The first two large images shown on the homepage (hero background +
  // secondary hero visual).
  heroImages: [string, string];
  // Copy for the two "collection" sections on the homepage.
  collectionRows: [CollectionRowContent, CollectionRowContent];
  // The 4 numbers in the stats strip.
  stats: [StatItem, StatItem, StatItem, StatItem];
  // Product ids chosen by the owner to appear in the homepage carousel, plus
  // that carousel's own display settings.
  homepageCarousel: {
    name: string;
    productIds: string[];
    speedMs: number;
    transition: "fade" | "slide";
  };
  socialLinks: SocialLink[];
  shippingPolicy: string;
  returnPolicy: string;
}

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  whatsapp: "واتساب",
  snapchat: "سناب شات",
  instagram: "إنستقرام",
  twitter: "إكس (تويتر)",
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroImages: ["", ""],
  collectionRows: [
    { tag: "الفئة الأولى", title: "مجموعة الرجالي", description: "تصاميم كلاسيكية بلمسة عصرية، مصنوعة لتدوم." },
    { tag: "الفئة الثانية", title: "مجموعة النسائي", description: "أناقة راقية تناسب كل المناسبات." },
  ],
  stats: [
    { value: "+10K", label: "عميل راضٍ" },
    { value: "+500", label: "منتج" },
    { value: "5", label: "سنوات خبرة" },
    { value: "24/7", label: "دعم فني" },
  ],
  homepageCarousel: { name: "منتجات مختارة", productIds: [], speedMs: 4000, transition: "fade" },
  socialLinks: [],
  shippingPolicy: `سياسة الشحن\n\n- يتم شحن الطلبات خلال 1-3 أيام عمل من تاريخ تأكيد الدفع.\n- مدة التوصيل المتوقعة داخل المملكة: 2-5 أيام عمل حسب المدينة.\n- سيصلك رقم تتبع الشحنة عبر رسالة نصية/واتساب فور تجهيز الطلب.\n- رسوم الشحن تُحتسب تلقائيًا عند إتمام الطلب وتظهر قبل الدفع.`,
  returnPolicy: `سياسة الاستبدال والاسترجاع\n\n- يمكنك طلب الاستبدال أو الاسترجاع خلال 7 أيام من تاريخ استلام الطلب.\n- يجب أن يكون المنتج بحالته الأصلية دون استخدام، وبكامل ملحقاته وعلبته الأصلية.\n- لطلب الاسترجاع أو الاستبدال، تواصل معنا عبر إحدى وسائل التواصل الموضحة في أسفل الموقع.\n- في حال وجود عيب مصنعي، يتحمل المتجر تكلفة الشحن؛ وفي غير ذلك يتحمل العميل تكلفة إعادة الشحن.\n- استرجاع المبلغ يتم خلال 3-7 أيام عمل من استلام المنتج المرتجع والتأكد من حالته.`,
};

export function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  return { ...DEFAULT_SITE_CONTENT, ...(partial ?? {}) };
}
