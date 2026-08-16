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
  amount: number;
  commission: number;
  status?: string;
  created_at: string;
};

export default function ResellerTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (resellerId: string) => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("reseller_id", resellerId)
      .order("created_at", { ascending: false });
    setTransactions(data ?? []);
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

  const totalOmzet = transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalResellerShare = transactions.reduce((sum, item) => sum + Number(item.commission || 0), 0);
  const totalPlatformFee = transactions.reduce(
    (sum, item) => sum + Math.max(0, Number(item.amount || 0) - Number(item.commission || 0)),
    0,
  );
  const paidResellerShare = transactions
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.commission || 0), 0);

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
        activeKey="transactions"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Transaksi Saya</h1>
            <p className={styles.subtitle}>
              Paket Reseller: 80% bagian reseller dan 20% fee platform pada setiap transaksi client.
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
            <p>Anda bebas menentukan harga client sendiri dan tidak menggunakan skema fee platform Reseller biasa.</p>
          </section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}><span>Total Penjualan</span><strong>{transactions.length}</strong></div>
              <div className={styles.statCard}><span>Total Nilai Transaksi</span><strong>Rp {totalOmzet.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Bagian Reseller (80%)</span><strong>Rp {totalResellerShare.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Fee Platform (20%)</span><strong>Rp {totalPlatformFee.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Bagian Reseller Dibayar</span><strong>Rp {paidResellerShare.toLocaleString("id-ID")}</strong></div>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Riwayat Transaksi</h2>
              {transactions.length === 0 ? (
                <p>Belum ada transaksi client.</p>
              ) : (
                <div className={styles.table}>
                  {transactions.map((item) => {
                    const amount = Number(item.amount || 0);
                    const resellerShare = Number(item.commission || 0);
                    const platformFee = Math.max(0, amount - resellerShare);
                    return (
                      <div className={styles.row} key={item.id}>
                        <div>
                          <strong>Rp {amount.toLocaleString("id-ID")}</strong>
                          <p>Bagian reseller Rp {resellerShare.toLocaleString("id-ID")} · Fee platform Rp {platformFee.toLocaleString("id-ID")}</p>
                        </div>
                        <span className={styles.badge}>{item.status === "paid" ? "Dibayar" : "Menunggu"}</span>
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
