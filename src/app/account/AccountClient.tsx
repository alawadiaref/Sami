"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

interface InitialCustomer {
  name: string;
  email: string;
}

export default function AccountClient({
  storeName,
  initialCustomer,
}: {
  storeName: string;
  initialCustomer: InitialCustomer | null;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<InitialCustomer | null>(initialCustomer);
  const [mode, setMode] = useState<Mode>("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/customer-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setCustomer({ name: data.name, email: loginForm.email });
      router.refresh();
    } else {
      setError(data.error ?? "خطأ غير معروف");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/customer-auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setCustomer({ name: data.name, email: registerForm.email });
      router.refresh();
    } else {
      setError(data.error ?? "خطأ غير معروف");
    }
  }

  async function handleLogout() {
    await fetch("/api/customer-auth/login", { method: "DELETE" });
    setCustomer(null);
    router.refresh();
  }

  return (
    <div className="account-page" style={containerStyle}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.14 }}>
        <div style={ringStyle} />
      </div>

      <a href="/" style={backLinkStyle}>
        ← العودة للمتجر
      </a>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <ClockFace />

        <div style={{ textAlign: "center", marginTop: -8 }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--color-accent)", fontWeight: 700 }}>{storeName}</div>
          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>
            {customer ? `أهلًا بك، ${customer.name}` : "حسابي"}
          </div>
        </div>

        {customer ? (
          <div className="account-card" style={{ ...cardStyle, textAlign: "center", gap: 18 }}>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{customer.email}</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="/store" className="account-btn account-btn-primary">
                تصفح المتجر
              </a>
              <button onClick={handleLogout} className="account-btn account-btn-ghost">
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={tabsWrapStyle}>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`account-tab${mode === "login" ? " active" : ""}`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`account-tab${mode === "register" ? " active" : ""}`}
              >
                حساب جديد
              </button>
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="account-card" style={cardStyle}>
                <label style={labelStyle}>
                  البريد الإلكتروني
                  <input
                    type="email"
                    dir="ltr"
                    autoFocus
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  كلمة المرور
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                {error && <div style={errorStyle}>{error}</div>}
                <button type="submit" disabled={loading} className="account-btn account-btn-primary" style={{ marginTop: 8 }}>
                  {loading ? "جارٍ الدخول..." : "دخول"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="account-card" style={cardStyle}>
                <label style={labelStyle}>
                  الاسم الكامل
                  <input
                    autoFocus
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  البريد الإلكتروني
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  رقم الجوال
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  كلمة المرور
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                {error && <div style={errorStyle}>{error}</div>}
                <button type="submit" disabled={loading} className="account-btn account-btn-primary" style={{ marginTop: 8 }}>
                  {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin-slow-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes account-tick-second {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .account-tab {
          flex: 1;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-display);
          color: rgba(255,255,255,.6);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color .2s ease;
        }
        .account-tab.active {
          color: #0d1120;
          background: linear-gradient(135deg, #8fa2ff, var(--color-accent));
        }
        .account-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-display);
          cursor: pointer;
          border: 1px solid transparent;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s ease, background .22s ease, border-color .22s ease;
          width: 100%;
        }
        .account-btn-primary {
          background: linear-gradient(135deg, rgba(102,128,255,.9), rgba(61,92,255,.65));
          border-color: rgba(150,168,255,.55);
          color: #fff;
          box-shadow: 0 8px 24px rgba(61,92,255,.35), inset 0 1px 0 rgba(255,255,255,.28);
        }
        .account-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(61,92,255,.45), inset 0 1px 0 rgba(255,255,255,.32);
        }
        .account-btn-primary:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }
        .account-btn-ghost {
          background: rgba(255,255,255,.05);
          border-color: rgba(255,255,255,.14);
          color: #fff;
          width: auto;
        }
        .account-btn-ghost:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.3);
          transform: translateY(-2px);
        }
        .account-page input:focus {
          outline: none;
          border-color: rgba(99,125,255,.65) !important;
          box-shadow: 0 0 0 3px rgba(61,92,255,.18);
        }
      `}</style>
    </div>
  );
}

function ClockFace() {
  return (
    <div style={{ position: "relative", width: 150, height: 150 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="68" fill="#111731" stroke="var(--color-accent)" strokeWidth="2" />
        <circle cx="75" cy="75" r="55" fill="#0d1120" stroke="rgba(255,255,255,.15)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x1 = Math.round((75 + Math.sin(angle) * 48) * 100) / 100;
          const y1 = Math.round((75 - Math.cos(angle) * 48) * 100) / 100;
          const x2 = Math.round((75 + Math.sin(angle) * 41) * 100) / 100;
          const y2 = Math.round((75 - Math.cos(angle) * 41) * 100) / 100;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.4)" strokeWidth="2" />;
        })}
        <line
          x1="75"
          y1="75"
          x2="75"
          y2="42"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transformOrigin: "75px 75px", animation: "account-tick-second 43200s linear infinite" }}
        />
        <line
          x1="75"
          y1="75"
          x2="75"
          y2="52"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: "75px 75px", animation: "account-tick-second 3600s linear infinite" }}
        />
        <line
          x1="75"
          y1="75"
          x2="75"
          y2="35"
          stroke="#ff6b6b"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ transformOrigin: "75px 75px", animation: "account-tick-second 60s steps(60) infinite" }}
        />
        <circle cx="75" cy="75" r="3.5" fill="var(--color-accent)" />
      </svg>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(ellipse at 50% 40%, #1a2340, #0a0d18 75%)",
  position: "relative",
  overflow: "hidden",
  padding: "40px 16px",
};

const ringStyle: React.CSSProperties = {
  width: 560,
  height: 560,
  borderRadius: "50%",
  border: "1px solid var(--color-accent)",
  animation: "spin-slow-ring 50s linear infinite",
};

const backLinkStyle: React.CSSProperties = {
  position: "absolute",
  top: 28,
  right: 34,
  fontSize: 13,
  color: "rgba(255,255,255,.6)",
  zIndex: 2,
};

const tabsWrapStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  padding: 4,
  borderRadius: 999,
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.1)",
  width: 360,
  maxWidth: "100%",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(17,23,49,.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,.08)",
  padding: 32,
  borderRadius: 16,
  width: 360,
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--color-text-muted)" };

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(13,17,32,.8)",
  color: "#fff",
  fontSize: 14,
  transition: "border-color .2s ease, box-shadow .2s ease",
};

const errorStyle: React.CSSProperties = { color: "#ff6b6b", fontSize: 13 };
