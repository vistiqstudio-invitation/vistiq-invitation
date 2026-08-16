"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList } from "@/lib/theme";
import styles from "@/styles/dashboard.module.css";

function toWaNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

function categoryForPackageName(packageName: string) {
  if (aqiqahThemeList.some((theme) => theme.label === packageName)) return "aqiqah";
  if (khitanThemeList.some((theme) => theme.label === packageName)) return "khitan";
  if (birthdayThemeList.some((theme) => theme.label === packageName)) return "birthday";
  return "wedding";
}

const DATA_CHECKLIST: Record<string, string> = {
  wedding:
    "- Nama lengkap mempelai pria & wanita (+ nama orang tua masing-masing)\n- Instagram mempelai (opsional)\n- Tanggal, jam & lokasi Akad\n- Tanggal, jam & lokasi Resepsi (+ link Google Maps)\n- Foto cover & foto mempelai (pria/wanita)\n- Galeri foto\n- Nomor rekening mempelai pria & wanita (untuk amplop digital)\n- Cerita cinta / love story (opsional)\n- Musik latar (opsional)",
  aqiqah:
    "- Nama bayi & jenis kelamin\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Aqiqah\n- Foto bayi\n- Galeri foto\n- Nomor rekening (untuk amplop digital, opsional)\n- Musik latar (opsional)",
  khitan:
    "- Nama anak\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Khitan\n- Foto anak\n- Galeri foto\n- Nomor rekening (untuk amplop digital, opsional)\n- Musik latar (opsional)",
  birthday:
    "- Nama anak\n- Tanggal & tempat lahir\n- Nama ayah & ibu\n- Tanggal, jam & lokasi acara Ulang Tahun\n- Foto anak\n- Galeri foto\n- Musik latar (opsional)",
};

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
};

type Reseller = {
  id: string;
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller_brand";
};

type Client = {
  id: string;
  user_id?: string | null;
  name: string;
  email?: string | null;
  whatsapp?: string;
  package_name?: string;
  status?: string;
  sale_price?: number;
  created_at: string;
};

type Transaction = {
  id: string;
  client_id?: string | null;
  amount: number;
  commission: number;
  status?: string;
  midtrans_redirect_url?: string | null;
  payment_link_expires_at?: string | null;
};

type Invitation = {
  id: number;
  slug: string;
  category?: "wedding" | "aqiqah" | "khitan";
  groom_name?: string;
  bride_name?: string;
  baby_name?: string;
  client_id?: string;
};

type NewClientInfo = {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  packageName: string;
  salePrice: number;
  paymentUrl?: string | null;
  paymentError?: string | null;
};

