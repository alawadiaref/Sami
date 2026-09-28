"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/login", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 6,
        fontSize: 14,
        background: "transparent",
        border: "1px solid var(--color-border)",
        color: "rgba(255,255,255,.7)",
        cursor: "pointer",
      }}
    >
      تسجيل الخروج
    </button>
  );
}
