"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { rememberedEmail, rememberEmail, savedLogin, saveLogin } from "@/lib/loginDevice";
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  useEffect(() => {
    const saved = rememberedEmail();
    // Hydrate a browser-only preference once after the server-rendered form.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) { setEmail(saved); setRememberDevice(true); }
  }, []);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    try {
      let loginEmail = email.trim();
      let loginPassword = password;
      let user = null;

      if (rememberDevice && !loginPassword) {
        // Validate a continuing session with Auth before reusing it.
        const { data } = await supabase.auth.getUser();
        if (data.user?.email?.toLowerCase() === loginEmail.toLowerCase()) user = data.user;
        if (!user) {
          const saved = await savedLogin(loginEmail);
          if (saved) {
            loginEmail = saved.email;
            loginPassword = saved.password;
            setEmail(loginEmail);
            setPassword(loginPassword);
          }
        }
      }

      if (!user) {
        if (!loginEmail || !loginPassword) {
          alert(rememberDevice
            ? "Masukkan password sekali, lalu pilih Simpan saat HP menawarkan penyimpanan password. Pada login berikutnya gunakan akun tersimpan."
            : "Email dan password wajib diisi.");
          return;
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        if (error || !data.user) {
          alert("Email atau password salah.");
          return;
        }
        user = data.user;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile) {
        alert("Akun ini belum memiliki profil. Hubungi admin.");
        return;
      }

      if (profile.role === "reseller") {
        const { data: reseller } = await supabase
          .from("resellers")
          .select("package, status, brand_active, brand_expires_at, billing_model")
          .eq("user_id", user.id)
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
          .eq("user_id", user.id)
          .maybeSingle();

        if (client?.status !== "active") {
          await supabase.auth.signOut();
          alert(
            "Akun client belum aktif. Silakan selesaikan pembayaran dan minta Admin Vistiq mengaktifkan akun. Reseller tetap dapat mengedit dan melihat preview draft dari Dashboard Reseller."
          );
          return;
        }
      }

      rememberEmail(rememberDevice ? loginEmail : null);
      if (rememberDevice && loginPassword) {
        // This only requests the browser's own secure save flow.
        void saveLogin(loginEmail, loginPassword);
      }
      router.push(roleHome[profile.role] || "/");
      router.refresh();
    } catch {
      alert("Login belum berhasil. Periksa koneksi internet dan coba lagi.");
    } finally { setLoading(false); }
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
            <form onSubmit={handleLogin} className={styles.form} autoComplete="on">
              <input
                type="email"
                name="username"
                autoComplete="username"
                aria-label="Email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  aria-label="Password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  style={{ paddingRight: 54 }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "grid", placeItems: "center", background: "transparent", border: 0, borderRadius: 8, color: "#1167b2", cursor: "pointer" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {showPassword ? <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6 0 10 7 10 7a18.6 18.6 0 0 1-4.1 4.7M6.6 6.6A19 19 0 0 0 2 12s4 7 10 7a10 10 0 0 0 5.4-1.6" /></> : <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#334155", fontSize: 14, cursor: "pointer", minHeight: 36 }}>
                  <input type="checkbox" checked={rememberDevice} onChange={(e) => {
                    setRememberDevice(e.target.checked);
                    if (!e.target.checked) rememberEmail(null);
                  }} style={{ width: 18, height: 18, accentColor: "#1167b2", flexShrink: 0 }} />
                  Simpan di perangkat ini
                </label>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                  Gunakan pada HP pribadi. Pilih Simpan jika browser menawarkan penyimpanan password agar login berikutnya lebih cepat.
                </p>
              </div>

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
