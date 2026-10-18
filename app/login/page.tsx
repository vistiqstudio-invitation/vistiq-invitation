"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const roleHome: Record<string, string> = {
  owner: "/admin",
  reseller: "/reseller",
  client: "/client",
  affiliate: "/affiliate",
};

const WA_NUMBER = "6281371338032";

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

    if (profile.role === "reseller") {
      const { data: reseller } = await supabase
        .from("resellers")
        .select("package, status, brand_active, brand_expires_at, billing_model")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (reseller?.package === "reseller_brand") {
        const isMonthlyLegacy = Boolean(reseller.brand_expires_at);
        const monthlyExpired =
          isMonthlyLegacy &&
          (reseller.status !== "active" ||
            reseller.brand_active !== true ||
            new Date(reseller.brand_expires_at as string).getTime() <= Date.now());

        if (monthlyExpired) {
          await supabase.auth.signOut();
          alert(
            "Masa aktif Mitra Brand Anda telah habis. Silakan hubungi admin untuk melakukan perpanjangan."
          );
          return;
        }

        if (!isMonthlyLegacy && reseller.billing_model === "per_invitation") {
          alert(
            "Informasi Layanan Mitra Brand\n\nUntuk menjaga kualitas layanan, kestabilan sistem, penyimpanan data, dan kenyamanan bisnis ke depannya, mulai sekarang setiap undangan pada akun Mitra Brand lama dikenakan biaya layanan Rp20.000 per undangan.\n\nAkun Mitra Brand Kakak tetap aktif tanpa biaya pendaftaran ulang maupun biaya bulanan. Kakak tetap bisa membuat dan mengedit undangan seperti biasa. Biaya layanan dibayarkan ketika undangan siap dipublikasikan. Setelah pembayaran berhasil melalui Midtrans, undangan akan langsung aktif otomatis.\n\nTerima kasih atas dukungan dan pengertiannya."
          );
        }
      }
    }

    if (profile.role === "client") {
      const { data: client } = await supabase
        .from("clients")
        .select("status")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (client?.status !== "active") {
        await supabase.auth.signOut();
        alert(
          "Akun client belum aktif. Silakan selesaikan pembayaran dan minta Admin Vistiq mengaktifkan akun. Reseller tetap dapat mengedit dan melihat preview draft dari Dashboard Reseller."
        );
        return;
      }
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

    if (error) {
      alert(
        `Gagal mengirim email reset.\n\nDetail: ${error.message}${
          error.status ? ` (status ${error.status})` : ""
        }\n\nCoba lagi beberapa saat lagi, atau cek Authentication > Logs di Supabase Dashboard.`
      );
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
            <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: 16 }}>
              Kalau email <strong>{resetEmail}</strong> terdaftar, link untuk
              atur ulang password sudah dikirim ke inbox tersebut. Buka email
              itu dan klik link-nya secepatnya.
            </p>

            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Kalau linknya langsung bilang &quot;kedaluwarsa&quot; padahal baru
              dibuka (sering terjadi di Gmail karena link dipindai otomatis
              sebelum sempat diklik), tidak perlu diulang - langsung hubungi
              admin lewat{" "}
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" style={{ color: "#1167b2", fontWeight: 700 }}>
                WhatsApp
              </a>{" "}
              untuk dibantu reset langsung.
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
