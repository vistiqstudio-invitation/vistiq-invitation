"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
  password?: string;
  whatsapp?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: AppUser["role"]) => {
    if (role === "owner") router.push("/admin");
    if (role === "reseller") router.push("/reseller");
    if (role === "client") router.push("/client");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("vistiq_user");

    if (!savedUser) return;

    try {
      const parsedUser: AppUser = JSON.parse(savedUser);

      if (parsedUser?.role) {
        redirectByRole(parsedUser.role);
      }
    } catch {
      localStorage.removeItem("vistiq_user");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/app_users?email=eq.${encodeURIComponent(
          email.trim()
        )}&password=eq.${encodeURIComponent(password.trim())}&select=*`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!res.ok) {
        alert("Gagal menghubungkan ke database.");
        setLoading(false);
        return;
      }

      const users: AppUser[] = await res.json();

      if (!Array.isArray(users) || users.length === 0) {
        alert("Email atau password salah.");
        setLoading(false);
        return;
      }

      const user = users[0];

      const safeUser = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp || "",
      };

      localStorage.setItem("vistiq_user", JSON.stringify(safeUser));

      redirectByRole(user.role);
    } catch {
      alert("Terjadi kesalahan saat login.");
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <p style={styles.label}>VISTIQ INVITATION</p>
        <h1 style={styles.title}>Login Dashboard</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f6f8fb",
    padding: "24px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,.08)",
  },

  label: {
    color: "#1167b2",
    fontWeight: 800,
    letterSpacing: "2px",
    fontSize: "12px",
    margin: "0 0 10px",
  },

  title: {
    color: "#0f172a",
    margin: "0 0 24px",
    fontSize: "30px",
  },

  form: {
    display: "grid",
    gap: "14px",
  },

  input: {
    color: "#0f172a",
    background: "#ffffff",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    border: "none",
    background: "#1167b2",
    color: "#ffffff",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
  },
};