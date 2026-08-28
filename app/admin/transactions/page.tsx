"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import styles from "@/styles/dashboard.module.css";

function toWaNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

function waFollowUpLink(item: CheckoutOrder) {
  const amount = `Rp ${Number(item.amount).toLocaleString("id-ID")}`;
  const message =
    item.status === "expire"
      ? `Halo ${item.customer_name}, kami dari Vistiq Invitation. Link pembayaran untuk ${item.package_name} (${amount}) sudah kedaluwarsa. Silakan checkout ulang jika masih berminat. Terima kasih!`
      : `Halo ${item.customer_name}, kami dari Vistiq Invitation. Pembayaran untuk ${item.package_name} (${amount}) masih menunggu. Silakan selesaikan pembayaran agar akun bisa aktif. Terima kasih!`;
  return `https://wa.me/${toWaNumber(item.customer_phone)}?text=${encodeURIComponent(message)}`;
}

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

type Transaction = {
  id: string;
  client_id?: string | null;
  amount: number;
  commission: number;
  status?: string;
  reseller_id?: string | null;
  created_at: string;
  paid_at?: string | null;
  available_at?: string | null;
  payment_type?: string | null;
  midtrans_order_id?: string | null;
};

type Reseller = { id: string; name: string };
type Client = { id: string; name: string };

type CheckoutOrder = {
  id: string;
  order_id: string;
  package_name: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_type?: string | null;
  provision_status?: string | null;
  provision_error?: string | null;
  created_at: string;
};

export default function AdminTransactionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [checkoutOrders, setCheckoutOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    const [{ data: tx }, { data: resellerData }, { data: clientData }, { data: checkoutData }] = await Promise.all([
      supabase.from("transactions").select("id, client_id, reseller_id, amount, commission, status, created_at, paid_at, available_at, payment_type, midtrans_order_id").order("created_at", { ascending: false }),
      supabase.from("resellers").select("id, name"),
      supabase.from("clients").select("id, name"),
      supabase.from("checkout_orders").select("id, order_id, package_name, amount, customer_name, customer_email, customer_phone, status, payment_type, provision_status, provision_error, created_at").order("created_at", { ascending: false }),
    ]);

    setTransactions(tx ?? []);
    setResellers(resellerData ?? []);
    setClients(clientData ?? []);
    setCheckoutOrders(checkoutData ?? []);
    setLoading(false);
  };

  const resellerName = (id?: string | null) => resellers.find((r) => r.id === id)?.name || "-";
  const clientName = (id?: string | null) => clients.find((c) => c.id === id)?.name || "Client";

  const syncOrder = async (orderId: string) => {
    setSyncingId(orderId);
    try {
      const response = await fetch(`/api/payments/status?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) alert(result.error || "Gagal mengecek pembayaran.");
      await fetchTransactions();
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", authUser.id).single();
      if (!profile || profile.role !== "owner") { router.push("/login"); return; }
      fetchTransactions();
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const paidTransactions = transactions.filter((item) => item.status === "paid");
  const totalOmzet = paidTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalResellerShare = paidTransactions.reduce((sum, item) => sum + Number(item.commission || 0), 0);
  const totalPlatformFee = paidTransactions.reduce((sum, item) => sum + Math.max(0, Number(item.amount || 0) - Number(item.commission || 0)), 0);

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="transactions"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER MENU</p>
            <h1 className={styles.title}>Transaksi</h1>
            <p className={styles.subtitle}>Pembayaran tercatat otomatis lewat Midtrans. Setelah pembayaran berhasil diverifikasi, aktifkan undangan melalui menu Undangan.</p>
          </div>
          <button onClick={fetchTransactions} className={styles.button}>Refresh</button>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}><span>Omzet Reseller Lunas</span><strong>Rp {totalOmzet.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Hak Reseller 80%</span><strong>Rp {totalResellerShare.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Fee Vistiq 20%</span><strong>Rp {totalPlatformFee.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Total Transaksi Reseller</span><strong>{transactions.length}</strong></div>
        </section>

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Pembayaran Client Reseller</h2>
          {loading ? <p>Memuat data...</p> : transactions.length === 0 ? <p>Belum ada transaksi reseller.</p> : (
            <div className={styles.table}>
              {transactions.map((item) => {
                const amount = Number(item.amount || 0);
                const resellerShare = Number(item.commission || 0);
                const platformFee = Math.max(0, amount - resellerShare);
                return (
                  <div className={styles.row} key={item.id}>
                    <div>
                      <strong>{clientName(item.client_id)} · Rp {amount.toLocaleString("id-ID")}</strong>
                      <p>{resellerName(item.reseller_id)} · Reseller Rp {resellerShare.toLocaleString("id-ID")} · Vistiq Rp {platformFee.toLocaleString("id-ID")}</p>
                      {item.status === "paid" && (
                        <p style={{ fontSize: 12, color: "#64748b" }}>
                          Lunas {item.paid_at ? new Date(item.paid_at).toLocaleString("id-ID") : ""}
                          {item.available_at ? ` · Saldo reseller tersedia ${new Date(item.available_at).toLocaleString("id-ID")}` : ""}
                        </p>
                      )}
                      {item.payment_type && <p style={{ fontSize: 12 }}>Metode: {item.payment_type}</p>}
                    </div>
                    <div>
                      <span className={styles.badge}>{item.status === "paid" ? "LUNAS" : String(item.status || "pending").toUpperCase()}</span>
                      {item.status !== "paid" && item.midtrans_order_id && (
                        <button
                          onClick={() => syncOrder(item.midtrans_order_id!)}
                          disabled={syncingId === item.midtrans_order_id}
                          className={styles.button}
                          style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px" }}
                        >
                          {syncingId === item.midtrans_order_id ? "Mengecek..." : "Cek ke Midtrans"}
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

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Pembayaran Paket dari Landing Page</h2>
          {checkoutOrders.length === 0 ? <p>Belum ada checkout Midtrans.</p> : (
            <div className={styles.table}>
              {checkoutOrders.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div>
                    <strong>{item.package_name} · Rp {Number(item.amount).toLocaleString("id-ID")}</strong>
                    <p>{item.customer_name} · {item.customer_email} · {item.customer_phone}</p>
                    <p style={{ color: "#64748b", fontSize: 12 }}>{item.order_id}</p>
                  </div>
                  <div>
                    <strong style={{ color: item.status === "paid" ? "#15803d" : "#b45309" }}>
                      {item.status === "paid" ? "Dibayar" : item.status}
                      {item.payment_type ? ` · ${item.payment_type}` : ""}
                    </strong>
                    {item.status !== "paid" && (
                      <button
                        onClick={() => syncOrder(item.order_id)}
                        disabled={syncingId === item.order_id}
                        className={styles.button}
                        style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px" }}
                      >
                        {syncingId === item.order_id ? "Mengecek..." : "Cek ke Midtrans"}
                      </button>
                    )}
                    {(item.status === "pending" || item.status === "expire") && (
                      <a href={waFollowUpLink(item)} target="_blank" rel="noreferrer" className={styles.button} style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px", textAlign: "center", background: "#22c55e", color: "white" }}>
                        Follow Up WA
                      </a>
                    )}
                    {item.status === "paid" && item.provision_status && item.provision_status !== "completed" && (
                      <p style={{ color: "#b45309", fontSize: 12, marginTop: 4 }}>
                        Akun: {item.provision_status}{item.provision_error ? ` — ${item.provision_error}` : ""}
                      </p>
                    )}
                  </div>
                  <p className={styles.date}>{new Date(item.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