export default function ResellerClientsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    package_name: "Luxury Gold",
    sale_price: "100000",
    status: "active",
  });
  const [addingClient, setAddingClient] = useState(false);
  const [newClientCredentials, setNewClientCredentials] = useState<NewClientInfo | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  const fetchData = async (resellerId: string) => {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, user_id, name, email, whatsapp, package_name, status, sale_price, created_at")
      .eq("reseller_id", resellerId)
      .order("created_at", { ascending: false });

    setClients(clientsData ?? []);

    const clientIds = (clientsData ?? []).map((c) => c.id);
    if (clientIds.length === 0) {
      setTransactions([]);
      setInvitations([]);
      setLoading(false);
      return;
    }

    const [{ data: invitationsData }, { data: transactionData }] = await Promise.all([
      supabase
        .from("invitations")
        .select("id, slug, category, groom_name, bride_name, baby_name, client_id")
        .in("client_id", clientIds),
      supabase
        .from("transactions")
        .select("id, client_id, amount, commission, status, midtrans_redirect_url, payment_link_expires_at")
        .eq("reseller_id", resellerId)
        .in("client_id", clientIds)
        .order("created_at", { ascending: false }),
    ]);

    setInvitations(invitationsData ?? []);
    setTransactions(transactionData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

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

      setUser({ id: authUser.id, role: profile.role, name: profile.name || "Reseller" });

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

      fetchData(currentReseller.id);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const addClient = async () => {
    if (!reseller) {
      alert("Akun reseller belum terhubung.");
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      alert("Nama dan email client wajib diisi (email dipakai untuk login client).");
      return;
    }

    const salePrice = Math.round(Number(form.sale_price));
    if (reseller.package !== "reseller_brand" && (!Number.isFinite(salePrice) || salePrice < 1000)) {
      alert("Harga jual client wajib diisi dengan benar.");
      return;
    }

    setAddingClient(true);

    const response = await fetch("/api/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sale_price: reseller.package === "reseller_brand" ? salePrice || 100000 : salePrice,
      }),
    });

    const result = await response.json();
    setAddingClient(false);

    if (!response.ok) {
      alert(`Gagal menambahkan client: ${result.error}`);
      return;
    }

    setNewClientCredentials({
      name: form.name,
      email: result.email,
      password: result.password,
      whatsapp: form.whatsapp,
      packageName: form.package_name,
      salePrice: Number(result.salePrice || salePrice || 100000),
      paymentUrl: result.paymentUrl ?? null,
      paymentError: result.paymentError ?? null,
    });

    setForm({
      name: "",
      email: "",
      whatsapp: "",
      package_name: "Luxury Gold",
      sale_price: "100000",
      status: "active",
    });

    fetchData(reseller.id);
  };

  const clientCredentialsMessage = () => {
    if (!newClientCredentials) return "";

    const dashboardBrand = reseller?.package === "reseller_brand" && reseller.brand_active && reseller.brand_name
      ? reseller.brand_name
      : "Vistiq Invitation";
    const category = categoryForPackageName(newClientCredentials.packageName);
    const checklist = DATA_CHECKLIST[category];

    if (reseller?.package !== "reseller_brand" && newClientCredentials.paymentUrl) {
      return `Halo ${newClientCredentials.name}, pesanan undangan digital Anda sudah dibuat.\n\nTotal pembayaran: Rp ${newClientCredentials.salePrice.toLocaleString("id-ID")}\nBayar aman melalui Midtrans di link berikut:\n${newClientCredentials.paymentUrl}\n\nSetelah pembayaran berhasil, undangan akan aktif otomatis dan akun dashboard bisa digunakan.\n\nAkun dashboard:\nLink: ${window.location.origin}/login\nEmail: ${newClientCredentials.email}\nPassword: ${newClientCredentials.password}\n\nData yang perlu disiapkan:\n${checklist}\n\nTerima kasih!`;
    }

    return `Halo ${newClientCredentials.name}, berikut akun login dashboard undangan Anda di ${dashboardBrand}:\n\nLink: ${window.location.origin}/login\nEmail: ${newClientCredentials.email}\nPassword: ${newClientCredentials.password}\n\nLewat dashboard ini Anda bisa generate link undangan per nama tamu, lihat RSVP, dan edit undangan.\n\nSupaya undangannya bisa langsung dipakai, mohon siapkan data berikut untuk diisi di dashboard:\n${checklist}\n\nKalau ada pertanyaan, jangan sungkan hubungi kami ya. Terima kasih!`;
  };

  const copyClientCredentials = async () => {
    if (!newClientCredentials) return;
    await navigator.clipboard.writeText(clientCredentialsMessage());
    alert("Pesan berhasil disalin, tinggal paste ke WhatsApp client.");
  };

  const clientWaLink = () => {
    if (!newClientCredentials?.whatsapp) return "";
    return `https://wa.me/${toWaNumber(newClientCredentials.whatsapp)}?text=${encodeURIComponent(clientCredentialsMessage())}`;
  };

  const paymentWaLink = (client: Client, transaction?: Transaction) => {
    if (!client.whatsapp || !transaction?.midtrans_redirect_url) return "";
    const message = `Halo ${client.name}, berikut link pembayaran undangan digital Anda.\n\nTotal: Rp ${Number(transaction.amount).toLocaleString("id-ID")}\nPembayaran melalui Midtrans:\n${transaction.midtrans_redirect_url}\n\nSetelah pembayaran berhasil, undangan akan aktif otomatis. Terima kasih!`;
    return `https://wa.me/${toWaNumber(client.whatsapp)}?text=${encodeURIComponent(message)}`;
  };

  const updateClientStatus = async (id: string, status: string) => {
    if (reseller?.package !== "reseller_brand") {
      alert("Status client Reseller standar mengikuti pembayaran Midtrans dan tidak dapat diubah manual.");
      return;
    }

    const { error } = await supabase.from("clients").update({ status }).eq("id", id);
    if (error) {
      alert(`Gagal mengubah status client: ${error.message}`);
      return;
    }
    if (reseller) fetchData(reseller.id);
  };

  const resetClientPassword = async (client: Client) => {
    if (!confirm(`Buat password baru untuk ${client.name}? Password lama akan langsung tidak berlaku.`)) return;

    setResettingId(client.id);
    const res = await fetch("/api/reseller/reset-client-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id }),
    });
    const result = await res.json();
    setResettingId(null);

    if (!res.ok) {
      alert(result.error || "Gagal mengganti password.");
      return;
    }

    setNewClientCredentials({
      name: client.name,
      email: result.email,
      password: result.password,
      whatsapp: client.whatsapp || "",
      packageName: client.package_name || "",
      salePrice: Number(client.sale_price || 100000),
    });
  };

  const invitationLabel = (item: Invitation) =>
    item.category === "aqiqah" || item.category === "khitan"
      ? item.baby_name || "-"
      : `${item.groom_name || "-"} & ${item.bride_name || "-"}`;

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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
        activeKey="clients"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Daftar Client</h1>
            <p className={styles.subtitle}>
              {reseller?.package === "reseller_brand"
                ? "Tambah client baru dan kelola client yang sudah ada."
                : "Tentukan harga jual, kirim link Midtrans ke client, dan pembayaran akan tercatat otomatis."}
            </p>
          </div>

          <button onClick={() => reseller && fetchData(reseller.id)} className={styles.button}>
            Refresh
          </button>
        </header>

        {loading ? (
          <p>Memuat data...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}>
            <h2>Akun reseller belum terhubung.</h2>
          </section>
        ) : (
          <>
            <section className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Tambah Client Baru</h2>
              <p style={{ marginTop: -8, marginBottom: 16, fontSize: 13, opacity: 0.75 }}>
                {reseller.package === "reseller_brand"
                  ? "Email dipakai untuk membuat akun login dashboard client secara otomatis."
                  : "Setelah disimpan, sistem otomatis membuat tagihan Midtrans. Client berstatus Pending sampai pembayaran berhasil."}
              </p>

              {newClientCredentials && (
                <div className={styles.linkBox} style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 700 }}>
                    Client berhasil dibuat: {newClientCredentials.name}
                  </p>
                  {reseller.package !== "reseller_brand" && (
                    <>
                      <p style={{ margin: "0 0 5px" }}>Harga jual: <strong>Rp {newClientCredentials.salePrice.toLocaleString("id-ID")}</strong></p>
                      <p style={{ margin: "0 0 12px" }}>
                        Bagian reseller 80%: <strong>Rp {Math.round(newClientCredentials.salePrice * 0.8).toLocaleString("id-ID")}</strong> · Fee platform 20%: Rp {Math.round(newClientCredentials.salePrice * 0.2).toLocaleString("id-ID")}
                      </p>
                      {newClientCredentials.paymentUrl ? (
                        <a href={newClientCredentials.paymentUrl} target="_blank" rel="noreferrer" className={styles.button} style={{ display: "inline-block", marginBottom: 12 }}>
                          Buka Link Pembayaran Midtrans
                        </a>
                      ) : newClientCredentials.paymentError ? (
                        <p style={{ color: "#b45309" }}>Link pembayaran belum berhasil dibuat: {newClientCredentials.paymentError}</p>
                      ) : null}
                    </>
                  )}
                  <p style={{ margin: 0 }}>Email: {newClientCredentials.email}</p>
                  <p style={{ margin: "0 0 12px" }}>Password: {newClientCredentials.password}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={copyClientCredentials} className={styles.exportButton}>
                      Copy Pesan untuk Client
                    </button>
                    {newClientCredentials.whatsapp && (
                      <a href={clientWaLink()} target="_blank" rel="noreferrer" className={styles.button}>
                        Kirim ke WA Otomatis
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formGrid}>
                <input
                  placeholder="Nama Client / Nama Pasangan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={styles.input}
                />

                <input
                  type="email"
                  placeholder="Email Client (untuk login dashboard)"
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
                  value={form.package_name}
                  onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                  className={styles.input}
                >
                  <optgroup label="Pernikahan">
                    {themeList.map((theme) => <option key={theme.key} value={theme.label}>{theme.label}</option>)}
                  </optgroup>
                  <optgroup label="Aqiqah">
                    {aqiqahThemeList.map((theme) => <option key={theme.key} value={theme.label}>{theme.label}</option>)}
                  </optgroup>
                  <optgroup label="Khitan">
                    {khitanThemeList.map((theme) => <option key={theme.key} value={theme.label}>{theme.label}</option>)}
                  </optgroup>
                  <optgroup label="Ulang Tahun">
                    {birthdayThemeList.map((theme) => <option key={theme.key} value={theme.label}>{theme.label}</option>)}
                  </optgroup>
                </select>

                {reseller.package !== "reseller_brand" && (
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Harga jual ke client"
                    value={form.sale_price}
                    onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                    className={styles.input}
                  />
                )}

                {reseller.package === "reseller_brand" && (
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={styles.input}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                )}
              </div>

              {reseller.package !== "reseller_brand" && (
                <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
                  Contoh Rp100.000 → Rp80.000 bagian reseller dan Rp20.000 fee Vistiq. Saldo reseller tersedia 6 hari setelah pembayaran berhasil.
                </p>
              )}

              <button onClick={addClient} className={styles.button} disabled={addingClient} style={{ marginTop: 16 }}>
                {addingClient ? "Membuat Client & Tagihan..." : reseller.package === "reseller_brand" ? "Simpan Client" : "Simpan Client & Buat Tagihan"}
              </button>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Client Saya</h2>

              {clients.length === 0 ? (
                <p>Belum ada client.</p>
              ) : (
                <div className={styles.table}>
                  {clients.map((client) => {
                    const clientInvitations = invitations.filter((inv) => inv.client_id === client.id);
                    const transaction = transactions.find((tx) => tx.client_id === client.id);
                    const isPaid = transaction?.status === "paid";

                    return (
                      <div key={client.id} className={styles.clientRow}>
                        <div className={styles.clientInfo}>
                          <strong>{client.name}</strong>
                          <p>{client.email || "-"}</p>
                          <p>{client.whatsapp || "-"}</p>
                          {reseller.package !== "reseller_brand" && transaction && (
                            <p><strong>Rp {Number(transaction.amount).toLocaleString("id-ID")}</strong> · Reseller Rp {Number(transaction.commission).toLocaleString("id-ID")}</p>
                          )}
                        </div>

                        <span className={styles.badge}>{client.package_name || "-"}</span>

                        <div className={styles.clientInvitations}>
                          {clientInvitations.length === 0 ? (
                            <span className={styles.clientEmpty}>Belum ada undangan</span>
                          ) : (
                            clientInvitations.map((inv) => (
                              <a key={inv.id} href={`/preview/${inv.slug}`} target="_blank" rel="noreferrer">
                                Lihat Undangan ({invitationLabel(inv)})
                              </a>
                            ))
                          )}

                          {clientInvitations.length > 0 && (
                            <Link href={`/reseller/rsvp?client_id=${client.id}`}>Lihat RSVP</Link>
                          )}

                          {reseller.package !== "reseller_brand" && !isPaid && transaction?.midtrans_redirect_url && (
                            <>
                              <a href={transaction.midtrans_redirect_url} target="_blank" rel="noreferrer">Link Pembayaran</a>
                              {client.whatsapp && <a href={paymentWaLink(client, transaction)} target="_blank" rel="noreferrer">Kirim Tagihan via WA</a>}
                            </>
                          )}
                        </div>

                        {reseller.package === "reseller_brand" ? (
                          <select
                            value={client.status || "active"}
                            onChange={(e) => updateClientStatus(client.id, e.target.value)}
                            className={`${styles.statusSelect} ${styles.clientStatus}`}
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span className={styles.badge}>{isPaid ? "LUNAS" : "MENUNGGU BAYAR"}</span>
                        )}

                        <p className={styles.date}>{new Date(client.created_at).toLocaleDateString("id-ID")}</p>

                        <div className={styles.clientActions}>
                          {client.user_id ? (
                            <button
                              onClick={() => resetClientPassword(client)}
                              disabled={resettingId === client.id}
                              className={styles.button}
                              style={{ fontSize: 11, padding: "6px 10px" }}
                            >
                              {resettingId === client.id ? "Membuat..." : "Reset Password"}
                            </button>
                          ) : (
                            <span className={styles.clientEmpty}>Belum ada akun login</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
