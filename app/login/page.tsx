"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const roleHome: Record<string, string> = {
  owner: "/admin",
  reseller: "/reseller",
  client: "/client",
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      alert("Email atau password salah.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (!profile) {
      alert("Akun ini belum memiliki profil. Hubungi admin.");
      return;
    }

    router.push(roleHome[profile.role] || "/");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      alert("Masukkan email akun Anda.");
      return;
    }

    setSendingReset(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setSendingReset(false);

    // Always show the same success message regardless of whether the email
    // exists, so this can't be used to probe which emails have accounts.
    if (error) {
      alert("Gagal mengirim email reset. Coba lagi beberapa saat lagi.");
      return;
    }

    setResetSent(true);
  };

  return (
    <main className={styles.standalonePage}>
      <div className={styles.loginCard}>
        <p className={styles.label}>VISTIQ INVITATION</p>
        <h1 className={styles.title} style={{ fontSize: 30, color: "#1167b2" }}>
          {showForgot ? "Lupa Password" : "Login Dashboard"}
        </h1>

        {!showForgot ? (
          <>
            <form onSubmit={handleLogin} className={styles.form}>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />

              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>

            <button
              onClick={() => {
                setShowForgot(true);
                setResetSent(false);
                setResetEmail(email);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#1167b2",
                fontSize: 13.5,
                marginTop: 16,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Lupa password?
            </button>
          </>
        ) : resetSent ? (
          <div>
            <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: 20 }}>
              Kalau email <strong>{resetEmail}</strong> terdaftar, link untuk
              atur ulang password sudah dikirim ke inbox tersebut. Buka email
              itu dan klik link-nya.
            </p>

            <button
              onClick={() => setShowForgot(false)}
              className={styles.button}
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: "#64748b", fontSize: 13.5, marginBottom: 16 }}>
              Masukkan email akun Anda. Kami kirim link untuk atur password baru.
            </p>

            <form onSubmit={handleForgotPassword} className={styles.form}>
              <input
                type="email"
                placeholder="Email akun Anda"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className={styles.input}
              />

              <button type="submit" className={styles.button} disabled={sendingReset}>
                {sendingReset ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>

            <button
              onClick={() => setShowForgot(false)}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: 13.5,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              ← Kembali ke Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}
