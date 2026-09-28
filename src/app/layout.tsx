import type { Metadata } from "next";
import "./globals.css";
import { getTheme, themeToCssVars } from "@/lib/theme";

export const metadata: Metadata = {
  title: "METRIQUE — الوقت، بشكله الأكثر تطورًا",
  description: "متجر ساعات فاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme();
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap"
        />
      </head>
      <body style={{ ["--theme-vars" as string]: "" }}>
        <style dangerouslySetInnerHTML={{ __html: `:root{${themeToCssVars(theme)}}` }} />
        {children}
      </body>
    </html>
  );
}
