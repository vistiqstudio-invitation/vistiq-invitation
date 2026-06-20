"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Invitation = {
  id: string;
  slug: string;
  theme?: string;
  groom_name?: string;
  bride_name?: string;
  event_date?: string;
  akad_location?: string;
  reception_location?: string;
  maps_url?: string;
  status?: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function InvitationsPage() {
  const router = useRouter();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    slug: "",
    theme: "luxury-gold",
    groom_name: "",
    bride_name: "",
    event_date: "",
    akad_location: "",
    reception_location: "",
    maps_url: "",
    status: "active",
  });

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  const fetchInvitations = async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/invitations?select=*&order=created_at.desc`,
      { headers }
    );

    const result = await res.json();

    setInvitations(Array.isArray(result) ? result : []);
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

    fetchInvitations();
  }, [router]);

  const makeSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const autoSlug = () => {
    const text = `${form.groom_name}-${form.bride_name}`;
    setForm({
      ...form,
      slug: makeSlug(text),
    });
  };

  const addInvitation = async () => {
    if (!form.groom_name.trim() || !form.bride_name.trim()) {
      alert("Nama mempelai pria dan wanita wajib diisi.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug wajib diisi.");
      return;
    }

    const payload = {
      ...form,
      event_date: form.event_date || null,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/invitations`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Gagal membuat undangan. Pastikan slug belum pernah dipakai.");
      return;
    }

    setForm({
      slug: "",
      theme: "luxury-gold",
      groom_name: "",
      bride_name: "",
      event_date: "",
      akad_location: "",
      reception_location: "",
      maps_url: "",
      status: "active",
    });

    fetchInvitations();
    alert("Undangan berhasil dibuat.");
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/invitations?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    fetchInvitations();
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    alert("Link undangan berhasil disalin.");
  };

  const openPreview = (slug: string) => {
    window.open(`/${slug}?to=Bapak%20Ahmad`, "_blank");
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

          <button
            onClick={() => router.push("/admin/resellers")}
            style={styles.menuButton}
          >
            Reseller
          </button>

          <button style={styles.menuActive}>Undangan</button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>OWNER MENU</p>
            <h1 style={styles.title}>Data Undangan</h1>
            <p style={styles.subtitle}>
              Kelola undangan digital client dan generate link undangan.
            </p>
          </div>

          <button onClick={fetchInvitations} style={styles.button}>
            Refresh
          </button>
        </header>

        <section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Tambah Undangan Baru</h2>

          <div style={styles.formGrid}>
            <input
              placeholder="Nama Mempelai Pria"
              value={form.groom_name}
              onChange={(e) =>
                setForm({ ...form, groom_name: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Nama Mempelai Wanita"
              value={form.bride_name}
              onChange={(e) =>
                setForm({ ...form, bride_name: e.target.value })
              }
              style={styles.input}
            />

            <div style={styles.slugRow}>
              <input
                placeholder="Slug, contoh: rizky-nabila"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                style={styles.input}
              />

              <button onClick={autoSlug} style={styles.smallButton}>
                Auto
              </button>
            </div>

            <select
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              style={styles.input}
            >
              <option value="luxury-gold">Luxury Gold</option>
              <option value="luxury-white">Luxury White</option>
              <option value="royal-black">Royal Black</option>
              <option value="islamic-emerald">Islamic Emerald</option>
              <option value="floral-garden">Floral Garden</option>
            </select>

            <input
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm({ ...form, event_date: e.target.value })
              }
              style={styles.input}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={styles.input}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>

            <input
              placeholder="Lokasi Akad"
              value={form.akad_location}
              onChange={(e) =>
                setForm({ ...form, akad_location: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Lokasi Resepsi"
              value={form.reception_location}
              onChange={(e) =>
                setForm({ ...form, reception_location: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Google Maps URL"
              value={form.maps_url}
              onChange={(e) => setForm({ ...form, maps_url: e.target.value })}
              style={{
                ...styles.input,
                gridColumn: "1 / -1",
              }}
            />
          </div>

          <button onClick={addInvitation} style={styles.button}>
            Simpan Undangan
          </button>
        </section>

        <section style={styles.tableWrap}>
          <h2 style={styles.sectionTitle}>Daftar Undangan</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : invitations.length === 0 ? (
            <p>Belum ada undangan.</p>
          ) : (
            <div style={styles.table}>
              {invitations.map((item) => (
                <div key={item.id} style={styles.row}>
                  <div>
                    <strong>
                      {item.groom_name || "-"} & {item.bride_name || "-"}
                    </strong>
                    <p>/{item.slug}</p>
                  </div>

                  <span style={styles.packageBadge}>{item.theme}</span>

                  <select
                    value={item.status || "active"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div style={styles.actions}>
                    <button
                      onClick={() => openPreview(item.slug)}
                      style={styles.miniButton}
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => copyLink(item.slug)}
                      style={styles.miniButtonGreen}
                    >
                      Copy
                    </button>
                  </div>
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

  smallButton: {
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
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

  slugRow: {
    display: "grid",
    gridTemplateColumns: "1fr 80px",
    gap: "10px",
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
    gridTemplateColumns: "1.3fr 180px 160px 220px",
    gap: "18px",
    alignItems: "center",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "16px",
  },

  packageBadge: {
    background: "#e0f2fe",
    color: "#075985",
    padding: "8px 14px",
    borderRadius: "999px",
    width: "fit-content",
    fontWeight: 700,
    fontSize: "13px",
  },

  statusSelect: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
  },

  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  miniButton: {
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },

  miniButtonGreen: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};