import Link from "next/link";
import { SocialLink, SOCIAL_PLATFORM_LABELS } from "@/lib/content-types";

export default function TemplateFooter({
  storeName,
  social = [],
  className = "",
}: {
  storeName: string;
  social?: SocialLink[];
  className?: string;
}) {
  return (
    <footer className={`tf ${className}`}>
      <div className="tf-brand">{storeName}</div>
      <nav className="tf-links" aria-label="روابط">
        <Link href="/store">المتجر</Link>
        <Link href="/policies/shipping">الشحن</Link>
        <Link href="/policies/returns">الاستبدال والاسترجاع</Link>
        <Link href="/contact">تواصل معنا</Link>
      </nav>
      {social.length > 0 && (
        <div className="tf-social">
          {social.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
              {SOCIAL_PLATFORM_LABELS[s.platform]}
            </a>
          ))}
        </div>
      )}
      <div className="tf-copy">© {new Date().getFullYear()} {storeName}</div>
    </footer>
  );
}
