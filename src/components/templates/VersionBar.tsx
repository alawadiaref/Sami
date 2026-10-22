import { TEMPLATES, type TemplateId } from "@/lib/templates";

/** Floating bar on preview pages: switch between versions or pick this one. */
export default function VersionBar({ current, live }: { current: TemplateId; live: boolean }) {
  const i = TEMPLATES.findIndex((t) => t.id === current);
  const meta = TEMPLATES[i];
  const prev = TEMPLATES[(i - 1 + TEMPLATES.length) % TEMPLATES.length];
  const next = TEMPLATES[(i + 1) % TEMPLATES.length];

  return (
    <div className="vbar" role="region" aria-label="التنقل بين النسخ">
      <a href="/versions" className="vbar-all">
        كل النسخ
      </a>
      <div className="vbar-center">
        <a href={`/preview/${prev.id}`} aria-label={`النسخة السابقة: ${prev.name}`} className="vbar-step">
          ›
        </a>
        <div className="vbar-name">
          <strong>{meta.name}</strong>
          <span>
            النسخة {i + 1} من {TEMPLATES.length}
            {live ? " · المعتمدة حاليًا" : ""}
          </span>
        </div>
        <a href={`/preview/${next.id}`} aria-label={`النسخة التالية: ${next.name}`} className="vbar-step">
          ‹
        </a>
      </div>
      <a href={`/admin/versions?pick=${current}`} className="vbar-pick">
        {live ? "إدارة النسخة" : "اعتماد هذه النسخة"}
      </a>
    </div>
  );
}
