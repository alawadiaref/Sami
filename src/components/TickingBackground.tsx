"use client";

/**
 * Subtle decorative background: a large, faint watch face with a second hand
 * that ticks (not sweeps) once per second, like a real mechanical movement.
 * Pure CSS animation (stepped timing function) — no JS timers.
 */
export default function TickingBackground({ size = 900 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.06,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="96" fill="none" stroke="#fff" strokeWidth="0.5" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360;
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={major ? 10 : 14}
              x2="100"
              y2="18"
              stroke="#fff"
              strokeWidth={major ? 1 : 0.5}
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="20"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          style={{
            transformOrigin: "100px 100px",
            animation: "tick-second 60s steps(60) infinite",
          }}
        />
      </svg>
      <style>{`
        @keyframes tick-second {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
