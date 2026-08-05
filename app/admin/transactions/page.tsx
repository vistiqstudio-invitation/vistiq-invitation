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
  const message = `Halo ${item.customer_name}, kami dari Vistiq Invitation. Pembayaran untuk ${item.package_name} (Rp ${Number(item.amount).toLocaleString("id-ID")}) masih menunggu konfirmasi. Yuk selesaikan pembayarannya supaya akun Anda bisa langsung aktif. Kalau ada kendala saat bayar, kabari kami di sini ya. Terima kasih!`;
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
];

type Transaction = {
  id: string;
  amount: number;
  commission: number;
  status?: string;
  reseller_id?: string | null;
  reseller_confirmed_at?: string | null;
  created_at: string;
};

type Reseller = {
  id: string;
  name: string;
};

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
  const [checkoutOrders, setCheckoutOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

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

    const { data: checkoutData, error: checkoutError } = await supabase
      .from("checkout_orders")
      .select("id, order_id, package_name, amount, customer_name, customer_email, customer_phone, status, payment_type, provision_status, provision_error, created_at")
      .order("created_at", { ascending: false });
    if (!checkoutError) setCheckoutOrders(checkoutData ?? []);

    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("transactions").update({ status }).eq("id", id);

    if (error) {
      alert(`Gagal mengubah status transaksi: ${error.message}`);
      return;
    }

    fetchTransactions();
  };

  const resellerName = (resellerId?: string | null) =>
    resellers.find((r) => r.id === resellerId)?.name || "-";

  const syncOrder = async (orderId: string) => {
    setSyncingId(orderId);
    try {
      await fetch(`/api/payments/status?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      await fetchTransactions();
    } finally {
      setSyncingId(null);
    }
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

      fetchTransactions();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Scoped to this page's own "reseller transactions" table - Omzet only
  // counts sales the owner has actually confirmed ("Dibayar"), and Komisi
  // is what's still outstanding (not yet paid to the reseller), matching
  // the same "paid = already settled" semantics as the reseller's own
  // dashboard ("Komisi Sudah Dibayar").
  const totalOmzet = transactions
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalKomisi = transactions
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + Number(item.commission || 0), 0);

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
                    {item.status !== "paid" && item.reseller_confirmed_at && (
                      <p style={{ color: "#0369a1", fontSize: 13 }}>
                        ✓ Reseller konfirmasi sudah bayar - {new Date(item.reseller_confirmed_at).toLocaleString("id-ID")}
                      </p>
                    )}
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

        <section className={styles.tableWrap}>
          <h2 className={styles.sectionTitle}>Pembayaran dari Landing Page</h2>
          {checkoutOrders.length === 0 ? (
            <p>Belum ada checkout Midtrans atau tabel checkout belum diaktifkan.</p>
          ) : (
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
                    {item.status === "pending" && (
                      <a
                        href={waFollowUpLink(item)}
                        target="_blank"
                        className={styles.button}
                        style={{
                          display: "block",
                          marginTop: 6,
                          fontSize: 11,
                          padding: "4px 10px",
                          textAlign: "center",
                          background: "#22c55e",
                          color: "white",
                        }}
                      >
                        Follow Up WA
                      </a>
                    )}
                    {item.status === "paid" && item.provision_status && item.provision_status !== "completed" && (
                      <p style={{ color: "#b45309", fontSize: 12, marginTop: 4 }}>
                        Akun: {item.provision_status}
                        {item.provision_error ? ` — ${item.provision_error}` : ""}
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
