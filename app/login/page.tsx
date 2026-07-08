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

  return (
    <main className={styles.standalonePage}>
      <div className={styles.loginCard}>
        <p className={styles.label}>VISTIQ INVITATION</p>
        <h1 className={styles.title} style={{ fontSize: 30 }}>
          Login Dashboard
        </h1>

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
      </div>
    </main>
  );
}
