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
};

const PACKAGE_LABELS: Record<string, string> = {
  reseller: "Reseller (30%)",
  reseller_brand: "Reseller Brand - White Label (100%)",
};

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
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

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

    setCredentials({ email: result.email, password: result.password });

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
    await supabase.from("resellers").update({ status }).eq("id", id);
    fetchResellers();
  };

  const updateCommission = async (id: string, commission_percent: number) => {
    await supabase
      .from("resellers")
      .update({ commission_percent })
      .eq("id", id);

    fetchResellers();
  };

  const updatePackage = async (id: string, pkg: string) => {
    await supabase
      .from("resellers")
      .update({
        package: pkg,
        commission_percent: PACKAGE_DEFAULT_COMMISSION[pkg],
      })
      .eq("id", id);

    fetchResellers();
  };

  const resetPassword = async (userId: string) => {
    if (!confirm("Buat password baru untuk reseller ini? Password lama akan langsung tidak berlaku.")) return;

    setResettingId(userId);
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const result = await res.json();
    setResettingId(null);

    if (!res.ok) {
      alert(result.error || "Gagal mengubah password.");
      return;
    }

    setCredentials({ email: result.email, password: result.password });
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
                Password siap - catat/kirim sekarang, tidak akan ditampilkan lagi:
              </strong>
              <p style={{ margin: 0 }}>Email: <code>{credentials.email}</code></p>
              <p style={{ margin: "4px 0 8px" }}>Password: <code>{credentials.password}</code></p>
              <button
                onClick={() => setCredentials(null)}
                className={styles.button}
                style={{ padding: "6px 14px", fontSize: 12.5 }}
              >
                Tutup
              </button>
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
              <option value="reseller_brand">Reseller Brand - White Label (Promo Rp 149.000, normal Rp 299.000, 100%)</option>
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
                <div key={reseller.id} className={styles.row}>
                  <div>
                    <strong>{reseller.name}</strong>
                    <p>{reseller.whatsapp || "-"}</p>
                  </div>

                  <select
                    value={reseller.package || "reseller"}
                    onChange={(e) => updatePackage(reseller.id, e.target.value)}
                    className={styles.statusSelect}
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
                    className={styles.smallInput}
                  />

                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(reseller.brand_active)}
                      onChange={(e) => toggleBrandActive(reseller.id, e.target.checked)}
                    />
                    Brand {reseller.brand_name ? `(${reseller.brand_name})` : ""}
                  </label>

                  <select
                    value={reseller.status || "active"}
                    onChange={(e) => updateStatus(reseller.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <p className={styles.date}>
                    {new Date(reseller.created_at).toLocaleDateString("id-ID")}
                  </p>

                  <button
                    onClick={() => resetPassword(reseller.user_id)}
                    disabled={resettingId === reseller.user_id}
                    className={styles.button}
                    style={{ fontSize: 11, padding: "6px 10px" }}
                  >
                    {resettingId === reseller.user_id ? "Membuat..." : "Reset Password"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
