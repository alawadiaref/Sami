"use client";

import { useRef } from "react";
import { motion, transform, useScroll, useTransform } from "framer-motion";

/**
 * Porcelain hero: scrolling is winding the crown. The minute hand sweeps a
 * full turn, the hour hand moves one hour, and a strip of minute marks slides
 * past underneath like an unrolled bezel. The case parts slide in from the
 * edges and close around the dial as you go.
 */
export default function PorcelainHero({ storeName }: { storeName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const minute = useTransform(p, (v: number) => transform(v, [0, 1], [60, 420]));
  const hour = useTransform(p, (v: number) => transform(v, [0, 1], [-60, -30]));
  const ruler = useTransform(p, (v: number) => transform(v, [0, 1], ["0%", "-50%"]));
  const caseIn = useTransform(p, (v: number) => transform(v, [0, 0.45], [0, 1]));
  const lugTop = useTransform(caseIn, (v: number) => transform(v, [0, 1], [-60, 0]));
  const lugBottom = useTransform(caseIn, (v: number) => transform(v, [0, 1], [60, 0]));
  const bezelScale = useTransform(caseIn, (v: number) => transform(v, [0, 1], [1.5, 1]));
  const bezelOpacity = useTransform(caseIn, (v: number) => transform(v, [0, 1], [0, 1]));
  const headlineY = useTransform(p, (v: number) => transform(v, [0, 1], [0, -40]));
  const cta = useTransform(p, (v: number) => transform(v, [0.55, 0.85], [0, 1]));

  return (
    <section ref={ref} className="pc-hero" aria-label="الواجهة">
      <div className="pc-hero-stage">
        <motion.div className="pc-hero-head" style={{ y: headlineY }}>
          <h1>الوقت، بلا ضجيج.</h1>
          <p>
            ساعات {storeName} مختارة لمن يفضّل التفاصيل الهادئة. مرّر للأسفل، وكأنك تدير التاج.
          </p>
        </motion.div>

        <div className="pc-watch" aria-hidden>
          <motion.div className="pc-strap pc-strap-top" style={{ y: lugTop, opacity: bezelOpacity }} />
          <motion.div className="pc-strap pc-strap-bottom" style={{ y: lugBottom, opacity: bezelOpacity }} />
          <svg viewBox="0 0 300 300" className="pc-face">
            <motion.circle
              cx="150" cy="150" r="140"
              fill="none" stroke="var(--color-text)" strokeWidth="2"
              style={{ scale: bezelScale, opacity: bezelOpacity }}
            />
            <circle cx="150" cy="150" r="128" fill="var(--color-panel)" stroke="var(--color-panel-2)" strokeWidth="1" />
            {Array.from({ length: 60 }).map((_, i) => (
              <line
                key={i}
                x1="150"
                y1={i % 5 === 0 ? 30 : 34}
                x2="150"
                y2="40"
                stroke="var(--color-text)"
                strokeOpacity={i % 5 === 0 ? 0.9 : 0.35}
                strokeWidth={i % 5 === 0 ? 2 : 1}
                transform={`rotate(${i * 6} 150 150)`}
              />
            ))}
            <motion.g style={{ rotate: hour }}>
              <circle cx="150" cy="150" r="128" fill="none" />
              <line x1="150" y1="150" x2="150" y2="88" stroke="var(--color-text)" strokeWidth="6" strokeLinecap="round" />
            </motion.g>
            <motion.g style={{ rotate: minute }}>
              <circle cx="150" cy="150" r="128" fill="none" />
              <line x1="150" y1="150" x2="150" y2="50" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />
            </motion.g>
            <circle cx="150" cy="150" r="5" fill="var(--color-accent)" />
          </svg>
        </div>

        <motion.div className="pc-hero-cta" style={{ opacity: cta }}>
          <a className="pc-btn" href="#grid">
            تسوّق الساعات
          </a>
          <a className="pc-link" href="#collections">
            المجموعات
          </a>
        </motion.div>
        <div className="pc-ruler" aria-hidden>
          <motion.div className="pc-ruler-track" style={{ x: ruler }}>
            {Array.from({ length: 120 }).map((_, i) => (
              <span key={i} className={i % 5 === 0 ? "major" : ""}>
                {i % 5 === 0 ? <em>{(i % 60).toString().padStart(2, "0")}</em> : null}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
