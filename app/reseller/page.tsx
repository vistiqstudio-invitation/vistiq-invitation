"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import ChangePasswordCard from "@/components/dashboard/ChangePasswordCard";
import { getResellerNavItems } from "@/components/reseller/navItems";
import styles from "@/styles/dashboard.module.css";

const WA_NUMBER = "6281371338032";

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
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller_brand";
  starting_price?: number | null;
  brand_expires_at?: string | null;
};

const LOGO_BUCKET = "invitation-assets";

const PACKAGE_LABELS: Record<string, string> = {
  reseller: "Reseller",
  reseller_brand: "Reseller Brand (White Label)",
};

export default function ResellerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [brandForm, setBrandForm] = useState({ brand_name: "", brand_color: "#d4af37", starting_price: "" });
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const fetchData = async (currentUser: AppUser) => {
    const { data: resellerData } = await supabase
      .from("resellers")
      .select("*")
      .eq("user_id", currentUser.id);

    const currentReseller = resellerData?.[0];

    setReseller(currentReseller || null);

    if (!currentReseller) {
      setLoading(false);
      return;
    }

    setBrandForm({
      brand_name: currentReseller.brand_name || "",
      brand_color: currentReseller.brand_color || "#d4af37",
      starting_price: currentReseller.starting_price != null ? String(currentReseller.starting_price) : "",
    });

    const { count } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("reseller_id", currentReseller.id);

    setClientCount(count ?? 0);
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
        .select("role, name")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "reseller") {
        router.push("/login");
        return;
      }

      const parsedUser: AppUser = {
        id: authUser.id,
        role: profile.role,
        name: profile.name || "Reseller",
        email: authUser.email || "",
      };

      setUser(parsedUser);
      fetchData(parsedUser);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const saveBrand = async () => {
    if (!reseller) return;

    setSavingBrand(true);

    const { error } = await supabase
      .from("resellers")
      .update({
        brand_name: brandForm.brand_name || null,
        brand_color: brandForm.brand_color || null,
        starting_price: brandForm.starting_price ? Number(brandForm.starting_price) : null,
      })
      .eq("id", reseller.id);

    setSavingBrand(false);

    if (error) {
      alert("Gagal menyimpan brand.");
      return;
    }

    if (user) fetchData(user);
    alert("Brand berhasil disimpan.");
  };

  const uploadLogo = async (file: File) => {
    if (!reseller) return;

    setUploadingLogo(true);

    const ext = file.name.split(".").pop();
    const fileName = `resellers/${reseller.id}/logo-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      setUploadingLogo(false);
      alert(`Upload logo gagal: ${uploadError.message}`);
      return;
    }

    const logoUrl = supabase.storage.from(LOGO_BUCKET).getPublicUrl(fileName).data.publicUrl;

    const { error: updateError } = await supabase
      .from("resellers")
      .update({ logo_url: logoUrl })
      .eq("id", reseller.id);

    setUploadingLogo(false);

    if (updateError) {
      alert("Logo terupload tapi gagal disimpan ke profil.");
      return;
    }

    if (user) fetchData(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // eslint-disable-next-line react-hooks/purity -- reading the clock to compare against a stored expiry timestamp is inherently time-dependent
  const now = Date.now();
  const isBrandPackage = reseller?.package === "reseller_brand";
  const brandExpiresAt = reseller?.brand_expires_at ? new Date(reseller.brand_expires_at) : null;
  const brandExpired = isBrandPackage && brandExpiresAt !== null && brandExpiresAt.getTime() <= now;
  const brandActive = isBrandPackage && Boolean(reseller?.brand_active) && !brandExpired;
  const brandDaysLeft = brandExpiresAt && !brandExpired
    ? Math.ceil((brandExpiresAt.getTime() - now) / 86400000)
    : null;
  const brandExpiryLabel = brandExpiresAt
    ? brandExpiresAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const brandName = brandActive && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandActive && reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  const upgradeText = encodeURIComponent(
    `Halo Vistiq Invitation, saya ${user?.name || "reseller"} (${user?.email || ""}) ingin upgrade ke paket Reseller Brand (white label, Rp59.000/bulan, layaknya member premium).`
  );

  const renewText = encodeURIComponent(
    `Halo Vistiq Invitation, saya ${user?.name || "reseller"} (${user?.email || ""}) ingin memperpanjang paket Reseller Brand saya yang ${brandExpired ? "sudah berakhir" : "akan berakhir"}${brandExpiryLabel ? ` (${brandExpiryLabel})` : ""}. Mohon info pembayarannya.`
  );

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandName ? "Reseller Brand" : "Reseller"}
        logoUrl={brandActive ? reseller?.logo_url : null}
        accentColor={brandActive ? reseller?.brand_color : null}
        items={getResellerNavItems(reseller?.package, reseller?.id)}
        activeKey="dashboard"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Halo, {user?.name || "Reseller"}</h1>
            <p className={styles.subtitle}>
              Tambah client dan pantau client milik Anda.
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
        ) : !reseller ? (
          <section className={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
            <p>Hubungkan user login ini dengan tabel resellers.</p>
          </section>
        ) : (
          <>
            {isBrandPackage && brandExpired && (
              <section className={styles.formCard} style={{ borderLeft: "4px solid #dc2626" }}>
                <h2 className={styles.sectionTitle} style={{ color: "#dc2626" }}>
                  Masa Aktif Reseller Brand Sudah Berakhir
                </h2>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
                  Langganan Reseller Brand Anda berakhir pada{" "}
                  <strong>{brandExpiryLabel}</strong>. Brand Anda (nama, logo,
                  warna) untuk sementara tidak tampil di undangan client
                  sampai diperpanjang. Hubungi admin Vistiq dan lakukan
                  pembayaran manual - setelah dikonfirmasi, admin akan
                  mengaktifkan kembali akun Anda.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${renewText}`}
                  target="_blank"
                  className={styles.button}
                >
                  Hubungi Admin untuk Perpanjang
                </a>
              </section>
            )}

            {isBrandPackage && !brandExpired && brandDaysLeft !== null && (
              <section
                className={styles.formCard}
                style={brandDaysLeft <= 7 ? { borderLeft: "4px solid #f59e0b" } : undefined}
              >
                <p style={{ margin: 0, fontSize: 13.5, color: brandDaysLeft <= 7 ? "#b45309" : "#64748b" }}>
                  Masa aktif Reseller Brand Anda hingga{" "}
                  <strong>{brandExpiryLabel}</strong>
                  {brandDaysLeft <= 7 ? ` - tinggal ${brandDaysLeft} hari lagi.` : "."}
                  {brandDaysLeft <= 7 && (
                    <>
                      {" "}
                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=${renewText}`}
                        target="_blank"
                        style={{ color: "#1167b2", fontWeight: 800 }}
                      >
                        Hubungi admin untuk perpanjang
                      </a>
                    </>
                  )}
                </p>
              </section>
            )}

            <section className={styles.stats}>
              <div className={styles.statCard}>
                <span>Total Client</span>
                <strong>{clientCount}</strong>
              </div>

              <div className={styles.statCard}>
                <span>Paket</span>
                <strong>{PACKAGE_LABELS[reseller.package || "reseller"]}</strong>
              </div>

              {!isBrandPackage && (
                <div className={styles.statCard}>
                  <span>Komisi</span>
                  <strong>{reseller.commission_percent || 0}%</strong>
                </div>
              )}

              <div className={styles.statCard}>
                <span>Status</span>
                <strong>{reseller.status || "active"}</strong>
              </div>
            </section>

            {isBrandPackage ? (
              <section className={styles.formCard}>
                <h2 className={styles.sectionTitle}>Brand Saya (White Label)</h2>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: brandActive ? "#15803d" : "#b45309" }}>
                  {brandActive
                    ? "Paket brand aktif - nama & logo di bawah tampil di undangan client Anda."
                    : brandExpired
                    ? "Masa aktif habis - lengkapi data tetap bisa disimpan, tapi brand baru tampil lagi setelah admin memperpanjang."
                    : "Paket brand belum aktif. Lengkapi data di bawah lalu hubungi admin untuk mengaktifkan paket Reseller Brand."}
                </p>

                <div className={styles.formGrid}>
                  <input
                    placeholder="Nama Brand (contoh: Elora Invitation)"
                    value={brandForm.brand_name}
                    onChange={(e) => setBrandForm({ ...brandForm, brand_name: e.target.value })}
                    className={styles.input}
                  />

                  <input
                    type="color"
                    value={brandForm.brand_color}
                    onChange={(e) => setBrandForm({ ...brandForm, brand_color: e.target.value })}
                    className={styles.input}
                    style={{ padding: 4, height: 44 }}
                  />

                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Harga Mulai Dari, contoh: 59000"
                    value={brandForm.starting_price}
                    onChange={(e) => setBrandForm({ ...brandForm, starting_price: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <p className={styles.helpText} style={{ marginTop: -8 }}>
                  Harga ini yang tampil di halaman katalog Anda (di bawah) - bebas Anda tentukan sendiri, tidak terikat harga Vistiq.
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0" }}>
                  {reseller.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reseller.logo_url}
                      alt="Logo brand"
                      style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0" }}
                    />
                  )}

                  <label className={styles.button} style={{ cursor: "pointer" }}>
                    {uploadingLogo ? "Mengunggah..." : "Upload Logo"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingLogo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadLogo(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <button onClick={saveBrand} className={styles.button} disabled={savingBrand}>
                  {savingBrand ? "Menyimpan..." : "Simpan Brand"}
                </button>
              </section>
            ) : null}

            {brandActive && (
              <section className={styles.formCard}>
                <h2 className={styles.sectionTitle}>Landing Page Anda</h2>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
                  Halaman promosi lengkap dengan nama, logo, dan harga Anda sendiri - tombol
                  Order akan chat langsung ke WhatsApp Anda, bukan ke Vistiq. Ini juga bisa
                  dibuka lewat menu "Landing Page" di samping. Bagikan link ini ke calon client Anda.
                </p>

                <div className={styles.linkBox}>
                  {typeof window !== "undefined" ? `${window.location.origin}/promo/${reseller.id}` : `/promo/${reseller.id}`}
                </div>

                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/promo/${reseller.id}`);
                    alert("Link landing page berhasil disalin.");
                  }}
                  className={styles.button}
                  style={{ marginTop: 12 }}
                >
                  Copy Link Landing Page
                </button>
              </section>
            )}

            {!isBrandPackage && (
              <section className={styles.formCard}>
                <h2 className={styles.sectionTitle}>Upgrade ke Reseller Brand</h2>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
                  Tampilkan nama, logo, dan warna brand Anda sendiri di setiap undangan
                  client (white label), dan dashboard Anda akan lengkap seperti dashboard
                  Vistiq Studio. <strong>Rp59.000/bulan</strong>, layaknya member
                  premium - dapat update tema dan konten promosi baru setiap bulan,
                  keuntungan 100% jadi milik Anda.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${upgradeText}`}
                  target="_blank"
                  className={styles.button}
                >
                  Upgrade ke Reseller Brand
                </a>
              </section>
            )}

            <ChangePasswordCard />
          </>
        )}
      </section>
    </main>
  );
}
