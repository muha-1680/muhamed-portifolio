"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function login() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-form">
      <h2>
        <i className="fas fa-lock" style={{ color: "var(--primary)" }}></i>{" "}
        Admin Login
      </h2>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        Enter your password to manage your portfolio
      </p>
      <input
        type="password"
        placeholder="Enter password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") login();
        }}
        autoFocus
      />
      <button onClick={login} disabled={busy}>
        {busy ? "Logging in..." : "Login"}
      </button>
      {showError && (
        <div className="login-error">❌ Wrong password. Try again.</div>
      )}
    </div>
  );
}