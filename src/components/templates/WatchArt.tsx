import type { TemplateId } from "@/lib/templates";

/**
 * Drawn watch used wherever a product has no photo yet, styled per version.
 * `seed` varies dial colour and case shape so a grid of products without
 * photos doesn't look like the same picture repeated.
 */
export default function WatchArt({
  variant,
  seed = 0,
  size = 180,
}: {
  variant: TemplateId;
  seed?: number;
  size?: number;
}) {
  const dials: Record<TemplateId, string[]> = {
    midnight: ["#0d1120", "#1a2550", "#0b1a2e", "#22283f"],
    atelier: ["#efe3c8", "#1c1611", "#3a2a1c", "#e6d7b4"],
    porcelain: ["#ffffff", "#1f5c45", "#e9ece6", "#2a2f2c"],
  };
  const dial = dials[variant][seed % 4];
  const darkDial = ["#0d1120", "#1a2550", "#0b1a2e", "#22283f", "#1c1611", "#3a2a1c", "#1f5c45", "#2a2f2c"].includes(dial);
  const ink = darkDial ? "rgba(255,255,255,.85)" : "rgba(20,20,20,.8)";
  const caseStroke = variant === "atelier" ? "#c9a96a" : variant === "porcelain" ? "#9aa29c" : "#5a6cff";
  const strap = variant === "atelier" ? "#4a3423" : variant === "porcelain" ? "#c9cec7" : "#1c2646";
  const cushion = seed % 3 === 1;

  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 100 135" aria-hidden>
      {/* strap */}
      <rect x="33" y="0" width="34" height="30" rx="4" fill={strap} />
      <rect x="33" y="105" width="34" height="30" rx="4" fill={strap} />
      {/* lugs */}
      <rect x="30" y="24" width="40" height="10" rx="3" fill={caseStroke} opacity=".55" />
      <rect x="30" y="101" width="40" height="10" rx="3" fill={caseStroke} opacity=".55" />
      {/* crown */}
      <rect x="86" y="62" width="7" height="11" rx="2" fill={caseStroke} />
      {/* case */}
      {cushion ? (
        <rect x="14" y="31" width="74" height="74" rx="20" fill={caseStroke} />
      ) : (
        <circle cx="51" cy="67.5" r="38" fill={caseStroke} />
      )}
      {cushion ? (
        <rect x="19" y="36" width="64" height="64" rx="16" fill={dial} />
      ) : (
        <circle cx="51" cy="67.5" r="33" fill={dial} />
      )}
      {/* indices */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = 27;
        const r2 = i % 3 === 0 ? 21 : 24;
        return (
          <line
            key={i}
            x1={Math.round((51 + Math.sin(a) * r1) * 100) / 100}
            y1={Math.round((67.5 - Math.cos(a) * r1) * 100) / 100}
            x2={Math.round((51 + Math.sin(a) * r2) * 100) / 100}
            y2={Math.round((67.5 - Math.cos(a) * r2) * 100) / 100}
            stroke={i % 3 === 0 ? caseStroke : ink}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {/* hands at 10:10 */}
      <line x1="51" y1="67.5" x2="38" y2="58" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="51" y1="67.5" x2="68" y2="52" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="51" y1="67.5" x2="51" y2="92" stroke={caseStroke} strokeWidth=".8" />
      <circle cx="51" cy="67.5" r="2" fill={caseStroke} />
    </svg>
  );
}
