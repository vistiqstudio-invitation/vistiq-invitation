"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Reseller = {
  id: string;
  name: string;
  whatsapp?: string;
  commission_percent?: number;
  status?: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function ResellersPage() {
  const router = useRouter();

  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    commission_percent: 20,
    status: "active",
  });

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  const fetchResellers = async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/resellers?select=*&order=created_at.desc`,
      { headers }
    );

    const result = await res.json();
    setResellers(Array.isArray(result) ? result : []);
    setLoading(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("vistiq_user");

    if (!savedUser) {
      router.push("/admin-login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "owner") {
      router.push("/admin-login");
      return;
    }

    fetchResellers();
  }, [router]);

  const addReseller = async () => {
    if (!form.name.trim()) {
      alert("Nama reseller wajib diisi.");
      return;
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/resellers`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Gagal menambahkan reseller.");
      return;
    }

    setForm({
      name: "",
      whatsapp: "",
      commission_percent: 20,
      status: "active",
    });

    fetchResellers();
    alert("Reseller berhasil ditambahkan.");
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/resellers?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    fetchResellers();
  };

  const updateCommission = async (id: string, commission_percent: number) => {
    await fetch(`${SUPABASE_URL}/rest/v1/resellers?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ commission_percent }),
    });

    fetchResellers();
  };

  const logout = () => {
    localStorage.removeItem("vistiq_user");
    localStorage.removeItem("vistiq_admin");
    router.push("/admin-login");
  };

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <p style={styles.brandSmall}>VISTIQ</p>
          <h2 style={styles.brand}>Invitation</h2>
        </div>

        <nav style={styles.menu}>
          <button onClick={() => router.push("/admin")} style={styles.menuButton}>
            Dashboard
          </button>

          <button
            onClick={() => router.push("/admin/clients")}
            style={styles.menuButton}
          >
            Client
          </button>

          <button style={styles.menuActive}>Reseller</button>

          <button
            onClick={() => router.push("/admin/invitations")}
            style={styles.menuButton}
          >
            Undangan
          </button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>OWNER MENU</p>
            <h1 style={styles.title}>Data Reseller</h1>
            <p style={styles.subtitle}>
              Kelola reseller, status, dan persentase komisi.
            </p>
          </div>

          <button onClick={fetchResellers} style={styles.button}>
            Refresh
          </button>
        </header>

        <section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Tambah Reseller Baru</h2>

          <div style={styles.formGrid}>
            <input
              placeholder="Nama Reseller"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Nomor WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Komisi (%)"
              value={form.commission_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  commission_percent: Number(e.target.value),
                })
              }
              style={styles.input}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={styles.input}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button onClick={addReseller} style={styles.button}>
            Simpan Reseller
          </button>
        </section>

        <section style={styles.tableWrap}>
          <h2 style={styles.sectionTitle}>Daftar Reseller</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : resellers.length === 0 ? (
            <p>Belum ada reseller.</p>
          ) : (
            <div style={styles.table}>
              {resellers.map((reseller) => (
                <div key={reseller.id} style={styles.row}>
                  <div>
                    <strong>{reseller.name}</strong>
                    <p>{reseller.whatsapp || "-"}</p>
                  </div>

                  <input
                    type="number"
                    value={reseller.commission_percent || 0}
                    onChange={(e) =>
                      updateCommission(reseller.id, Number(e.target.value))
                    }
                    style={styles.smallInput}
                  />

                  <select
                    value={reseller.status || "active"}
                    onChange={(e) => updateStatus(reseller.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <p style={styles.date}>
                    {new Date(reseller.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#f6f8fb",
    color: "#0f172a",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  sidebar: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
  },
  brandSmall: {
    color: "#60a5fa",
    fontWeight: 900,
    letterSpacing: "3px",
    fontSize: "12px",
    margin: 0,
  },
  brand: {
    margin: "8px 0 0",
  },
  menu: {
    display: "grid",
    gap: "10px",
    marginTop: "40px",
  },
  menuActive: {
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "13px 16px",
    borderRadius: "14px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 700,
  },
  menuButton: {
    border: "none",
    background: "rgba(255,255,255,.08)",
    color: "#cbd5e1",
    padding: "13px 16px",
    borderRadius: "14px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 700,
  },
  logoutButton: {
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "13px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  content: {
    padding: "34px",
  },
  header: {
    maxWidth: "1180px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  label: {
    color: "#1167b2",
    fontWeight: 800,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "12px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "42px",
    margin: 0,
  },
  subtitle: {
    color: "#64748b",
  },
  button: {
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "18px",
  },
  formCard: {
    maxWidth: "1180px",
    margin: "0 auto 30px",
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },
  sectionTitle: {
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "14px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    background: "white",
    color: "#0f172a",
  },
  tableWrap: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },
  table: {
    display: "grid",
    gap: "12px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1.3fr 160px 160px 140px",
    gap: "18px",
    alignItems: "center",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "16px",
  },
  smallInput: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
  },
  statusSelect: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
  },
  date: {
    color: "#64748b",
    margin: 0,
  },
};