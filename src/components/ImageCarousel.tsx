"use client";

import { useEffect, useState } from "react";

export interface ImageCarouselProps {
  images: string[];
  name?: string; // shown as a small caption/badge, e.g. carousel title set by the owner
  speedMs?: number; // 0 disables auto-advance
  transition?: "fade" | "slide";
  height?: number | string;
  rounded?: number;
  fallback?: React.ReactNode; // shown when there are no images at all
}

export default function ImageCarousel({
  images,
  name,
  speedMs = 3500,
  transition = "fade",
  height = 260,
  rounded = 10,
  fallback,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = images?.length ?? 0;

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (count < 2 || !speedMs) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), speedMs);
    return () => clearInterval(t);
  }, [count, speedMs]);

  if (count === 0) {
    return (
      <div
        style={{
          height,
          borderRadius: rounded,
          background: "var(--color-panel-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {fallback ?? (
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="28" fill="var(--color-bg)" stroke="rgba(255,255,255,.2)" />
            <line x1="50" y1="50" x2="50" y2="30" stroke="var(--color-accent)" strokeWidth="2" />
            <line x1="50" y1="50" x2="64" y2="56" stroke="#fff" strokeWidth="2" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height,
        borderRadius: rounded,
        overflow: "hidden",
        background: "var(--color-panel-2)",
      }}
    >
      {transition === "slide" ? (
        <div
          style={{
            display: "flex",
            width: `${count * 100}%`,
            height: "100%",
            transform: `translateX(${index * (100 / count)}%)`,
            transition: "transform .5s ease",
          }}
        >
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: `${100 / count}%`, height: "100%", objectFit: "cover", flexShrink: 0 }}
            />
          ))}
        </div>
      ) : (
        images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === index ? 1 : 0,
              transition: "opacity .6s ease",
            }}
          />
        ))
      )}

      {name && (
        <div
          style={{
            position: "absolute",
            top: 10,
            insetInlineStart: 10,
            background: "rgba(8,10,20,.55)",
            backdropFilter: "blur(6px)",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 20,
            zIndex: 2,
          }}
        >
          {name}
        </div>
      )}

      {count > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 6,
            zIndex: 2,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`صورة ${i + 1}`}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                background: i === index ? "var(--color-accent)" : "rgba(255,255,255,.4)",
                cursor: "pointer",
                transition: "all .3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
