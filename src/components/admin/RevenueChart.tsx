"use client";

import { useState } from "react";

/** Single-series area chart (revenue per day) with a crosshair tooltip. */
export default function RevenueChart({ data }: { data: { date: string; value: number; orders: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 220;
  const pad = { top: 16, right: 8, bottom: 26, left: 8 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = (W - pad.left - pad.right) / Math.max(1, data.length - 1);
  const x = (i: number) => pad.left + i * step;
  const y = (v: number) => pad.top + (1 - v / max) * (H - pad.top - pad.bottom);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad.bottom} L${x(0).toFixed(1)},${H - pad.bottom} Z`;
  const empty = data.every((d) => d.value === 0);
  const h = hover !== null ? data[hover] : null;

  return (
    <div className="adm-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="الإيرادات اليومية لآخر 14 يومًا"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          // RTL page, but time runs left→right on the chart like a ruler
          const rel = ((e.clientX - r.left) / r.width) * W;
          setHover(Math.max(0, Math.min(data.length - 1, Math.round((rel - pad.left) / step))));
        }}
      >
        <defs>
          <linearGradient id="adm-rev" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--adm-accent)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--adm-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={pad.left} x2={W - pad.right} y1={y(max * t)} y2={y(max * t)} stroke="var(--adm-grid)" />
        ))}
        <line x1={pad.left} x2={W - pad.right} y1={H - pad.bottom} y2={H - pad.bottom} stroke="var(--adm-line)" />
        {!empty && <path d={area} fill="url(#adm-rev)" />}
        <path d={line} fill="none" stroke="var(--adm-accent)" strokeWidth="2" strokeLinejoin="round" opacity={empty ? 0.35 : 1} />
        {data.map((d, i) =>
          i % 2 === 0 || i === data.length - 1 ? (
            <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="adm-chart-axis">
              {d.date.slice(8)}/{d.date.slice(5, 7)}
            </text>
          ) : null
        )}
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={H - pad.bottom} stroke="var(--adm-line)" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(h.value)} r="5" fill="var(--adm-accent)" stroke="var(--adm-surface)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="adm-tooltip"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(h.value) / H) * 100}%` }}
        >
          <strong>{h.value.toLocaleString("ar-SA")} ر.س</strong>
          <span>
            {h.orders.toLocaleString("ar-SA")} طلب · {h.date}
          </span>
        </div>
      )}
      {empty && <p className="adm-chart-empty">لا توجد مبيعات في آخر 14 يومًا. ستظهر هنا فور وصول أول طلب.</p>}
    </div>
  );
}
