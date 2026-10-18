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
  package?: "reseller" | "reseller_brand";
  billing_model?: "legacy_commission" | "per_invitation";
};

type Transaction = {
  id: string;
  client_id?: string | null;
  invitation_id?: number | null;
  amount: number;
  status?: string;
  created_at: string;
  paid_at?: string | null;
  midtrans_order_id?: string | null;
  midtrans_redirect_url?: string | null;
  payment_type?: string | null;
};

type Client = { id: string; name: string };
type Invitation = { id: number; slug: string; groom_name?: string | null; bride_name?: string | null; baby_name?: string | null };

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "-";
}

function statusLabel(status?: string) {
  if (status === "paid") return "BERHASIL";
  if (status === "expire") return "KEDALUWARSA";
  if (status === "cancel" || status === "deny" || status === "failure") return "GAGAL";
  return "MENUNGGU BAYAR";
}

export default function ResellerTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchTransactions = async (resellerId: string) => {
    const [{ data: tx }, { data: clientData }, { data: invitationData }] = await Promise.all([
      supabase.from("transactions")
        .select("id, client_id, invitation_id, amount, status, created_at, paid_at, midtrans_order_id, midtrans_redirect_url, payment_type")
        .eq("reseller_id", resellerId)
        .eq("transaction_type", "invitation_activation")
        .order("created_at", { ascending: false }),
      supabase.from("clients").select("id, name").eq("reseller_id", resellerId),
      supabase.from("invitations").select("id, slug, groom_name, bride_name, baby_name"),
    ]);
    setTransactions(tx ?? []);
    setClients(clientData ?? []);
    setInvitations(invitationData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", authUser.id).single();
      if (!profile || profile.role !== "reseller") { router.push("/login"); return; }
      const { data: resellerData } = await supabase.from("resellers").select("*").eq("user_id", authUser.id);
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
    } finally { setSyncing(null); }
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const paidCount = transactions.filter((item) => item.status === "paid").length;
  const pendingCount = transactions.filter((item) => item.status === "pending").length;
  const totalPaid = transactions.filter((item) => item.status === "paid").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const brandingEnabled = reseller?.package === "reseller" || reseller?.package === "reseller_brand";
  const brandName = brandingEnabled && reseller?.brand_name ? reseller.brand_name : null;
  const brandStyle = brandingEnabled && reseller?.brand_color ? ({ "--accent": reseller.brand_color } as React.CSSProperties) : undefined;
  const clientName = (id?: string | null) => clients.find((client) => client.id === id)?.name || "Client";
  const invitationName = (id?: number | null) => {
    const item = invitations.find((invitation) => invitation.id === id);
    if (!item) return "Undangan";
    return item.baby_name || [item.groom_name, item.bride_name].filter(Boolean).join(" & ") || item.slug;
  };

  return (
    <main className={styles.page} style={brandStyle}>
      <DashboardSidebar
        brandTop={brandName ? brandName.toUpperCase() : "VISTIQ"}
        brandBottom={reseller?.package === "reseller_brand" ? "Mitra Brand" : "Reseller"}
        logoUrl={brandingEnabled ? reseller?.logo_url : null}
        accentColor={brandingEnabled ? reseller?.brand_color : null}
        items={getResellerNavItems(reseller?.package, reseller?.id, reseller?.billing_model)}
        activeKey="transactions"
        notificationRole="reseller"
        onLogout={logout}
      />
      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>{brandName ? `${brandName} DASHBOARD` : "RESELLER DASHBOARD"}</p>
            <h1 className={styles.title}>Riwayat Pembayaran</h1>
            <p className={styles.subtitle}>Catatan pembayaran biaya layanan Rp20.000 per undangan.</p>
          </div>
          <button onClick={() => reseller && fetchTransactions(reseller.id)} className={styles.button}>Refresh</button>
        </header>

        {loading ? <p>Memuat data...</p> : !reseller ? (
          <section className={styles.warningBox}><h2>Akun belum terhubung.</h2></section>
        ) : (
          <>
            <section className={styles.stats}>
              <div className={styles.statCard}><span>Pembayaran Berhasil</span><strong>{paidCount}</strong></div>
              <div className={styles.statCard}><span>Menunggu Bayar</span><strong>{pendingCount}</strong></div>
              <div className={styles.statCard}><span>Total Biaya Layanan</span><strong>Rp {totalPaid.toLocaleString("id-ID")}</strong></div>
            </section>
            <section className={styles.tableWrap}>
              <h2 className={styles.sectionTitle}>Pembayaran Biaya Layanan</h2>
              {transactions.length === 0 ? <p>Belum ada pembayaran biaya layanan.</p> : (
                <div className={styles.table}>
                  {transactions.map((item) => {
                    const isPaid = item.status === "paid";
                    return (
                      <div className={styles.row} key={item.id}>
                        <div>
                          <strong>{invitationName(item.invitation_id)} · Rp {Number(item.amount || 0).toLocaleString("id-ID")}</strong>
                          <p>{clientName(item.client_id)}</p>
                          <p style={{ fontSize: 12, color: "#64748b" }}>{isPaid ? `Berhasil ${formatDate(item.paid_at)}` : `Dibuat ${formatDate(item.created_at)}`}</p>
                          {item.midtrans_order_id && <p style={{ fontSize: 11, color: "#94a3b8" }}>ID: {item.midtrans_order_id}</p>}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span className={styles.badge}>{statusLabel(item.status)}</span>
                          {!isPaid && item.midtrans_redirect_url && <a href={item.midtrans_redirect_url} target="_blank" rel="noreferrer" className={styles.button} style={{ fontSize: 11, padding: "6px 10px" }}>Bayar Sekarang</a>}
                          {!isPaid && item.midtrans_order_id && <button onClick={() => syncPayment(item)} disabled={syncing === item.id} className={styles.exportButton} style={{ fontSize: 11, padding: "6px 10px" }}>{syncing === item.id ? "Mengecek..." : "Cek Status"}</button>}
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
