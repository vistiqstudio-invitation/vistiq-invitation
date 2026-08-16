"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type Transaction = {
  id: string;
  client_id?: string | null;
  amount: number;
  commission: number;
  status?: string;
  created_at: string;
  paid_at?: string | null;
  available_at?: string | null;
  midtrans_order_id?: string | null;
  midtrans_redirect_url?: string | null;
  payment_type?: string | null;
  withdrawal_id?: string | null;
};

type Client = {
  id: string;
  name: string;
  whatsapp?: string | null;
};

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

export default function ResellerTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchTransactions = async (resellerId: string) => {
    const [{ data: tx }, { data: clientData }] = await Promise.all([
      supabase
        .from("transactions")
        .select("id, client_id, amount, commission, status, created_at, paid_at, available_at, midtrans_order_id, midtrans_redirect_url, payment_type, withdrawal_id")
        .eq("reseller_id", resellerId)
        .order("created_at", { ascending: false }),
      supabase
        .from("clients")
        .select("id, name, whatsapp")
        .eq("reseller_id", resellerId),
    ]);

    setTransactions(tx ?? []);
    setClients(clientData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", authUser.id).single();
      if (!profile || profile.role !== "reseller") { router.push("/login"); return; }

      const { data: resellerData } = await supabase
        .from("resellers").select("*").eq("user_id", authUser.id);
      const currentReseller = resellerData?.[0] || null;
      setReseller(currentReseller);
      if (!currentReseller) { setLoading(false); return; }
      fetchTransactions(currentReseller.id);
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const syncPayment = async (item: Transaction) => {
    if (!item.midtrans_order_id || !reseller) return;
    setSyncing(item.id);
    try {
      const response = await fetch(`/api/payments/status?order_id=${encodeURIComponent(item.midtrans_order_id)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) alert(result.error || "Gagal mengecek pembayaran.");
      await fetchTransactions(reseller.id);
    } finally {
      setSyncing(null);
    }
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const paidTransactions = transactions.filter((item) => item.status === "paid");
  const totalOmzet = paidTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalResellerShare = paidTransactions.reduce((sum, item) => sum + Number(item.commission || 0), 0);
  const totalPlatformFee = paidTransactions.reduce(
    (sum, item) => sum + Math.max(0, Number(item.amount || 0) - Number(item.commission || 0)),
    0,
  );
  const pendingCount = transactions.filter((item) => item.status !== "paid").length;

  const brandActive = reseller?.package === "reseller_brand" && Boolean(reseller?.brand_active);
  const brandName = brandActive && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandActive && reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  const clientName = (id?: string | null) => clients.find((client) => client.id === id)?.name || "Client";

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandName ? "Reseller Brand" : "Reseller"}
        logoUrl={brandActive ? reseller?.logo_url : null}
        accentColor={brandActive ? reseller?.brand_color : null}
        items={getResellerNavItems(reseller?.package, reseller?.id)}
        activeKey="transactions"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Transaksi Client</h1>
            <p className={styles.subtitle}>
              Pembayaran client Reseller standar wajib melalui Midtrans. Setelah lunas, 80% menjadi penghasilan reseller dan 20% fee platform.
            </p>
          </div>
          <button onClick={() => reseller && fetchTransactions(reseller.id)} className={styles.button}>Refresh</button>
        </header>

        {loading ? (
          <p>Memuat data...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}><h2>Akun reseller belum terhubung.</h2></section>
        ) : reseller.package === "reseller_brand" ? (
          <section className={styles.warningBox}>
            <h2>Reseller Brand menyimpan 100% harga jual.</h2>
            <p>Reseller Brand tidak menggunakan skema pembayaran 80/20 milik paket Reseller standar.</p>
          </section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}><span>Transaksi Lunas</span><strong>{paidTransactions.length}</strong></div>
              <div className={styles.statCard}><span>Menunggu Bayar</span><strong>{pendingCount}</strong></div>
              <div className={styles.statCard}><span>Omzet Lunas</span><strong>Rp {totalOmzet.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Penghasilan Reseller 80%</span><strong>Rp {totalResellerShare.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Fee Vistiq 20%</span><strong>Rp {totalPlatformFee.toLocaleString("id-ID")}</strong></div>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Riwayat Pembayaran Client</h2>
              {transactions.length === 0 ? (
                <p>Belum ada transaksi client.</p>
              ) : (
                <div className={styles.table}>
                  {transactions.map((item) => {
                    const amount = Number(item.amount || 0);
                    const resellerShare = Number(item.commission || 0);
                    const platformFee = Math.max(0, amount - resellerShare);
                    const isPaid = item.status === "paid";
                    const available = item.available_at ? new Date(item.available_at).getTime() <= Date.now() : false;

                    return (
                      <div className={styles.row} key={item.id}>
                        <div>
                          <strong>{clientName(item.client_id)} · Rp {amount.toLocaleString("id-ID")}</strong>
                          <p>Bagian reseller Rp {resellerShare.toLocaleString("id-ID")} · Fee Vistiq Rp {platformFee.toLocaleString("id-ID")}</p>
                          <p style={{ fontSize: 12, color: "#64748b" }}>
                            {isPaid
                              ? `Lunas ${formatDate(item.paid_at)} · ${available ? "Saldo sudah bisa ditarik" : `Saldo tersedia ${formatDate(item.available_at)}`}`
                              : "Menunggu pembayaran client melalui Midtrans"}
                          </p>
                          {item.payment_type && <p style={{ fontSize: 12 }}>Metode: {item.payment_type}</p>}
                          {item.withdrawal_id && <p style={{ fontSize: 12, color: "#0369a1" }}>Saldo transaksi ini sudah masuk proses penarikan.</p>}
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span className={styles.badge}>{isPaid ? "LUNAS" : "MENUNGGU"}</span>
                          {!isPaid && item.midtrans_redirect_url && (
                            <a href={item.midtrans_redirect_url} target="_blank" rel="noreferrer" className={styles.button} style={{ fontSize: 11, padding: "6px 10px" }}>
                              Link Bayar
                            </a>
                          )}
                          {!isPaid && item.midtrans_order_id && (
                            <button
                              onClick={() => syncPayment(item)}
                              disabled={syncing === item.id}
                              className={styles.exportButton}
                              style={{ fontSize: 11, padding: "6px 10px" }}
                            >
                              {syncing === item.id ? "Mengecek..." : "Cek Midtrans"}
                            </button>
                          )}
                        </div>

                        <p className={styles.date}>{new Date(item.created_at).toLocaleDateString("id-ID")}</p>
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
