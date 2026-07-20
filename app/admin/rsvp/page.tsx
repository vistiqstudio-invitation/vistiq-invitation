"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

type Rsvp = {
  id: number;
  invitation_id?: number | null;
  name: string;
  whatsapp?: string;
  attendance: string;
  message: string;
  created_at: string;
};

export default function AdminRsvpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRsvps = async () => {
    const { data, error } = await supabase
      .from("rsvp_wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRsvps(data ?? []);
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
        .select("role")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "owner") {
        router.push("/login");
        return;
      }

      fetchRsvps();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const counts = {
    hadir: rsvps.filter((r) => r.attendance === "Hadir").length,
    tidakHadir: rsvps.filter((r) => r.attendance === "Tidak Hadir").length,
    raguRagu: rsvps.filter((r) => r.attendance === "Masih Ragu").length,
  };

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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rsvp-vistiq.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="rsvp"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>RSVP &amp; Ucapan</h1>
            <p className={styles.subtitle}>
              Semua konfirmasi kehadiran dan ucapan dari seluruh undangan.
            </p>
          </div>

          <div className={styles.actions}>
            <button onClick={fetchRsvps} className={styles.button}>
              Refresh
            </button>

            <button onClick={exportCSV} className={styles.exportButton}>
              Export CSV
            </button>
          </div>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span>Hadir</span>
            <strong>{counts.hadir}</strong>
          </div>

          <div className={styles.statCard}>
            <span>Tidak Hadir</span>
            <strong>{counts.tidakHadir}</strong>
          </div>

          <div className={styles.statCard}>
            <span>Masih Ragu</span>
            <strong>{counts.raguRagu}</strong>
          </div>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar RSVP</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : rsvps.length === 0 ? (
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

                  <p className={styles.date}>
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
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
