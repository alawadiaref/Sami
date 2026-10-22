"use client";

import { useEffect, useRef, useState } from "react";
import { motion, transform, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Atelier hero: a champagne dial that shows the real time right now (Riyadh),
 * second hand ticking. Scrolling down lifts the dial away and reveals the
 * movement underneath — gears turning, balance wheel swinging.
 */
export default function AtelierHero({ storeName }: { storeName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const dialOpacity = useTransform(scrollYProgress, (v: number) => transform(v, [0.25, 0.6], [1, 0]));
  const dialScale = useTransform(scrollYProgress, (v: number) => transform(v, [0.2, 0.65], [1, 1.18]));
  const dialY = useTransform(scrollYProgress, (v: number) => transform(v, [0.2, 0.65], [0, -60]));
  const moveOpacity = useTransform(scrollYProgress, (v: number) => transform(v, [0.3, 0.6], [0, 1]));
  const gearTurn = useTransform(scrollYProgress, (v: number) => transform(v, [0, 1], [0, 540]));
  const gearTurnBack = useTransform(scrollYProgress, (v: number) => transform(v, [0, 1], [0, -810]));
  const copyA = useTransform(scrollYProgress, (v: number) => transform(v, [0, 0.3], [1, 0]));
  const copyB = useTransform(scrollYProgress, (v: number) => transform(v, [0.55, 0.85], [0, 1]));

  const now = useRiyadhTime();

  return (
    <section ref={ref} className="at-hero" aria-label="الواجهة">
      <div className="at-hero-stage">
        <div className="at-hero-copy">
          <motion.div style={{ opacity: copyA }} className="at-hero-copy-block">
            <p className="at-kicker">{storeName}</p>
            <h1>ساعات تُشترى مرة، وتُورَّث.</h1>
            <p className="at-lede">
              الساعة أمامك تشير إلى الوقت الآن في الرياض. مرّر للأسفل لترى ما يحدث تحت الميناء.
            </p>
          </motion.div>
          <motion.div style={{ opacity: copyB }} className="at-hero-copy-block at-hero-copy-b">
            <h2>قلب الساعة، كما لم تره من قبل.</h2>
            <div className="at-hero-ctas">
              <a className="at-btn" href="#vitrine">
                تصفّح الساعات
              </a>
              <a className="at-btn-ghost" href="#collections">
                المجموعات
              </a>
            </div>
          </motion.div>
        </div>

        <div className="at-watch">
          {/* movement (revealed) */}
          <motion.svg viewBox="0 0 400 400" className="at-layer" style={{ opacity: moveOpacity }} aria-hidden>
            <circle cx="200" cy="200" r="168" fill="#1f1810" stroke="#c9a96a" strokeOpacity=".4" />
            <motion.g style={{ rotate: reduce ? 0 : gearTurn }}>
              <Gear cx={130} cy={160} r={62} teeth={28} />
            </motion.g>
            <motion.g style={{ rotate: reduce ? 0 : gearTurnBack }}>
              <Gear cx={245} cy={150} r={44} teeth={20} />
            </motion.g>
            <motion.g style={{ rotate: reduce ? 0 : gearTurn }}>
              <Gear cx={220} cy={262} r={52} teeth={24} />
            </motion.g>
            <g className={reduce ? "" : "at-balance"} style={{ transformOrigin: "130px 280px" }}>
              <circle cx="130" cy="280" r="34" fill="none" stroke="#c9a96a" strokeWidth="4" />
              <line x1="96" y1="280" x2="164" y2="280" stroke="#c9a96a" strokeWidth="3" />
            </g>
            {[
              [110, 110],
              [300, 220],
              [280, 300],
              [175, 330],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#8c1d2e" stroke="#c9a96a" strokeWidth="1.5" />
            ))}
          </motion.svg>

          {/* dial (lifts away) */}
          <motion.svg
            viewBox="0 0 400 400"
            className="at-layer"
            style={{ opacity: dialOpacity, scale: dialScale, y: dialY }}
            role="img"
            aria-label={now ? `الساعة ${now.h % 12 || 12}:${String(now.m).padStart(2, "0")}` : "ساعة"}
          >
            <circle cx="200" cy="200" r="190" fill="#2b2219" />
            <circle cx="200" cy="200" r="182" fill="none" stroke="#c9a96a" strokeWidth="6" />
            <circle cx="200" cy="200" r="168" fill="#efe3c8" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="#c9a96a" strokeOpacity=".5" />
            {Array.from({ length: 60 }).map((_, i) => {
              const major = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1="200"
                  y1={major ? 42 : 46}
                  x2="200"
                  y2="56"
                  stroke={major ? "#2b2219" : "#7a6650"}
                  strokeWidth={major ? 3 : 1}
                  transform={`rotate(${i * 6} 200 200)`}
                />
              );
            })}
            <text x="200" y="128" textAnchor="middle" className="at-dial-name">
              {storeName}
            </text>
            {now && (
              <>
                <line
                  x1="200" y1="200" x2="200" y2="112"
                  stroke="#2b2219" strokeWidth="9" strokeLinecap="round"
                  transform={`rotate(${(now.h % 12) * 30 + now.m * 0.5} 200 200)`}
                />
                <line
                  x1="200" y1="200" x2="200" y2="74"
                  stroke="#2b2219" strokeWidth="6" strokeLinecap="round"
                  transform={`rotate(${now.m * 6 + now.s * 0.1} 200 200)`}
                />
                <line
                  x1="200" y1="230" x2="200" y2="62"
                  stroke="#8c1d2e" strokeWidth="2"
                  transform={`rotate(${now.s * 6} 200 200)`}
                />
              </>
            )}
            <circle cx="200" cy="200" r="7" fill="#c9a96a" />
          </motion.svg>
        </div>

        <motion.p className="at-scroll-hint" style={{ opacity: copyA }}>
          مرّر لفتح الساعة
        </motion.p>
      </div>
    </section>
  );
}

function Gear({ cx, cy, r, teeth }: { cx: number; cy: number; r: number; teeth: number }) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r - 7;
    pts.push(`${Math.round((cx + Math.cos(a) * rr) * 10) / 10},${Math.round((cy + Math.sin(a) * rr) * 10) / 10}`);
  }
  return (
    <g>
      <polygon points={pts.join(" ")} fill="#c9a96a" opacity=".9" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#1f1810" />
      {[0, 1, 2, 3].map((k) => (
        <line
          key={k}
          x1={cx}
          y1={cy}
          x2={Math.round((cx + Math.cos((k * Math.PI) / 2) * r * 0.62) * 10) / 10}
          y2={Math.round((cy + Math.sin((k * Math.PI) / 2) * r * 0.62) * 10) / 10}
          stroke="#c9a96a"
          strokeWidth="5"
        />
      ))}
      <circle cx={cx} cy={cy} r="7" fill="#8c1d2e" />
    </g>
  );
}

function useRiyadhTime() {
  const [t, setT] = useState<{ h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Riyadh",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
      setT({ h: get("hour"), m: get("minute"), s: get("second") });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}
