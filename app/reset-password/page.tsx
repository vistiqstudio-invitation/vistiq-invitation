"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const roleHome: Record<string, string> = {
  owner: "/admin",
  reseller: "/reseller",
  client: "/client",
};

const WA_NUMBER = "6281371338032";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  // Only a recovery token from the email may authorize this page. Never
  // reuse an unrelated session that was already open in the same browser
  // (for example the owner's dashboard session).
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    const verifyRecoveryLink = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const type = hash.get("type");
      const code = new URLSearchParams(window.location.search).get("code");

      let valid = false;

      if (type === "recovery" && accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        valid = !error && Boolean(data.session);
      } else if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        valid = !error && Boolean(data.session);
      }

      if (!active) return;

      if (valid) {
        window.history.replaceState({}, "", window.location.pathname);
      }
      setValidSession(valid);
      setReady(true);
    };

    void verifyRecoveryLink();

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({ password });

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan password baru. Coba kirim ulang link reset.");
      return;
    }

    setDone(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setTimeout(() => {
        router.push((profile && roleHome[profile.role]) || "/login");
      }, 1800);
    }
  };

  return (
    <main className={styles.standalonePage}>
      <div className={styles.loginCard}>
        <p className={styles.label}>VISTIQ INVITATION</p>
        <h1 className={styles.title} style={{ fontSize: 30, color: "#1167b2" }}>
          Atur Password Baru
        </h1>

        {!ready ? (
          <p style={{ color: "#64748b" }}>Memverifikasi link...</p>
        ) : !validSession ? (
          <div>
            <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: 12 }}>
              Link ini sudah tidak berlaku atau kedaluwarsa.
            </p>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
              Ini sering terjadi di Gmail karena link dipindai otomatis
              sebelum sempat diklik, jadi minta link baru kemungkinan akan
              berulang lagi. Cara paling pasti: hubungi admin lewat{" "}
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" style={{ color: "#1167b2", fontWeight: 700 }}>
                WhatsApp
              </a>{" "}
              untuk dibantu reset password langsung.
            </p>
          </div>
        ) : done ? (
          <p style={{ color: "#15803d", lineHeight: 1.7 }}>
            Password berhasil diganti. Mengalihkan ke dashboard...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="password"
              placeholder="Password baru (min. 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <input
              type="password"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />

            <button type="submit" className={styles.button} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
