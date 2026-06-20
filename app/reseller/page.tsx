"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
};

type Reseller = {
  id: string;
  user_id?: string;
  name: string;
  commission_percent?: number;
  status?: string;
};

type Client = {
  id: string;
  reseller_id?: string;
  name: string;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function ResellerPage() {
  const router = useRouter();

  const [user, setUser] = useState<AppUser | null>(null);
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    package_name: "Luxury Gold",
    status: "active",
  });

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  const fetchData = async (currentUser: AppUser) => {
    const resellerRes = await fetch(
      `${SUPABASE_URL}/rest/v1/resellers?user_id=eq.${currentUser.id}&select=*`,
      { headers }
    );

    const resellerData = await resellerRes.json();
    const currentReseller = resellerData?.[0];

    setReseller(currentReseller || null);

    if (!currentReseller) {
      setLoading(false);
      return;
    }

    const clientsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?reseller_id=eq.${currentReseller.id}&select=*&order=created_at.desc`,
      { headers }
    );

    const clientsData = await clientsRes.json();

    setClients(Array.isArray(clientsData) ? clientsData : []);
    setLoading(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("vistiq_user");

    if (!savedUser) {
      router.push("/admin-login");
      return;
    }

    const parsedUser: AppUser = JSON.parse(savedUser);

    if (parsedUser.role !== "reseller") {
      router.push("/admin-login");
      return;
    }

    setUser(parsedUser);
    fetchData(parsedUser);
  }, [router]);

  const addClient = async () => {
    if (!reseller) {
      alert("Akun reseller belum terhubung.");
      return;
    }

    if (!form.name.trim()) {
      alert("Nama client wajib diisi.");
      return;
    }

    const payload = {
      reseller_id: reseller.id,
      name: form.name,
      whatsapp: form.whatsapp,
      package_name: form.package_name,
      status: form.status,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Gagal menambahkan client.");
      return;
    }

    setForm({
      name: "",
      whatsapp: "",
      package_name: "Luxury Gold",
      status: "active",
    });

    if (user) fetchData(user);

    alert("Client berhasil ditambahkan.");
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
          <h2 style={styles.brand}>Reseller</h2>
        </div>

        <nav style={styles.menu}>
          <button style={styles.menuActive}>Dashboard</button>
          <button style={styles.menuButton}>Client Saya</button>
          <button style={styles.menuButton}>Undangan Saya</button>
          <button style={styles.menuButton}>Komisi</button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>RESELLER DASHBOARD</p>
            <h1 style={styles.title}>Halo, {user?.name || "Reseller"}</h1>
            <p style={styles.subtitle}>
              Tambah client dan pantau client milik Anda.
            </p>
          </div>

          <button onClick={() => user && fetchData(user)} style={styles.button}>
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : !reseller ? (
          <section style={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
            <p>Hubungkan user login ini dengan tabel resellers.</p>
          </section>
        ) : (
          <>
            <section style={styles.stats}>
              <div style={styles.card}>
                <span>Total Client</span>
                <strong>{clients.length}</strong>
              </div>

              <div style={styles.card}>
                <span>Komisi</span>
                <strong>{reseller.commission_percent || 0}%</strong>
              </div>

              <div style={styles.card}>
                <span>Status</span>
                <strong>{reseller.status || "active"}</strong>
              </div>
            </section>

            <section style={styles.formCard}>
              <h2 style={styles.sectionTitle}>Tambah Client Baru</h2>

              <div style={styles.formGrid}>
                <input
                  placeholder="Nama Client / Nama Pasangan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                />

                <input
                  placeholder="Nomor WhatsApp"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value })
                  }
                  style={styles.input}
                />

                <select
                  value={form.package_name}
                  onChange={(e) =>
                    setForm({ ...form, package_name: e.target.value })
                  }
                  style={styles.input}
                >
                  <option>Luxury Gold</option>
                  <option>Luxury White</option>
                  <option>Royal Black</option>
                  <option>Islamic Emerald</option>
                  <option>Floral Garden</option>
                </select>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  style={styles.input}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button onClick={addClient} style={styles.button}>
                Simpan Client
              </button>
            </section>

            <section style={styles.tableWrap}>
              <h2 style={styles.sectionTitle}>Client Saya</h2>

              {clients.length === 0 ? (
                <p>Belum ada client.</p>
              ) : (
                <div style={styles.table}>
                  {clients.map((client) => (
                    <div key={client.id} style={styles.row}>
                      <div>
                        <strong>{client.name}</strong>
                        <p>{client.whatsapp || "-"}</p>
                      </div>

                      <span style={styles.badge}>
                        {client.package_name || "-"}
                      </span>

                      <span style={styles.status}>{client.status}</span>

                      <p style={styles.date}>
                        {new Date(client.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
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
    fontWeight: 700,
  },

  menuButton: {
    border: "none",
    background: "rgba(255,255,255,.08)",
    color: "#cbd5e1",
    padding: "13px 16px",
    borderRadius: "14px",
    textAlign: "left",
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
  },

  label: {
    color: "#1167b2",
    fontWeight: 800,
    letterSpacing: "2px",
    fontSize: "12px",
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

  stats: {
    maxWidth: "1180px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "16px",
  },

  card: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
    display: "grid",
    gap: "10px",
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
    gridTemplateColumns: "1.4fr 180px 140px 140px",
    gap: "18px",
    alignItems: "center",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "16px",
  },

  badge: {
    background: "#e0f2fe",
    color: "#075985",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    width: "fit-content",
  },

  status: {
    color: "#16a34a",
    fontWeight: 700,
  },

  date: {
    color: "#64748b",
    margin: 0,
  },

  warningBox: {
    maxWidth: "700px",
    margin: "80px auto",
    background: "white",
    padding: "28px",
    borderRadius: "20px",
  },
};