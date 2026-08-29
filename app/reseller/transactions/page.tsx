"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import styles from "@/styles/dashboard.module.css";

const ADMIN_WHATSAPP = "6281371338032";

type Reseller = {
  id: string;
  name?: string | null;
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  package?: "reseller" | "reseller-brand" | "reseller_brand";
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
  payment_type?: string | null;
  withdrawal_id?: string | null;
};

type Client = {
  id: string;
  name: string;
  whatsapp?: string | null;
};

function isBrandPackage(value?: string | null) {
  return value === "reseller-brand" || value === "reseller_brand";
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

function adminPaymentLink(item: Transaction, client: Client | undefined, reseller: Reseller | null) {
  const message = [
    "Halo Admin Vistiq, saya ingin konfirmasi pembayaran undangan client Reseller.",
    "",
    `ID Transaksi: ${item.id}`,
    `Client: ${client?.name || "Client"}`,
    `Reseller: ${reseller?.name || "Reseller"}`,
    `Total: Rp ${Number(item.amount).toLocaleString("id-ID")}`,
    "",
    "Mohon kirimkan informasi rekening Vistiq. Setelah transfer diterima, mohon tandai Pembayaran Sukses dari Dashboard Owner.",
  ].join("\n");
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function ResellerTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (resellerId: string) => {
    const [{ data: tx }, { data: clientData }] = await Promise.all([
      supabase
        .from("transactions")
        .select("id, client_id, amount, commission, status, created_at, paid_at, available_at, payment_type, withdrawal_id")
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

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const paidTransactions = transactions.filter((item) => item.status === "paid");
  const totalOmzet = paidTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalResellerShare = paidTransactions.reduce((sum, item) => sum + Number(item.commission || 0), 0);
  const totalPlatformFee = paidTransactions.reduce(
    (sum, item) => sum + Math.max(0, Number(item.amount || 0) - Number(item.commission || 0)),
    0,
  );
  const pendingCount = transactions.filter((item) => item.status !== "paid").length;

  const brandPackage = isBrandPackage(reseller?.package);
  const brandingEnabled = reseller?.package === "reseller" || Boolean(reseller?.brand_active);
  const brandName = brandingEnabled && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandingEnabled && reseller?.brand_color
    ? ({ "--accent": reseller.brand_color } as React.CSSProperties)
    : undefined;

  const clientFor = (id?: string | null) => clients.find((client) => client.id === id);

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={brandPackage ? "Reseller Brand" : "Reseller"}
        logoUrl={brandingEnabled ? reseller?.logo_url : null}
        accentColor={brandingEnabled ? reseller?.brand_color : null}
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
              Pembayaran client Reseller standar masuk ke Vistiq melalui WhatsApp Admin. Setelah Admin memverifikasi transfer, 80% menjadi bagian reseller dan 20% fee Vistiq.
            </p>
          </div>
          <button onClick={() => reseller && fetchTransactions(reseller.id)} className={styles.button}>Refresh</button>
        </header>

        {loading ? (
          <p>Memuat data...</p>
        ) : !reseller ? (
          <section className={styles.warningBox}><h2>Akun reseller belum terhubung.</h2></section>
        ) : brandPackage ? (
          <section className={styles.warningBox}>
            <h2>Reseller Brand menyimpan 100% harga jual.</h2>
            <p>Pembayaran client Reseller Brand dilakukan langsung ke Reseller Brand dan tidak masuk transaksi Vistiq.</p>
          </section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}><span>Transaksi Lunas</span><strong>{paidTransactions.length}</strong></div>
              <div className={styles.statCard}><span>Menunggu Verifikasi</span><strong>{pendingCount}</strong></div>
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
                    const client = clientFor(item.client_id);

                    return (
                      <div className={styles.row} key={item.id}>
                        <div>
                          <strong>{client?.name || "Client"} · Rp {amount.toLocaleString("id-ID")}</strong>
                          <p>Bagian reseller Rp {resellerShare.toLocaleString("id-ID")} · Fee Vistiq Rp {platformFee.toLocaleString("id-ID")}</p>
                          <p style={{ fontSize: 12, color: "#64748b" }}>
                            {isPaid
                              ? `Lunas ${formatDate(item.paid_at)} · ${available ? "Saldo sudah bisa ditarik" : `Saldo tersedia ${formatDate(item.available_at)}`}`
                              : "Menunggu transfer dan verifikasi Admin Vistiq"}
                          </p>
                          {item.payment_type && <p style={{ fontSize: 12 }}>Metode: {item.payment_type === "manual_whatsapp" ? "Transfer Manual · WA Admin" : item.payment_type}</p>}
                          {item.withdrawal_id && <p style={{ fontSize: 12, color: "#0369a1" }}>Saldo transaksi ini sudah masuk proses penarikan.</p>}
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span className={styles.badge}>{isPaid ? "LUNAS" : "MENUNGGU VERIFIKASI"}</span>
                          {!isPaid && (
                            <a
                              href={adminPaymentLink(item, client, reseller)}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.button}
                              style={{ fontSize: 11, padding: "6px 10px", background: "#22c55e", color: "white" }}
                            >
                              Hubungi Admin Vistiq
                            </a>
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
