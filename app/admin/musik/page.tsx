"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { MUSIC_LIBRARY } from "@/lib/musicLibrary";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "affiliates", label: "Affiliate", href: "/admin/affiliates" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "musik", label: "Musik", href: "/admin/musik" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

type Invitation = {
  id: number;
  slug: string;
  category?: "wedding" | "aqiqah" | "khitan";
  groom_name?: string;
  bride_name?: string;
  baby_name?: string;
};

function invitationLabel(item: Invitation) {
  const name =
    item.category === "aqiqah" || item.category === "khitan"
      ? item.baby_name || "-"
      : `${item.groom_name || "-"} & ${item.bride_name || "-"}`;
  return `${name} (/${item.slug})`;
}

export default function AdminMusikPage() {
  const router = useRouter();
  const supabase = createClient();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitationId, setSelectedInvitationId] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    const { data } = await supabase
      .from("invitations")
      .select("id, slug, category, groom_name, bride_name, baby_name")
      .order("created_at", { ascending: false });

    setInvitations(data ?? []);
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

      fetchInvitations();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const applyTrack = async (trackUrl: string, trackId: string) => {
    if (!selectedInvitationId) {
      alert("Pilih undangan tujuan terlebih dahulu.");
      return;
    }

    setApplyingId(trackId);

    const { error } = await supabase
      .from("invitations")
      .update({ music_url: trackUrl })
      .eq("id", selectedInvitationId);

    setApplyingId(null);

    if (error) {
      alert(`Gagal menerapkan musik: ${error.message}`);
      return;
    }

    alert("Musik berhasil diterapkan ke undangan.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="musik"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Perpustakaan Musik</h1>
            <p className={styles.subtitle}>
              Musik latar berlisensi (aman hak cipta) - dengarkan, unduh, atau langsung terapkan ke undangan.
            </p>
          </div>

          <button onClick={fetchInvitations} className={styles.button}>
            Refresh
          </button>
        </header>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Terapkan ke Undangan</h2>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
            Pilih undangan tujuan, lalu klik &quot;Gunakan&quot; pada musik yang diinginkan di daftar bawah.
          </p>

          {loading ? (
            <p>Memuat daftar undangan...</p>
          ) : (
            <select
              value={selectedInvitationId}
              onChange={(e) => setSelectedInvitationId(e.target.value)}
              className={styles.input}
            >
              <option value="">-- Pilih Undangan --</option>
              {invitations.map((item) => (
                <option key={item.id} value={item.id}>
                  {invitationLabel(item)}
                </option>
              ))}
            </select>
          )}
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Musik ({MUSIC_LIBRARY.length})</h2>

          <div className={styles.table}>
            {MUSIC_LIBRARY.map((track) => (
              <div key={track.id} className={styles.resellerRow}>
                <div className={styles.resellerName}>
                  <strong>{track.title}</strong>
                  <p>{track.mood}</p>
                </div>

                <audio controls src={track.url} style={{ height: 32, flex: "0 0 260px" }} />

                <a href={track.url} download className={styles.button} style={{ fontSize: 12, padding: "8px 14px" }}>
                  Unduh
                </a>

                <button
                  onClick={() => applyTrack(track.url, track.id)}
                  disabled={applyingId === track.id}
                  className={styles.button}
                  style={{ fontSize: 12, padding: "8px 14px" }}
                >
                  {applyingId === track.id ? "Menerapkan..." : "Gunakan"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
