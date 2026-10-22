"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget({
  storeName,
}: {
  storeName: string;
  shippingPolicy?: string;
  returnPolicy?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `مرحبًا بك في ${storeName}! كيف يمكنني مساعدتك اليوم؟` },
  ]);

  if (pathname?.startsWith("/admin")) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: next.slice(0, -1) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "عذرًا، حدث خطأ." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "عذرًا، تعذّر الاتصال حاليًا." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-widget" style={{ position: "fixed", bottom: 24, insetInlineEnd: 24, zIndex: 100 }}>
      {open && (
        <div
          className="glass-panel"
          style={{
            width: 320,
            height: 420,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 16px", fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            الدعم الفني — {storeName}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-start" : "flex-end",
                  background: m.role === "user" ? "rgba(255,255,255,.06)" : "var(--color-accent)",
                  color: m.role === "user" ? "#fff" : "var(--color-bg)",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  maxWidth: "85%",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>جارٍ الكتابة...</div>}
          </div>
          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="اكتب رسالتك..."
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "#fff",
                fontSize: 13,
              }}
            />
            <button onClick={send} className="btn-primary" style={{ padding: "8px 14px" }}>
              إرسال
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--color-accent)",
          color: "var(--color-bg)",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,.4)",
        }}
        aria-label="الدردشة مع الدعم"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
