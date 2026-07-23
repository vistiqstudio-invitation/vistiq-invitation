"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import ChangePasswordCard from "@/components/dashboard/ChangePasswordCard";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

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

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [dashboardError, setDashboardError] = useState(false);

  const supabaseFetch = async (table: string) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setDashboardError(true);
      return [];
    }

    return data ?? [];
  };

  const fetchDashboard = async () => {
    setDashboardError(false);

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
      setDashboardError(true);
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

      if (!profile || profile.role !== "owner") {
        router.push("/login");
        return;
      }

      setUser({
        id: authUser.id,
        role: profile.role,
        name: profile.name || "Owner",
        email: authUser.email || "",
        whatsapp: profile.whatsapp,
        created_at: authUser.created_at,
      });
      fetchDashboard();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="dashboard"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER DASHBOARD</p>
            <h1 className={styles.title}>Halo, {user?.name || "Owner"}</h1>
            <p className={styles.subtitle}>
              Pantau client, reseller, undangan, RSVP, dan transaksi.
            </p>
          </div>

          <div className={styles.actions}>
            <button onClick={fetchDashboard} className={styles.button}>
              Refresh
            </button>

            <button onClick={exportCSV} className={styles.exportButton}>
              Export RSVP
            </button>
          </div>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : (
          <>
            {dashboardError && (
              <section className={styles.warningBox}>
                <h2>Sebagian data gagal dimuat.</h2>
                <p>
                  Terjadi gangguan koneksi ke server, jadi data di bawah ini
                  bisa jadi tidak lengkap. Klik tombol Refresh di atas untuk
                  mencoba lagi.
                </p>
              </section>
            )}

            <section className={styles.stats}>
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

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>RSVP Terbaru</h2>

              {rsvps.length === 0 ? (
                <p>Belum ada data RSVP.</p>
              ) : (
                <div className={styles.table}>
                  {rsvps.slice(0, 8).map((item) => (
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

            <ChangePasswordCard />
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
