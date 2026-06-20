"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
  whatsapp?: string;
};

type Client = {
  id: string;
  user_id?: string;
  reseller_id?: string;
  name: string;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  created_at: string;
};

type Invitation = {
  id: string;
  client_id?: string;
  slug: string;
  theme?: string;
  groom_name?: string;
  bride_name?: string;
  status?: string;
  created_at: string;
};

type Rsvp = {
  id: number;
  invitation_id?: string;
  name: string;
  whatsapp?: string;
  attendance: string;
  message: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function ClientPage() {
  const router = useRouter();

  const [user, setUser] = useState<AppUser | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  const fetchData = async (currentUser: AppUser) => {
    try {
      const clientRes = await fetch(
        `${SUPABASE_URL}/rest/v1/clients?user_id=eq.${currentUser.id}&select=*`,
        { headers }
      );

      const clientData: Client[] = await clientRes.json();
      const currentClient = clientData[0];

      setClient(currentClient || null);

      if (!currentClient) {
        setLoading(false);
        return;
      }

      const invitationsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/invitations?client_id=eq.${currentClient.id}&select=*&order=created_at.desc`,
        { headers }
      );

      const invitationsData: Invitation[] = await invitationsRes.json();
      setInvitations(Array.isArray(invitationsData) ? invitationsData : []);

      if (Array.isArray(invitationsData) && invitationsData.length > 0) {
        const invitationIds = invitationsData.map((item) => item.id).join(",");

        const rsvpRes = await fetch(
          `${SUPABASE_URL}/rest/v1/rsvp_wishes?invitation_id=in.(${invitationIds})&select=*&order=created_at.desc`,
          { headers }
        );

        const rsvpData: Rsvp[] = await rsvpRes.json();
        setRsvps(Array.isArray(rsvpData) ? rsvpData : []);
      }
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

    if (parsedUser.role !== "client") {
      router.push("/admin-login");
      return;
    }

    setUser(parsedUser);
    fetchData(parsedUser);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("vistiq_user");
    localStorage.removeItem("vistiq_admin");
    router.push("/admin-login");
  };

  const generateLink = () => {
    if (!guestName.trim()) {
      alert("Masukkan nama tamu.");
      return;
    }

    const firstInvitation = invitations[0];

    if (!firstInvitation) {
      alert("Belum ada undangan untuk akun client ini.");
      return;
    }

    const url = `${window.location.origin}/${firstInvitation.slug}?to=${encodeURIComponent(
      guestName
    )}`;

    setGeneratedLink(url);
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    alert("Link berhasil disalin.");
  };

  const exportCSV = () => {
    if (rsvps.length === 0) {
      alert("Belum ada data RSVP.");
      return;
    }

    const headersCsv = ["Nama", "WhatsApp", "Kehadiran", "Ucapan", "Tanggal"];

    const rows = rsvps.map((item) => [
      item.name,
      item.whatsapp || "-",
      item.attendance,
      item.message,
      new Date(item.created_at).toLocaleString("id-ID"),
    ]);

    const csvContent = [
      headersCsv.join(","),
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
    link.download = "rsvp-client.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <p style={styles.brandSmall}>VISTIQ</p>
          <h2 style={styles.brand}>Client</h2>
        </div>

        <nav style={styles.menu}>
          <button style={styles.menuActive}>Dashboard</button>
          <button style={styles.menuButton}>Undangan Saya</button>
          <button style={styles.menuButton}>RSVP</button>
          <button style={styles.menuButton}>Pengaturan</button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>CLIENT DASHBOARD</p>
            <h1 style={styles.title}>Halo, {user?.name || "Client"}</h1>
            <p style={styles.subtitle}>
              Pantau undangan, RSVP, dan generate link tamu.
            </p>
          </div>

          <button onClick={() => user && fetchData(user)} style={styles.button}>
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : !client ? (
          <section style={styles.warningBox}>
            <h2>Akun client belum terhubung.</h2>
            <p>
              Owner perlu menghubungkan user login ini dengan data client di
              tabel clients.
            </p>
          </section>
        ) : (
          <>
            <section style={styles.stats}>
              <StatCard title="Status Client" value={client.status || "active"} />
              <StatCard title="Paket" value={client.package_name || "-"} />
              <StatCard title="Total Undangan" value={invitations.length} />
              <StatCard title="Total RSVP" value={rsvps.length} />
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
              <Panel title="Undangan Saya">
                {invitations.length === 0 ? (
                  <Empty text="Belum ada undangan." />
                ) : (
                  invitations.map((item) => (
                    <div key={item.id} style={styles.miniItem}>
                      <strong>
                        {item.groom_name || "-"} & {item.bride_name || "-"}
                      </strong>
                      <p>/{item.slug}</p>
                      <div style={styles.actions}>
                        <button
                          onClick={() =>
                            window.open(`/${item.slug}?to=Bapak%20Ahmad`, "_blank")
                          }
                          style={styles.miniButton}
                        >
                          Preview
                        </button>

                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              `${window.location.origin}/${item.slug}`
                            );
                            alert("Link undangan berhasil disalin.");
                          }}
                          style={styles.miniButtonGreen}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </Panel>

              <Panel title="Info Client">
                <MiniItem title={client.name} meta={client.whatsapp || "-"} />
                <MiniItem
                  title="Paket"
                  meta={client.package_name || "Luxury Gold"}
                />
                <MiniItem title="Status" meta={client.status || "active"} />
              </Panel>
            </section>

            <section style={styles.tableWrap}>
              <div style={styles.tableHead}>
                <h2 style={styles.sectionTitle}>RSVP Terbaru</h2>

                <button onClick={exportCSV} style={styles.exportButton}>
                  Export CSV
                </button>
              </div>

              {rsvps.length === 0 ? (
                <p>Belum ada data RSVP.</p>
              ) : (
                <div style={styles.table}>
                  {rsvps.map((item) => (
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
  },

  exportButton: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "10px",
  },

  stats: {
    maxWidth: "1180px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
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

  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
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

  tableWrap: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  tableHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
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

  empty: {
    color: "#64748b",
  },

  warningBox: {
    maxWidth: "700px",
    margin: "80px auto",
    background: "white",
    padding: "28px",
    borderRadius: "20px",
  },
};