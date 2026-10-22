import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./templates.css";
import "./admin.css";
import { getTheme, themeToCssVars } from "@/lib/theme";
import { CartProvider } from "@/components/CartContext";
import ChatWidget from "@/components/ChatWidget";
import { getContent } from "@/lib/content";
import { GOOGLE_FONTS_HREF, getTemplateMeta } from "@/lib/templates";

export const metadata: Metadata = {
  title: "METRIQUE — الوقت، بشكله الأكثر تطورًا",
  description: "متجر ساعات فاخرة",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme();
  const content = getContent();
  const meta = getTemplateMeta(theme.template);
  return (
    <html lang="ar" dir="rtl" data-template={meta.id}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
      </head>
      <body>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{${themeToCssVars(theme)} --font-display:${meta.fontDisplay}; --font-body:${meta.fontBody};}`,
          }}
        />
        <CartProvider>
          {children}
          <ChatWidget storeName={theme.storeName} shippingPolicy={content.shippingPolicy} returnPolicy={content.returnPolicy} />
        </CartProvider>
      </body>
    </html>
  );
}
