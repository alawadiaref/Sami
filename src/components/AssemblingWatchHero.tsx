"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Hero section: a luxury watch that starts fully disassembled (case, bezel,
 * dial, hands, crown and strap links scattered) and assembles itself as the
 * visitor scrolls down through the section. Built with Framer Motion's
 * scroll-linked transforms — no scroll-jacking, it just tracks native scroll
 * progress through a tall (300vh) wrapper while the visual stays pinned.
 */

type Piece = {
  key: string;
  // scattered starting offset/rotation, and where it ends up (0,0,0 = assembled)
  fromX: number;
  fromY: number;
  fromRotate: number;
  delayStart?: number; // 0-1 scroll progress at which this piece starts moving
  delayEnd?: number;
  children: React.ReactNode;
};

export default function AssemblingWatchHero({ storeName = "METRIQUE" }: { storeName?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const pieces: Piece[] = [
    {
      key: "strap-top",
      fromX: 0,
      fromY: -260,
      fromRotate: -8,
      delayStart: 0,
      delayEnd: 0.55,
      children: (
        <div
          style={{
            width: 46,
            height: 130,
            background: "linear-gradient(#1c2646,#141b30)",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "6px 6px 0 0",
          }}
        />
      ),
    },
    {
      key: "strap-bottom",
      fromX: 0,
      fromY: 260,
      fromRotate: 8,
      delayStart: 0,
      delayEnd: 0.55,
      children: (
        <div
          style={{
            width: 46,
            height: 130,
            background: "linear-gradient(#141b30,#1c2646)",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "0 0 6px 6px",
          }}
        />
      ),
    },
    {
      key: "bezel",
      fromX: -320,
      fromY: -180,
      fromRotate: -140,
      delayStart: 0.1,
      delayEnd: 0.65,
      children: (
        <svg width="220" height="220" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-accent)" strokeWidth="6" />
        </svg>
      ),
    },
    {
      key: "case",
      fromX: 300,
      fromY: -220,
      fromRotate: 130,
      delayStart: 0.15,
      delayEnd: 0.7,
      children: (
        <svg width="200" height="200" viewBox="0 0 200 200">
          <rect x="18" y="18" width="164" height="164" rx="28" fill="#141b30" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      key: "crown",
      fromX: 340,
      fromY: 40,
      fromRotate: 60,
      delayStart: 0.2,
      delayEnd: 0.75,
      children: (
        <div
          style={{
            width: 22,
            height: 34,
            background: "var(--color-accent)",
            borderRadius: 3,
          }}
        />
      ),
    },
    {
      key: "dial",
      fromX: -280,
      fromY: 260,
      fromRotate: -100,
      delayStart: 0.25,
      delayEnd: 0.8,
      children: (
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="70" fill="#0d1120" stroke="rgba(255,255,255,.25)" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = Math.round((75 + Math.sin(angle) * 60) * 100) / 100;
            const y1 = Math.round((75 - Math.cos(angle) * 60) * 100) / 100;
            const x2 = Math.round((75 + Math.sin(angle) * 52) * 100) / 100;
            const y2 = Math.round((75 - Math.cos(angle) * 52) * 100) / 100;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.5)" strokeWidth="2" />
            );
          })}
        </svg>
      ),
    },
    {
      key: "hour-hand",
      fromX: -60,
      fromY: -300,
      fromRotate: -200,
      delayStart: 0.4,
      delayEnd: 0.9,
      children: (
        <div
          style={{
            width: 4,
            height: 46,
            background: "var(--color-accent)",
            borderRadius: 2,
            transformOrigin: "bottom center",
          }}
        />
      ),
    },
    {
      key: "minute-hand",
      fromX: 60,
      fromY: -300,
      fromRotate: 210,
      delayStart: 0.45,
      delayEnd: 0.95,
      children: (
        <div
          style={{
            width: 3,
            height: 64,
            background: "#fff",
            borderRadius: 2,
            transformOrigin: "bottom center",
          }}
        />
      ),
    },
    {
      key: "pin",
      fromX: 0,
      fromY: 0,
      fromRotate: 0,
      delayStart: 0.5,
      delayEnd: 1,
      children: <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-accent)" }} />,
    },
  ];

  return (
    <div ref={sectionRef} style={{ position: "relative", height: "300vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 35%, var(--color-panel-2), var(--color-bg) 70%)",
        }}
      >
        <div style={{ position: "relative", width: 560, height: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {pieces.map((p) => (
            <AssemblingPiece key={p.key} piece={p} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div
          style={{
            textAlign: "center",
            marginTop: 20,
            opacity: useTransform(scrollYProgress, [0.75, 1], [0, 1]),
            transform: "translateY(0)",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 22 }}>الوقت، بشكله الأكثر تطورًا</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <a className="btn-primary" href="#products">
              تسوق الآن
            </a>
            <a className="btn-outline" href="#collections">
              استكشف المجموعة
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            bottom: 34,
            fontSize: 11,
            letterSpacing: 3,
            color: "rgba(255,255,255,.5)",
            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
          }}
        >
          مرر للأسفل ليتجمّع ↓
        </motion.div>

        <div
          style={{
            position: "absolute",
            top: 24,
            fontSize: 12,
            letterSpacing: 2,
            color: "var(--color-accent)",
            opacity: 0.9,
          }}
        >
          {storeName}
        </div>
      </div>
    </div>
  );
}

function AssemblingPiece({
  piece,
  progress,
}: {
  piece: Piece;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = piece.delayStart ?? 0;
  const end = piece.delayEnd ?? 1;
  const x = useTransform(progress, [start, end], [piece.fromX, 0]);
  const y = useTransform(progress, [start, end], [piece.fromY, 0]);
  const rotate = useTransform(progress, [start, end], [piece.fromRotate, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        x,
        y,
        rotate,
      }}
    >
      {piece.children}
    </motion.div>
  );
}
