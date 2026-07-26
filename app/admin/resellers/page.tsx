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

type Reseller = {
  id: string;
  user_id: string;
  name: string;
  whatsapp?: string;
  commission_percent?: number;
  status?: string;
  created_at: string;
  brand_name?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller_brand";
  brand_expires_at?: string | null;
};

type CreatedCredentials = {
  email: string;
  password: string;
  name?: string;
  whatsapp?: string;
  package?: "reseller" | "reseller_brand";
};

const PACKAGE_LABELS: Record<string, string> = {
  reseller: "Reseller (30%)",
  reseller_brand: "Reseller Brand - White Label (100%)",
};

function brandExpiryStatus(reseller: Reseller): { label: string; color: string } {
  if (!reseller.brand_expires_at) {
    return { label: "Lifetime", color: "#15803d" };
  }

  const expires = new Date(reseller.brand_expires_at);
  const dateLabel = expires.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return expires.getTime() <= Date.now()
    ? { label: `Habis ${dateLabel}`, color: "#dc2626" }
    : { label: `Aktif s/d ${dateLabel}`, color: "#b45309" };
}

const PACKAGE_DEFAULT_COMMISSION: Record<string, number> = {
  reseller: 30,
  reseller_brand: 100,
};

export default function ResellersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    package: "reseller",
    commission_percent: 30,
    status: "active",
  });

  const [creating, setCreating] = useState(false);
  const [credentials, setCredentials] = useState<CreatedCredentials | null>(null);
  const [messageCopied, setMessageCopied] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getWelcomeMessage = (account: CreatedCredentials) => {
    const isBrand = account.package === "reseller_brand";
    const brandInstructions = isBrand
      ? `

Setelah login, silakan buka menu *Brand Saya* untuk:
✅ Memasukkan nama brand
✅ Mengunggah logo
✅ Memilih warna branding
✅ Menambahkan data kontak bisnis`
      : "";

    return `Halo Kak *${account.name}* 👋

Selamat! Akun *${isBrand ? "Reseller Brand" : "Reseller"}* Kakak sudah berhasil dibuat dan aktif. 🎉

Berikut akses login Kakak:

🌐 Login: https://www.vistiqinvitation.com/login
📧 Email: *${account.email}*
🔐 Password sementara: *${account.password}*${brandInstructions}

Demi keamanan, segera ganti password melalui menu pengaturan akun dan jangan membagikan data login kepada orang lain.

Jika mengalami kendala, silakan hubungi Admin Vistiq Invitation.

Terima kasih dan selamat mengembangkan bisnis undangan digital bersama kami! 🚀`;
  };

  const copyWelcomeMessage = async () => {
    if (!credentials?.name) return;

    try {
      await navigator.clipboard.writeText(getWelcomeMessage(credentials));
      setMessageCopied(true);
      window.setTimeout(() => setMessageCopied(false), 2000);
    } catch {
      alert("Pesan gagal disalin. Silakan salin secara manual.");
    }
  };

  const openWhatsApp = () => {
    if (!credentials?.name) return;

    const phone = (credentials.whatsapp || "")
      .replace(/\D/g, "")
      .replace(/^0/, "62");

    if (!phone) {
      alert("Nomor WhatsApp pelanggan belum diisi.");
      return;
    }

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(getWelcomeMessage(credentials))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const fetchResellers = async () => {
    const { data, error } = await supabase
      .from("resellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setResellers(data ?? []);
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

      fetchResellers();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const addReseller = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nama dan email reseller wajib diisi.");
      return;
    }

    setCreating(true);

    const res = await fetch("/api/admin/create-reseller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    setCreating(false);

    if (!res.ok) {
      alert(result.error || "Gagal menambahkan reseller.");
      return;
    }

    setCredentials({
      name: form.name.trim(),
      email: result.email,
      password: result.password,
      whatsapp: form.whatsapp.trim(),
      package: form.package === "reseller_brand" ? "reseller_brand" : "reseller",
    });
    setMessageCopied(false);

    setForm({
      name: "",
      email: "",
      whatsapp: "",
      package: "reseller",
      commission_percent: 30,
      status: "active",
    });

    fetchResellers();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("resellers").update({ status }).eq("id", id);

    if (error) {
      alert(`Gagal mengubah status reseller: ${error.message}`);
      return;
    }

    fetchResellers();
  };

  const updateCommission = async (id: string, commission_percent: number) => {
    const { error } = await supabase
      .from("resellers")
      .update({ commission_percent })
      .eq("id", id);

    if (error) {
      alert(`Gagal mengubah komisi: ${error.message}`);
      return;
    }

    fetchResellers();
  };

  const updatePackage = async (id: string, pkg: string) => {
    const { error } = await supabase
      .from("resellers")
      .update({
        package: pkg,
        commission_percent: PACKAGE_DEFAULT_COMMISSION[pkg],
      })
      .eq("id", id);

    if (error) {
      alert(`Gagal mengubah paket: ${error.message}`);
      return;
    }

    fetchResellers();
  };

  const resetPassword = async (reseller: Reseller) => {
    if (!confirm("Buat password baru untuk reseller ini? Password lama akan langsung tidak berlaku.")) return;

    setResettingId(reseller.user_id);
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: reseller.user_id }),
    });
    const result = await res.json();
    setResettingId(null);

    if (!res.ok) {
      alert(result.error || "Gagal mengubah password.");
      return;
    }

    setCredentials({
      name: reseller.name,
      email: result.email,
      password: result.password,
      whatsapp: reseller.whatsapp || "",
      package: reseller.package === "reseller_brand" ? "reseller_brand" : "reseller",
    });
    setMessageCopied(false);
  };

  const deleteReseller = async (id: string, name: string) => {
    if (!confirm(`Hapus akun reseller "${name}" secara permanen? Login-nya akan langsung tidak bisa dipakai lagi. Tindakan ini tidak bisa dibatalkan.`)) return;

    setDeletingId(id);
    const res = await fetch("/api/admin/delete-reseller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resellerId: id }),
    });
    const result = await res.json();
    setDeletingId(null);

    if (!res.ok) {
      alert(result.error || "Gagal menghapus reseller.");
      return;
    }

    fetchResellers();
  };

  const toggleBrandActive = async (id: string, brand_active: boolean) => {
    const { error } = await supabase
      .from("resellers")
      .update({ brand_active })
      .eq("id", id);

    if (error) {
      alert("Gagal mengubah status paket brand.");
      return;
    }

    fetchResellers();
  };

  const extendBrandExpiry = async (reseller: Reseller, months: number) => {
    if (!confirm(`Perpanjang masa aktif brand "${reseller.name}" selama ${months} bulan? Pastikan pembayaran manual sudah dikonfirmasi.`)) return;

    const currentExpiry = reseller.brand_expires_at ? new Date(reseller.brand_expires_at) : null;
    const base = currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : new Date();
    const nextExpiry = new Date(base);
    nextExpiry.setMonth(nextExpiry.getMonth() + months);

    const { error } = await supabase
      .from("resellers")
      .update({ brand_expires_at: nextExpiry.toISOString(), brand_active: true })
      .eq("id", reseller.id);

    if (error) {
      alert(`Gagal memperpanjang masa aktif: ${error.message}`);
      return;
    }

    fetchResellers();
  };

  const setBrandLifetime = async (id: string, name: string) => {
    if (!confirm(`Jadikan brand "${name}" lifetime (tanpa masa aktif)?`)) return;

    const { error } = await supabase
      .from("resellers")
      .update({ brand_expires_at: null })
      .eq("id", id);

    if (error) {
      alert(`Gagal mengubah ke lifetime: ${error.message}`);
      return;
    }

    fetchResellers();
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
        activeKey="resellers"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Data Reseller</h1>
            <p className={styles.subtitle}>
              Kelola reseller, status, dan persentase komisi.
            </p>
          </div>

          <button onClick={fetchResellers} className={styles.button}>
            Refresh
          </button>
        </header>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Tambah Reseller Baru</h2>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
            Akun login (email + password) dibuat otomatis begitu disimpan.
          </p>

          {credentials && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                fontSize: 13.5,
              }}
            >
              <strong style={{ display: "block", marginBottom: 6, color: "#15803d" }}>
                {credentials.name
                  ? "Akun berhasil dibuat — kirim akses login kepada pelanggan:"
                  : "Password siap — catat/kirim sekarang, tidak akan ditampilkan lagi:"}
              </strong>
              <p style={{ margin: 0 }}>Email: <code>{credentials.email}</code></p>
              <p style={{ margin: "4px 0 12px" }}>Password: <code>{credentials.password}</code></p>

              {credentials.name && (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #dcfce7",
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 12,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    color: "#334155",
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                >
                  {getWelcomeMessage(credentials)}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {credentials.name && (
                  <>
                    <button
                      type="button"
                      onClick={copyWelcomeMessage}
                      className={styles.button}
                      style={{ padding: "8px 14px", fontSize: 12.5 }}
                    >
                      {messageCopied ? "Pesan Tersalin ✓" : "Salin Pesan"}
                    </button>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className={styles.button}
                      style={{
                        padding: "8px 14px",
                        fontSize: 12.5,
                        background: "#16a34a",
                      }}
                    >
                      Kirim ke WhatsApp
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setCredentials(null)}
                  className={styles.button}
                  style={{
                    padding: "8px 14px",
                    fontSize: 12.5,
                    background: "#64748b",
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          <div className={styles.formGrid}>
            <input
              placeholder="Nama Reseller"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={styles.input}
            />

            <input
              type="email"
              placeholder="Email Login"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={styles.input}
            />

            <input
              placeholder="Nomor WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className={styles.input}
            />

            <select
              value={form.package}
              onChange={(e) =>
                setForm({
                  ...form,
                  package: e.target.value,
                  commission_percent: PACKAGE_DEFAULT_COMMISSION[e.target.value] ?? form.commission_percent,
                })
              }
              className={styles.input}
            >
              <option value="reseller">Reseller (Rp 149.000 sekali bayar, komisi 30%)</option>
              <option value="reseller_brand">Reseller Brand - White Label (Rp 99.000/bulan, 100%)</option>
            </select>

            <input
              type="number"
              placeholder="Komisi (%)"
              value={form.commission_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  commission_percent: Number(e.target.value),
                })
              }
              className={styles.input}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button onClick={addReseller} className={styles.button} disabled={creating}>
            {creating ? "Membuat akun..." : "Simpan Reseller"}
          </button>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Reseller</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : resellers.length === 0 ? (
            <p>Belum ada reseller.</p>
          ) : (
            <div className={styles.table}>
              {resellers.map((reseller) => (
                <div key={reseller.id} className={styles.resellerRow}>
                  <div className={styles.resellerName}>
                    <strong>{reseller.name}</strong>
                    <p>{reseller.whatsapp || "-"}</p>
                  </div>

                  <select
                    value={reseller.package || "reseller"}
                    onChange={(e) => updatePackage(reseller.id, e.target.value)}
                    className={`${styles.statusSelect} ${styles.resellerPackage}`}
                    style={{ fontSize: 12.5 }}
                  >
                    <option value="reseller">{PACKAGE_LABELS.reseller}</option>
                    <option value="reseller_brand">{PACKAGE_LABELS.reseller_brand}</option>
                  </select>

                  <input
                    type="number"
                    value={reseller.commission_percent || 0}
                    onChange={(e) =>
                      updateCommission(reseller.id, Number(e.target.value))
                    }
                    className={`${styles.smallInput} ${styles.resellerCommission}`}
                  />

                  <label className={styles.resellerBrand}>
                    <input
                      type="checkbox"
                      checked={Boolean(reseller.brand_active)}
                      onChange={(e) => toggleBrandActive(reseller.id, e.target.checked)}
                    />
                    Brand {reseller.brand_name ? `(${reseller.brand_name})` : ""}
                  </label>

                  {reseller.package === "reseller_brand" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "0 0 auto" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: brandExpiryStatus(reseller).color }}>
                        {brandExpiryStatus(reseller).label}
                      </span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => extendBrandExpiry(reseller, 1)}
                          className={styles.button}
                          style={{ fontSize: 10, padding: "4px 8px" }}
                        >
                          +1 Bulan
                        </button>
                        {reseller.brand_expires_at && (
                          <button
                            type="button"
                            onClick={() => setBrandLifetime(reseller.id, reseller.name)}
                            className={styles.button}
                            style={{ fontSize: 10, padding: "4px 8px", background: "#64748b" }}
                          >
                            Jadikan Lifetime
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <select
                    value={reseller.status || "active"}
                    onChange={(e) => updateStatus(reseller.id, e.target.value)}
                    className={`${styles.statusSelect} ${styles.resellerStatus}`}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <p className={styles.resellerDate}>
                    {new Date(reseller.created_at).toLocaleDateString("id-ID")}
                  </p>

                  <div className={styles.resellerActions}>
                    <button
                      onClick={() => resetPassword(reseller)}
                      disabled={resettingId === reseller.user_id}
                      className={styles.button}
                      style={{ fontSize: 11, padding: "6px 10px" }}
                    >
                      {resettingId === reseller.user_id ? "Membuat..." : "Reset Password"}
                    </button>

                    <button
                      onClick={() => deleteReseller(reseller.id, reseller.name)}
                      disabled={deletingId === reseller.id}
                      className={styles.dangerButton}
                      style={{ fontSize: 11, padding: "6px 10px" }}
                    >
                      {deletingId === reseller.id ? "Menghapus..." : "Hapus"}
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
