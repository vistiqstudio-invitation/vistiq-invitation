"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import styles from "@/styles/dashboard.module.css";

type Reseller = {
  id: string;
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller_brand";
};

type Rsvp = {
  id: number;
  invitation_id?: number | null;
  name: string;
  whatsapp?: string;
  attendance: string;
  message: string;
  created_at: string;
};

function RsvpContent() {
  const router = useRouter();
  const supabase = createClient();
  const clientId = useSearchParams().get("client_id");

  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasClients, setHasClients] = useState(true);

  const fetchRsvps = async (resellerId: string) => {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id")
      .eq("reseller_id", resellerId);

    const allClientIds = (clientsData ?? []).map((c) => c.id);
    const clientIds = clientId ? allClientIds.filter((id) => id === clientId) : allClientIds;
    setHasClients(clientIds.length > 0);

    if (clientIds.length === 0) {
      setRsvps([]);
      setLoading(false);
      return;
    }

    const { data: invitationsData } = await supabase
      .from("invitations")
      .select("id")
      .in("client_id", clientIds);

    const invitationIds = (invitationsData ?? []).map((i) => i.id);

    if (invitationIds.length === 0) {
      setRsvps([]);
      setLoading(false);
      return;
    }

    const { data: rsvpData } = await supabase
      .from("rsvp_wishes")
      .select("*")
      .in("invitation_id", invitationIds)
      .order("created_at", { ascending: false });

    setRsvps(rsvpData ?? []);
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

      if (!profile || profile.role !== "reseller") {
        router.push("/login");
        return;
      }

      const { data: resellerData } = await supabase
        .from("resellers")
        .select("*")
        .eq("user_id", authUser.id);

      const currentReseller = resellerData?.[0] || null;
      setReseller(currentReseller);

      if (!currentReseller) {
        setLoading(false);
        return;
      }

      fetchRsvps(currentReseller.id);
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
      ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rsvp-client-saya.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const brandActive = reseller?.package === "reseller_brand" && Boolean(reseller?.brand_active);
  const brandName = brandActive && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandActive && reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandName ? "Reseller Brand" : "Reseller"}
        logoUrl={brandActive ? reseller?.logo_url : null}
        accentColor={brandActive ? reseller?.brand_color : null}
        items={getResellerNavItems(reseller?.package, reseller?.id)}
        activeKey="rsvp"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>RSVP &amp; Ucapan</h1>
            <p className={styles.subtitle}>
              {clientId
                ? "Konfirmasi kehadiran dan ucapan untuk client ini."
                : "Konfirmasi kehadiran dan ucapan dari undangan client Anda."}
            </p>
            {clientId && (
              <Link href="/reseller/clients" style={{ fontSize: 12.5, color: "#1167b2", fontWeight: 700 }}>
                ← Kembali ke Daftar Client
              </Link>
            )}
          </div>

          <div className={styles.actions}>
            <button onClick={() => reseller && fetchRsvps(reseller.id)} className={styles.button}>
              Refresh
            </button>

            <button onClick={exportCSV} className={styles.exportButton}>
              Export CSV
            </button>
          </div>
        </header>

        {loading ? (
          <p>Memuat data...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
          </section>
        ) : !hasClients ? (
          <section className={styles.warningBox}>
            <h2>Belum ada client.</h2>
            <p>RSVP akan muncul di sini setelah client Anda punya undangan aktif.</p>
          </section>
        ) : (
          <>
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

                      <p className={styles.date}>
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
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

export default function ResellerRsvpPage() {
  return (
    <Suspense fallback={<main className={styles.page}>Memuat...</main>}>
      <RsvpContent />
    </Suspense>
  );
}
