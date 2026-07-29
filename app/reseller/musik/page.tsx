"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import { MUSIC_LIBRARY } from "@/lib/musicLibrary";
import styles from "@/styles/dashboard.module.css";

const WA_NUMBER = "6281371338032";

type Reseller = {
  id: string;
  package?: "reseller" | "reseller_brand";
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
};

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

export default function ResellerMusikPage() {
  const router = useRouter();
  const supabase = createClient();

  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitationId, setSelectedInvitationId] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchInvitations = async (resellerId: string) => {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id")
      .eq("reseller_id", resellerId);

    const clientIds = (clientsData ?? []).map((c) => c.id);

    if (clientIds.length === 0) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    const { data: invitationsData } = await supabase
      .from("invitations")
      .select("id, slug, category, groom_name, bride_name, baby_name")
      .in("client_id", clientIds)
      .order("created_at", { ascending: false });

    setInvitations(invitationsData ?? []);
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

      if (!currentReseller || currentReseller.package !== "reseller_brand") {
        setLoading(false);
        return;
      }

      fetchInvitations(currentReseller.id);
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

  const isBrandPackage = reseller?.package === "reseller_brand";
  const brandName = isBrandPackage && reseller?.brand_active && reseller?.brand_name ? reseller.brand_name : null;
  const upgradeText = encodeURIComponent(
    "Halo Vistiq Invitation, saya ingin upgrade ke paket Reseller Brand (white label, Rp59.000/bulan) untuk akses perpustakaan musik dan fitur lainnya."
  );

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandName ? "Reseller Brand" : "Reseller"}
        logoUrl={isBrandPackage && reseller?.brand_active ? reseller?.logo_url : null}
        accentColor={isBrandPackage && reseller?.brand_active ? reseller?.brand_color : null}
        items={getResellerNavItems(reseller?.package, reseller?.id)}
        activeKey="musik"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>RESELLER BRAND MENU</p>
            <h1 className={styles.title}>Perpustakaan Musik</h1>
            <p className={styles.subtitle}>
              Musik latar berlisensi (aman hak cipta) - dengarkan, unduh, atau langsung terapkan ke undangan client Anda.
            </p>
          </div>
        </header>

        {loading ? (
          <p>Memuat...</p>
        ) : !isBrandPackage ? (
          <section className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Khusus Reseller Brand</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
              Perpustakaan musik adalah salah satu benefit member premium paket Reseller Brand -
              update tema dan konten baru setiap bulan, termasuk koleksi musik latar berlisensi ini.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${upgradeText}`}
              target="_blank"
              className={styles.button}
            >
              Upgrade ke Reseller Brand
            </a>
          </section>
        ) : (
          <>
            <section className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Terapkan ke Undangan</h2>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
                Pilih undangan client Anda, lalu klik &quot;Gunakan&quot; pada musik yang diinginkan di daftar bawah.
              </p>

              {invitations.length === 0 ? (
                <p style={{ fontSize: 13.5, color: "#64748b" }}>Belum ada undangan client.</p>
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
          </>
        )}
      </section>
    </main>
  );
}
