"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { getResellerNavItems } from "@/components/reseller/navItems";
import styles from "@/styles/dashboard.module.css";

type Reseller = {
  id: string;
  package?: "reseller" | "reseller_brand";
  brand_name?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  brand_active?: boolean;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_holder?: string | null;
};

type Transaction = {
  id: string;
  commission: number;
  status?: string;
  paid_at?: string | null;
  available_at?: string | null;
  withdrawal_id?: string | null;
};

type Withdrawal = {
  id: string;
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

export default function ResellerSaldoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const fetchData = async (resellerId: string) => {
    const [{ data: tx }, { data: wd }] = await Promise.all([
      supabase
        .from("transactions")
        .select("id, commission, status, paid_at, available_at, withdrawal_id")
        .eq("reseller_id", resellerId)
        .order("created_at", { ascending: false }),
      supabase
        .from("reseller_withdrawals")
        .select("*")
        .eq("reseller_id", resellerId)
        .order("requested_at", { ascending: false }),
    ]);

    setTransactions(tx ?? []);
    setWithdrawals((wd ?? []) as Withdrawal[]);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || profile.role !== "reseller") { router.push("/login"); return; }

      const { data } = await supabase.from("resellers").select("*").eq("user_id", user.id).maybeSingle();
      if (!data) { setLoading(false); return; }
      if (data.package === "reseller_brand") { router.push("/reseller"); return; }

      setReseller(data as Reseller);
      setBankName(data.bank_name || "");
      setAccountNumber(data.bank_account_number || "");
      setAccountHolder(data.bank_account_holder || "");
      await fetchData(data.id);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const now = Date.now();
  const totals = useMemo(() => {
    let held = 0;
    let available = 0;
    let withdrawn = 0;

    for (const item of transactions) {
      if (item.status !== "paid") continue;
      const amount = Number(item.commission || 0);
      if (item.withdrawal_id) {
        const wd = withdrawals.find((x) => x.id === item.withdrawal_id);
        if (wd?.status === "paid") withdrawn += amount;
        continue;
      }
      if (item.available_at && new Date(item.available_at).getTime() <= now) available += amount;
      else held += amount;
    }

    return { held, available, withdrawn, total: held + available + withdrawn };
  }, [transactions, withdrawals, now]);

  const requestWithdrawal = async () => {
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      alert("Lengkapi data rekening terlebih dahulu.");
      return;
    }
    if (totals.available <= 0) {
      alert("Belum ada saldo yang bisa ditarik.");
      return;
    }
    if (!confirm(`Tarik seluruh saldo tersedia Rp ${totals.available.toLocaleString("id-ID")}?`)) return;

    setSubmitting(true);
    const { error } = await supabase.rpc("request_reseller_withdrawal", {
      p_bank_name: bankName.trim(),
      p_account_number: accountNumber.trim(),
      p_account_holder: accountHolder.trim(),
    });
    setSubmitting(false);

    if (error) {
      alert(error.message || "Gagal mengajukan penarikan.");
      return;
    }

    alert("Permintaan penarikan berhasil dikirim ke owner Vistiq.");
    if (reseller) fetchData(reseller.id);
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };

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
        activeKey="saldo"
        notificationRole="reseller"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>RESELLER DASHBOARD</p>
            <h1 className={styles.title}>Saldo & Penarikan</h1>
            <p className={styles.subtitle}>Bagian reseller 80% ditahan selama 6 hari setelah pembayaran client berhasil.</p>
          </div>
          <button onClick={() => reseller && fetchData(reseller.id)} className={styles.button}>Refresh</button>
        </header>

        {loading ? <p>Memuat saldo...</p> : !reseller ? (
          <section className={styles.warningBox}><h2>Akun reseller belum terhubung.</h2></section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}><span>Total Penghasilan</span><strong>Rp {totals.total.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Saldo Tertahan</span><strong>Rp {totals.held.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Saldo Bisa Ditarik</span><strong>Rp {totals.available.toLocaleString("id-ID")}</strong></div>
              <div className={styles.statCard}><span>Sudah Dicairkan</span><strong>Rp {totals.withdrawn.toLocaleString("id-ID")}</strong></div>
            </section>

            <section className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Rekening Pencairan</h2>
              <div className={styles.formGrid}>
                <input className={styles.input} placeholder="Nama Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                <input className={styles.input} placeholder="Nomor Rekening" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} />
                <input className={styles.input} placeholder="Nama Pemilik Rekening" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
              </div>
              <button className={styles.button} style={{ marginTop: 16 }} onClick={requestWithdrawal} disabled={submitting || totals.available <= 0}>
                {submitting ? "Mengirim Permintaan..." : `Tarik Saldo Rp ${totals.available.toLocaleString("id-ID")}`}
              </button>
              <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
                Untuk tahap awal, pencairan diproses owner Vistiq setelah permintaan masuk. Status akan tampil di riwayat di bawah.
              </p>
            </section>

            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Riwayat Penarikan</h2>
              {withdrawals.length === 0 ? <p>Belum ada penarikan saldo.</p> : (
                <div className={styles.table}>
                  {withdrawals.map((item) => (
                    <div className={styles.row} key={item.id}>
                      <div>
                        <strong>Rp {Number(item.amount).toLocaleString("id-ID")}</strong>
                        <p>{item.bank_name} · {item.bank_account_number} · {item.bank_account_holder}</p>
                        {item.notes && <p>{item.notes}</p>}
                      </div>
                      <span className={styles.badge}>
                        {item.status === "paid" ? "Sudah Dibayar" : item.status === "rejected" ? "Ditolak" : "Menunggu Owner"}
                      </span>
                      <p className={styles.date}>{new Date(item.requested_at).toLocaleDateString("id-ID")}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
