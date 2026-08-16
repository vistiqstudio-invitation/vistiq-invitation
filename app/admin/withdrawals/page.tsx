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
  { key: "musik", label: "Musik", href: "/admin/musik" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
  { key: "withdrawals", label: "Penarikan Reseller", href: "/admin/withdrawals" },
];

type Withdrawal = {
  id: string;
  reseller_id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  requested_at: string;
  paid_at?: string | null;
  rejected_at?: string | null;
  notes?: string | null;
};

type Reseller = { id: string; name: string; email?: string | null };

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = async () => {
    const [{ data: withdrawals }, { data: resellerData }] = await Promise.all([
      supabase.from("reseller_withdrawals").select("*").order("requested_at", { ascending: false }),
      supabase.from("resellers").select("id, name, email"),
    ]);
    setItems((withdrawals ?? []) as Withdrawal[]);
    setResellers((resellerData ?? []) as Reseller[]);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || profile.role !== "owner") { router.push("/login"); return; }
      loadData();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const resellerName = (id: string) => resellers.find((r) => r.id === id)?.name || "Reseller";

  const updateWithdrawal = async (id: string, status: "paid" | "rejected") => {
    const action = status === "paid" ? "tandai SUDAH DITRANSFER" : "TOLAK permintaan";
    if (!confirm(`Yakin ingin ${action}?`)) return;
    const notes = prompt("Catatan (opsional):") || null;
    setProcessing(id);
    const { error } = await supabase.rpc("owner_update_reseller_withdrawal", {
      p_withdrawal_id: id,
      p_status: status,
      p_notes: notes,
    });
    setProcessing(null);
    if (error) {
      alert(error.message || "Gagal memproses penarikan.");
      return;
    }
    loadData();
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const pendingTotal = items.filter((x) => x.status === "pending").reduce((sum, x) => sum + Number(x.amount), 0);
  const paidTotal = items.filter((x) => x.status === "paid").reduce((sum, x) => sum + Number(x.amount), 0);

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="withdrawals"
        notificationRole="owner"
        onLogout={logout}
      />
      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Penarikan Saldo Reseller</h1>
            <p className={styles.subtitle}>Tahap awal menggunakan approval owner. Transfer dana ke rekening reseller, lalu tandai sudah ditransfer.</p>
          </div>
          <button className={styles.button} onClick={loadData}>Refresh</button>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}><span>Menunggu Transfer</span><strong>Rp {pendingTotal.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Sudah Dicairkan</span><strong>Rp {paidTotal.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Total Permintaan</span><strong>{items.length}</strong></div>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Daftar Permintaan Penarikan</h2>
          {loading ? <p>Memuat...</p> : items.length === 0 ? <p>Belum ada permintaan penarikan.</p> : (
            <div className={styles.table}>
              {items.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div>
                    <strong>{resellerName(item.reseller_id)} · Rp {Number(item.amount).toLocaleString("id-ID")}</strong>
                    <p>{item.bank_name} · {item.bank_account_number} · a.n. {item.bank_account_holder}</p>
                    <p style={{ fontSize: 12, color: "#64748b" }}>Diajukan {new Date(item.requested_at).toLocaleString("id-ID")}</p>
                    {item.notes && <p style={{ fontSize: 12 }}>{item.notes}</p>}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {item.status === "pending" ? (
                      <>
                        <button className={styles.button} disabled={processing === item.id} onClick={() => updateWithdrawal(item.id, "paid")}>Sudah Ditransfer</button>
                        <button className={styles.exportButton} disabled={processing === item.id} onClick={() => updateWithdrawal(item.id, "rejected")}>Tolak</button>
                      </>
                    ) : (
                      <span className={styles.badge}>{item.status === "paid" ? "Sudah Dibayar" : "Ditolak"}</span>
                    )}
                  </div>
                  <p className={styles.date}>{item.status === "paid" && item.paid_at ? new Date(item.paid_at).toLocaleDateString("id-ID") : item.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
