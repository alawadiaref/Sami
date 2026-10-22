export default function CollectionRow({
  tag,
  title,
  description,
  reverse = false,
  image,
}: {
  tag: string;
  title: string;
  description: string;
  reverse?: boolean;
  image?: string;
}) {
  const visual = (
    <div
      className="mn-row-visual"
      style={{
        flex: 1.2,
        background: image ? undefined : "linear-gradient(150deg, var(--color-panel-2), #0b0f1e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <svg width="260" height="260" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="28" fill="#141b30" stroke="rgba(255,255,255,.25)" />
          <line x1="50" y1="50" x2="50" y2="30" stroke="var(--color-accent)" strokeWidth="2" />
          <line x1="50" y1="50" x2="64" y2="56" stroke="#fff" strokeWidth="2" />
        </svg>
      )}
    </div>
  );

  const copy = (
    <div className="mn-row-copy" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 70px" }}>
      <div style={{ fontSize: 12, letterSpacing: 3, color: "var(--color-accent)", marginBottom: 16 }}>{tag}</div>
      <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.5, marginBottom: 20 }}>{title}</div>
      <div style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.9, marginBottom: 28 }}>
        {description}
      </div>
      <a className="btn-primary" href="#products" style={{ alignSelf: "flex-start" }}>
        استكشف
      </a>
    </div>
  );

  return (
    <div className={`mn-row${reverse ? " mn-row-rev" : ""}`} style={{ display: "flex", minHeight: 600 }}>
      {reverse ? (
        <>
          {copy}
          {visual}
        </>
      ) : (
        <>
          {visual}
          {copy}
        </>
      )}
    </div>
  );
}
