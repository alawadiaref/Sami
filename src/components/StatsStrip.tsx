const defaultStats = [
  { value: "+120", label: "موديل متاح" },
  { value: "5 سنوات", label: "ضمان شامل" },
  { value: "100%", label: "أصلية موثقة" },
  { value: "24 ساعة", label: "شحن سريع" },
];

export default function StatsStrip({ stats = defaultStats }: { stats?: { value: string; label: string }[] }) {
  return (
    <div
      className="mn-stats"
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "44px 64px",
        background: "var(--color-panel)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
