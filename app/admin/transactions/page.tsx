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

type Transaction = {
  id: string;
  amount: number;
  commission: number;
  status?: string;
  reseller_id?: string | null;
  created_at: string;
};

type Reseller = {
  id: string;
  name: string;
};

export default function AdminTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTransactions(data ?? []);
    }

    const { data: resellersData } = await supabase.from("resellers").select("id, name");
    setResellers(resellersData ?? []);

    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("transactions").update({ status }).eq("id", id);
    fetchTransactions();
  };

  const resellerName = (resellerId?: string | null) =>
    resellers.find((r) => r.id === resellerId)?.name || "-";

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

      fetchTransactions();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalOmzet = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalKomisi = transactions.reduce(
    (sum, item) => sum + Number(item.commission || 0),
    0
  );

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="transactions"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Transaksi</h1>
            <p className={styles.subtitle}>
              Riwayat transaksi dan komisi reseller.
            </p>
          </div>

          <button onClick={fetchTransactions} className={styles.button}>
            Refresh
          </button>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span>Total Omzet</span>
            <strong>Rp {totalOmzet.toLocaleString("id-ID")}</strong>
          </div>

          <div className={styles.statCard}>
            <span>Total Komisi</span>
            <strong>Rp {totalKomisi.toLocaleString("id-ID")}</strong>
          </div>

          <div className={styles.statCard}>
            <span>Total Transaksi</span>
            <strong>{transactions.length}</strong>
          </div>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Transaksi</h2>

          {loading ? (
            <p>Memuat data...</p>
          ) : transactions.length === 0 ? (
            <p>Belum ada transaksi.</p>
          ) : (
            <div className={styles.table}>
              {transactions.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div>
                    <strong>Rp {Number(item.amount || 0).toLocaleString("id-ID")}</strong>
                    <p>Komisi Rp {Number(item.commission || 0).toLocaleString("id-ID")} - {resellerName(item.reseller_id)}</p>
                  </div>

                  <select
                    value={item.status || "pending"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Menunggu</option>
                    <option value="paid">Dibayar</option>
                  </select>

                  <p className={styles.date}>
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
