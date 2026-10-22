"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A live, scaled-down preview of one version: renders /preview/<id>?embed=1
 * in an iframe at desktop width and scales it to fit the card.
 */
export default function VersionThumb({
  id,
  title,
  frameWidth = 1280,
  frameHeight = 820,
}: {
  id: string;
  title: string;
  frameWidth?: number;
  frameHeight?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / frameWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth]);

  return (
    <div
      ref={box}
      className="vthumb"
      style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
    >
      {!loaded && <div className="vthumb-loading">جارٍ تحميل المعاينة…</div>}
      <iframe
        src={`/preview/${id}?embed=1`}
        title={`معاينة ${title}`}
        loading="lazy"
        tabIndex={-1}
        onLoad={() => setLoaded(true)}
        style={{
          width: frameWidth,
          height: frameHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top right",
          opacity: loaded ? 1 : 0,
        }}
      />
    </div>
  );
}
