"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
  whatsapp?: string;
  created_at: string;
};

type Client = {
  id: string;
  name: string;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  created_at: string;
};

type Reseller = {
  id: string;
  name: string;
  whatsapp?: string;
  commission_percent?: number;
  status?: string;
  created_at: string;
};

type Invitation = {
  id: string;
  slug: string;
  theme?: string;
  groom_name?: string;
  bride_name?: string;
  status?: string;
  created_at: string;
};

type Transaction = {
  id: string;
  amount: number;
  commission: number;
  status?: string;
  created_at: string;
};

type Rsvp = {
  id: number;
  name: string;
  whatsapp?: string;
  attendance: string;
  message: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<AppUser | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const supabaseFetch = async (table: string) => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    const result = await res.json();
    return Array.isArray(result) ? result : [];
  };

  const fetchDashboard = async () => {
    try {
      const [
        clientsData,
        resellersData,
        invitationsData,
        transactionsData,
        rsvpData,
      ] = await Promise.all([
        supabaseFetch("clients"),
        supabaseFetch("resellers"),
        supabaseFetch("invitations"),
        supabaseFetch("transactions"),
        supabaseFetch("rsvp_wishes"),
      ]);

      setClients(clientsData);
      setResellers(resellersData);
      setInvitations(invitationsData);
      setTransactions(transactionsData);
      setRsvps(rsvpData);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("vistiq_user");

    if (!savedUser) {
      router.push("/admin-login");
      return;
    }

    const parsedUser: AppUser = JSON.parse(savedUser);

    if (parsedUser.role !== "owner") {
      router.push("/admin-login");
      return;
    }

    setUser(parsedUser);
    fetchDashboard();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("vistiq_user");
    localStorage.removeItem("vistiq_admin");
    router.push("/admin-login");
  };

  const totalOmzet = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalKomisi = transactions.reduce(
    (sum, item) => sum + Number(item.commission || 0),
    0
  );

  const exportCSV = () => {
    if (rsvps.length === 0) {
      alert("Belum ada data RSVP.");
      return;
    }

    const headers = ["Nama", "WhatsApp", "Kehadiran", "Ucapan", "Tanggal"];

    const rows = rsvps.map((item) => [
      item.name,
      item.whatsapp || "-",
      item.attendance,
      item.message,
      new Date(item.created_at).toLocaleString("id-ID"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rsvp-vistiq.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const generateLink = () => {
    if (!guestName.trim()) {
      alert("Masukkan nama tamu.");
      return;
    }

    const url = `${window.location.origin}/demo?to=${encodeURIComponent(
      guestName
    )}`;

    setGeneratedLink(url);
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    alert("Link berhasil disalin.");
  };

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <p style={styles.brandSmall}>VISTIQ</p>
          <h2 style={styles.brand}>Invitation</h2>
        </div>

        <nav style={styles.menu}>
          <button style={styles.menuActive}>Dashboard</button>
          <button style={styles.menuButton}>Client</button>
          <button style={styles.menuButton}>Reseller</button>
          <button style={styles.menuButton}>Undangan</button>
          <button style={styles.menuButton}>RSVP</button>
          <button style={styles.menuButton}>Transaksi</button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>OWNER DASHBOARD</p>
            <h1 style={styles.title}>Halo, {user?.name || "Owner"}</h1>
            <p style={styles.subtitle}>
              Pantau client, reseller, undangan, RSVP, dan transaksi.
            </p>
          </div>

          <div style={styles.actions}>
            <button onClick={fetchDashboard} style={styles.button}>
              Refresh
            </button>

            <button onClick={exportCSV} style={styles.exportButton}>
              Export RSVP
            </button>
          </div>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : (
          <>
            <section style={styles.stats}>
              <StatCard title="Total Client" value={clients.length} />
              <StatCard title="Total Reseller" value={resellers.length} />
              <StatCard title="Total Undangan" value={invitations.length} />
              <StatCard title="Total RSVP" value={rsvps.length} />
              <StatCard
                title="Total Omzet"
                value={`Rp ${totalOmzet.toLocaleString("id-ID")}`}
              />
              <StatCard
                title="Total Komisi"
                value={`Rp ${totalKomisi.toLocaleString("id-ID")}`}
              />
            </section>

            <section style={styles.generatorCard}>
              <h2 style={styles.sectionTitle}>Generator Link Tamu</h2>

              <div style={styles.generatorWrap}>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Bapak Ahmad"
                  style={styles.input}
                />

                <button onClick={generateLink} style={styles.button}>
                  Generate
                </button>
              </div>

              {generatedLink && (
                <>
                  <div style={styles.linkBox}>{generatedLink}</div>

                  <button onClick={copyLink} style={styles.exportButton}>
                    Copy Link
                  </button>
                </>
              )}
            </section>

            <section style={styles.gridTwo}>
              <Panel title="Client Terbaru">
                {clients.length === 0 ? (
                  <Empty text="Belum ada client." />
                ) : (
                  clients.slice(0, 5).map((item) => (
                    <MiniItem
                      key={item.id}
                      title={item.name}
                      meta={`${item.package_name || "-"} · ${
                        item.status || "active"
                      }`}
                    />
                  ))
                )}
              </Panel>

              <Panel title="Reseller Terbaru">
                {resellers.length === 0 ? (
                  <Empty text="Belum ada reseller." />
                ) : (
                  resellers.slice(0, 5).map((item) => (
                    <MiniItem
                      key={item.id}
                      title={item.name}
                      meta={`${item.whatsapp || "-"} · Komisi ${
                        item.commission_percent || 0
                      }%`}
                    />
                  ))
                )}
              </Panel>
            </section>

            <section style={styles.tableWrap}>
              <h2 style={styles.sectionTitle}>RSVP Terbaru</h2>

              {rsvps.length === 0 ? (
                <p>Belum ada data RSVP.</p>
              ) : (
                <div style={styles.table}>
                  {rsvps.slice(0, 8).map((item) => (
                    <div style={styles.row} key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.whatsapp || "-"}</p>
                      </div>

                      <span style={styles.badge}>{item.attendance}</span>

                      <p style={styles.message}>{item.message}</p>
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

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={styles.card}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.panelList}>{children}</div>
    </section>
  );
}

function MiniItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div style={styles.miniItem}>
      <strong>{title}</strong>
      <p>{meta}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p style={styles.empty}>{text}</p>;
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

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  button: {
    border: "none",
    background: "#1167b2",
    color: "white",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },

  exportButton: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "14px",
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

  generatorCard: {
    maxWidth: "1180px",
    margin: "0 auto 30px",
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  generatorWrap: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "240px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },

  linkBox: {
    marginTop: "18px",
    padding: "14px",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#334155",
    wordBreak: "break-all",
    lineHeight: 1.6,
  },

  gridTwo: {
    maxWidth: "1180px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  panel: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  panelList: {
    display: "grid",
    gap: "12px",
  },

  miniItem: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "14px",
  },

  empty: {
    color: "#64748b",
  },

  tableWrap: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  table: {
    display: "grid",
    gap: "12px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 180px 2fr",
    gap: "20px",
    alignItems: "center",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "16px",
  },

  badge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    width: "fit-content",
  },

  message: {
    margin: 0,
    lineHeight: 1.6,
  },
};