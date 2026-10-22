"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

// The dial's hour/minute hands track real time in Mecca (Asia/Riyadh, UTC+3,
// no DST) rather than any local/browser timezone.
function getMeccaTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hours: get("hour"), minutes: get("minute"), seconds: get("second") };
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Starts null so server-rendered markup and the first client render match
  // exactly (both show the placeholder); the real, ticking value is only
  // ever computed client-side, after mount.
  const [meccaTime, setMeccaTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  useEffect(() => {
    setMeccaTime(getMeccaTime());
    const t = setInterval(() => setMeccaTime(getMeccaTime()), 1000);
    return () => clearInterval(t);
  }, []);
  const hourAngle = meccaTime ? ((meccaTime.hours % 12) + meccaTime.minutes / 60) * 30 : 0;
  const minuteAngle = meccaTime ? (meccaTime.minutes + meccaTime.seconds / 60) * 6 : 0;

  const totalChars = username.length + password.length;

  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);

  function emitParticle() {
    const id = particleId.current++;
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 30;
    setParticles((p) => [...p, { id, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }]);
    setTimeout(() => setParticles((p) => p.filter((particle) => particle.id !== id)), 600);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "خطأ غير معروف");
    }
  }

  return (
    <div
      className="admin-scope"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 40%, #1a2340, #0a0d18 75%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient rotating rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}>
        <div
          style={{
            width: 620,
            height: 620,
            borderRadius: "50%",
            border: "1px solid var(--color-accent)",
            animation: "spin-slow 40s linear infinite",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        {/* Reactive watch face */}
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <motion.svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.25 }}
            key={totalChars}
          >
            <circle cx="90" cy="90" r="82" fill="#111731" stroke="var(--color-accent)" strokeWidth="2.5" />
            <circle cx="90" cy="90" r="66" fill="#0d1120" stroke="rgba(255,255,255,.15)" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x1 = Math.round((90 + Math.sin(angle) * 58) * 100) / 100;
              const y1 = Math.round((90 - Math.cos(angle) * 58) * 100) / 100;
              const x2 = Math.round((90 + Math.sin(angle) * 50) * 100) / 100;
              const y2 = Math.round((90 - Math.cos(angle) * 50) * 100) / 100;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.4)" strokeWidth="2" />;
            })}
            <motion.line
              x1="90"
              y1="90"
              x2="90"
              y2="50"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ rotate: hourAngle }}
              transition={{ type: "tween", ease: "linear", duration: 0.3 }}
              style={{ transformOrigin: "90px 90px" }}
            />
            <motion.line
              x1="90"
              y1="90"
              x2="90"
              y2="64"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: minuteAngle }}
              transition={{ type: "tween", ease: "linear", duration: 0.3 }}
              style={{ transformOrigin: "90px 90px" }}
            />
            <circle cx="90" cy="90" r="4" fill="var(--color-accent)" />
          </motion.svg>

          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 90, y: 90, opacity: 1, scale: 1 }}
                animate={{ x: 90 + p.x, y: 90 + p.y, opacity: 0, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div style={{ textAlign: "center", marginTop: -12 }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--color-accent)", fontWeight: 700 }}>METRIQUE</div>
          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>لوحة تحكم المالك</div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 6, letterSpacing: 1 }} dir="ltr">
            {meccaTime
              ? `${String(meccaTime.hours).padStart(2, "0")}:${String(meccaTime.minutes).padStart(2, "0")}:${String(meccaTime.seconds).padStart(2, "0")}`
              : "--:--:--"}{" "}
            — توقيت مكة المكرمة
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(17,23,49,.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.08)",
            padding: 36,
            borderRadius: 14,
            width: 360,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <label style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            الاسم
            <input
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                emitParticle();
              }}
              style={inputStyle}
            />
          </label>
          <label style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            كلمة المرور
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                emitParticle();
              }}
              style={inputStyle}
            />
          </label>
          {error && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 8 }}>
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(13,17,32,.8)",
  color: "#fff",
  fontSize: 14,
};
