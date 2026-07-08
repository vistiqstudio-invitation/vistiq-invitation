"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/client" },
  { key: "edit", label: "Edit Undangan", href: "/client/edit" },
];

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

export default function ClientPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const fetchData = async (currentUser: AppUser) => {
    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", currentUser.id);

    const currentClient = clientData?.[0];

    setClient(currentClient || null);

    if (!currentClient) {
      setLoading(false);
      return;
    }

    const { data: invitationsData } = await supabase
      .from("invitations")
      .select("*")
      .eq("client_id", currentClient.id)
      .order("created_at", { ascending: false });

    setInvitations(invitationsData ?? []);

    if (invitationsData && invitationsData.length > 0) {
      const invitationIds = invitationsData.map((item) => item.id);

      const { data: rsvpData } = await supabase
        .from("rsvp_wishes")
        .select("*")
        .in("invitation_id", invitationIds)
        .order("created_at", { ascending: false });

      setRsvps(rsvpData ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name, whatsapp")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "client") {
        router.push("/login");
        return;
      }

      const parsedUser: AppUser = {
        id: authUser.id,
        role: profile.role,
        name: profile.name || "Client",
        email: authUser.email || "",
        whatsapp: profile.whatsapp,
      };

      setUser(parsedUser);
      fetchData(parsedUser);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Client"
        items={NAV_ITEMS}
        activeKey="dashboard"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>CLIENT DASHBOARD</p>
            <h1 className={styles.title}>Halo, {user?.name || "Client"}</h1>
            <p className={styles.subtitle}>
              Pantau undangan, RSVP, dan generate link tamu.
            </p>
          </div>

          <button
            onClick={() => user && fetchData(user)}
            className={styles.button}
          >
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : !client ? (
          <section className={styles.warningBox}>
            <h2>Akun client belum terhubung.</h2>
            <p>
              Owner perlu menghubungkan user login ini dengan data client di
              tabel clients.
            </p>
          </section>
        ) : (
          <>
            <section className={styles.stats}>
              <StatCard title="Status Client" value={client.status || "active"} />
              <StatCard title="Paket" value={client.package_name || "-"} />
              <StatCard title="Total Undangan" value={invitations.length} />
              <StatCard title="Total RSVP" value={rsvps.length} />
            </section>

            <section className={styles.generatorCard}>
              <h2 className={styles.sectionTitle}>Generator Link Tamu</h2>

              <div className={styles.generatorWrap}>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Bapak Ahmad"
                  className={styles.input}
                />

                <button onClick={generateLink} className={styles.button}>
                  Generate
                </button>
              </div>

              {generatedLink && (
                <>
                  <div className={styles.linkBox}>{generatedLink}</div>

                  <button onClick={copyLink} className={styles.exportButton}>
                    Copy Link
                  </button>
                </>
              )}
            </section>

            <section className={styles.gridTwo}>
              <Panel title="Undangan Saya">
                {invitations.length === 0 ? (
                  <Empty text="Belum ada undangan." />
                ) : (
                  invitations.map((item) => (
                    <div key={item.id} className={styles.miniItem}>
                      <strong>
                        {item.groom_name || "-"} & {item.bride_name || "-"}
                      </strong>
                      <p>/{item.slug}</p>
                      <div className={styles.actions}>
                        <button
                          onClick={() =>
                            window.open(`/${item.slug}?to=Bapak%20Ahmad`, "_blank")
                          }
                          className={styles.miniButton}
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
                          className={styles.miniButtonGreen}
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

            <section className={styles.tableWrap}>
              <div className={styles.tableHead}>
                <h2 className={styles.sectionTitle}>RSVP Terbaru</h2>

                <button onClick={exportCSV} className={styles.exportButton}>
                  Export CSV
                </button>
              </div>

              {rsvps.length === 0 ? (
                <p>Belum ada data RSVP.</p>
              ) : (
                <div className={styles.table}>
                  {rsvps.map((item) => (
                    <div className={styles.row} key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.whatsapp || "-"}</p>
                      </div>

                      <span className={styles.badge}>{item.attendance}</span>

                      <p className={styles.message}>{item.message}</p>
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
    <div className={styles.statCard}>
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
    <section className={styles.panel}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.panelList}>{children}</div>
    </section>
  );
}

function MiniItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className={styles.miniItem}>
      <strong>{title}</strong>
      <p>{meta}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className={styles.empty}>{text}</p>;
}
