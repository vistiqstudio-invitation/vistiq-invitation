"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import styles from "@/styles/dashboard.module.css";
import { PAYMENT_PACKAGES } from "@/lib/paymentPackages";

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

type Reseller = {
  id: string;
  name: string;
  whatsapp?: string | null;
  package?: "reseller" | "reseller_brand" | null;
};
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
  package_id?: string | null;
  reseller_id?: string | null;
  order_source?: string | null;
  payment_type?: string | null;
  provision_status?: string | null;
  provision_error?: string | null;
  confirmed_at?: string | null;
  settlement_applied_at?: string | null;
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
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [confirmingTransactionId, setConfirmingTransactionId] = useState<string | null>(null);
  const [creatingManualOrder, setCreatingManualOrder] = useState(false);
  const [manualResellerId, setManualResellerId] = useState("");
  const [manualAmount, setManualAmount] = useState(String(PAYMENT_PACKAGES.reseller.amount));

  const fetchTransactions = async () => {
    const [{ data: tx }, { data: resellerData }, { data: clientData }, { data: checkoutData }] = await Promise.all([
      supabase.from("transactions").select("id, client_id, reseller_id, amount, commission, status, created_at, paid_at, available_at, payment_type, midtrans_order_id").order("created_at", { ascending: false }),
      supabase.from("resellers").select("id, name, whatsapp, package"),
      supabase.from("clients").select("id, name"),
      supabase.from("checkout_orders").select("id, order_id, package_id, package_name, amount, customer_name, customer_email, customer_phone, status, reseller_id, order_source, payment_type, provision_status, provision_error, confirmed_at, settlement_applied_at, created_at").order("created_at", { ascending: false }),
    ]);

    setTransactions(tx ?? []);
    setResellers(resellerData ?? []);
    setClients(clientData ?? []);
    setCheckoutOrders(checkoutData ?? []);
    setLoading(false);
  };

  const resellerName = (id?: string | null) => resellers.find((r) => r.id === id)?.name || "-";
  const clientName = (id?: string | null) => clients.find((c) => c.id === id)?.name || "Client";

  const selectedManualReseller = resellers.find((item) => item.id === manualResellerId);

  const packageLabel = (packageId?: string | null) => {
    if (packageId === "reseller-brand") return "Reseller Brand";
    if (packageId === "reseller") return "Reseller";
    return "Paket";
  };

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

  const createManualOrder = async () => {
    if (!manualResellerId) {
      alert("Pilih reseller terlebih dahulu.");
      return;
    }

    const amount = Number(manualAmount);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      alert("Nominal pembayaran harus berupa angka bulat lebih dari 0.");
      return;
    }

    setCreatingManualOrder(true);
    try {
      const response = await fetch("/api/admin/create-manual-package-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resellerId: manualResellerId, amount }),
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Gagal membuat order paket manual.");
        return;
      }

      setManualResellerId("");
      setManualAmount(String(PAYMENT_PACKAGES.reseller.amount));
      await fetchTransactions();
      alert(`Order ${result.orderId} dibuat sebagai pending. Konfirmasi setelah transfer benar-benar masuk.`);
    } finally {
      setCreatingManualOrder(false);
    }
  };

  const confirmPackagePayment = async (item: CheckoutOrder) => {
    if (!confirm(`Konfirmasi pembayaran ${item.package_name} dari ${item.customer_name}? Pastikan transfer sudah masuk.`)) return;

    setConfirmingOrderId(item.id);
    try {
      const { data, error } = await supabase.rpc("owner_confirm_package_payment", {
        p_checkout_order_id: item.id,
      });

      if (error) {
        alert(error.message || "Gagal mengonfirmasi pembayaran paket.");
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;
      alert(result?.already_paid ? "Pembayaran ini sudah pernah dikonfirmasi." : "Pembayaran berhasil dikonfirmasi dan dicatat sebagai omzet.");
      await fetchTransactions();
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const confirmClientPayment = async (item: Transaction) => {
    if (!confirm(`Konfirmasi pembayaran client ${clientName(item.client_id)}? Pastikan transfer sudah masuk.`)) return;

    setConfirmingTransactionId(item.id);
    try {
      const { data, error } = await supabase.rpc("owner_confirm_reseller_client_payment", {
        p_transaction_id: item.id,
      });

      if (error) {
        alert(error.message || "Gagal mengonfirmasi pembayaran client.");
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;
      alert(result?.already_paid
        ? "Pembayaran ini sudah pernah dikonfirmasi. Tidak ada saldo atau komisi tambahan."
        : "Pembayaran client berhasil dikonfirmasi. Saldo reseller ditahan selama 6 hari.");
      await fetchTransactions();
    } finally {
      setConfirmingTransactionId(null);
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
  const paidPackageOrders = checkoutOrders.filter((item) => item.status === "paid");
  const totalPackageRevenue = paidPackageOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalClientGrossSales = paidTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalOwnerOmzet = totalPackageRevenue + totalClientGrossSales;
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
            <p className={styles.subtitle}>Kelola pembayaran paket dan penjualan client reseller. Akun yang dibuat Admin Vistiq langsung Lunas dan masuk omzet; order manual akun lama tetap menunggu konfirmasi transfer.</p>
          </div>
          <button onClick={fetchTransactions} className={styles.button}>Refresh</button>
        </header>

        <section className={styles.stats}>
          <div className={styles.statCard}><span>Omzet Paket Lunas</span><strong>Rp {totalPackageRevenue.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Omzet Client Reseller</span><strong>Rp {totalClientGrossSales.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Total Omzet Owner</span><strong>Rp {totalOwnerOmzet.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Hak Reseller 80%</span><strong>Rp {totalResellerShare.toLocaleString("id-ID")}</strong></div>
          <div className={styles.statCard}><span>Fee Vistiq 20%</span><strong>Rp {totalPlatformFee.toLocaleString("id-ID")}</strong></div>
        </section>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Catat Order Paket Manual</h2>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b" }}>
            Gunakan untuk akun reseller yang sudah dibuat sebelumnya atau perpanjangan Reseller Brand. Order tetap pending sampai pembayaran dikonfirmasi.
          </p>
          <div className={styles.formGrid}>
            <select
              value={manualResellerId}
              onChange={(event) => {
                const nextId = event.target.value;
                const nextReseller = resellers.find((item) => item.id === nextId);
                setManualResellerId(nextId);
                setManualAmount(
                  nextReseller?.package === "reseller_brand"
                    ? String(PAYMENT_PACKAGES["reseller-brand"].amount)
                    : String(PAYMENT_PACKAGES.reseller.amount),
                );
              }}
              className={styles.input}
            >
              <option value="">Pilih reseller</option>
              {resellers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.package === "reseller_brand" ? "Reseller Brand" : "Reseller"}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              step="1"
              value={manualAmount}
              onChange={(event) => setManualAmount(event.target.value)}
              className={styles.input}
              placeholder="Nominal dibayar"
            />
          </div>
          {selectedManualReseller && (
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#475569" }}>
              Paket yang dicatat: {selectedManualReseller.package === "reseller_brand" ? "Reseller Brand (bulanan)" : "Reseller (sekali bayar)"}. Nominal dapat disesuaikan untuk histori harga lama.
            </p>
          )}
          <button onClick={createManualOrder} className={styles.button} disabled={creatingManualOrder} style={{ marginTop: 14 }}>
            {creatingManualOrder ? "Membuat order..." : "Buat Order Pending"}
          </button>
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
                      {item.status === "pending" && (
                        <button
                          onClick={() => confirmClientPayment(item)}
                          disabled={confirmingTransactionId === item.id}
                          className={styles.button}
                          style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px", background: "#15803d" }}
                        >
                          {confirmingTransactionId === item.id ? "Mengonfirmasi..." : "Pembayaran Sukses"}
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
          <h2 className={styles.sectionTitle}>Pembayaran Paket</h2>
          {checkoutOrders.length === 0 ? <p>Belum ada order paket.</p> : (
            <div className={styles.table}>
              {checkoutOrders.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div>
                    <strong>{item.package_name} · Rp {Number(item.amount).toLocaleString("id-ID")}</strong>
                    {item.order_source === "owner_manual" && (
                      <p style={{ color: item.payment_type === "admin_created" ? "#15803d" : "#1d4ed8", fontSize: 12 }}>
                        {item.payment_type === "admin_created"
                          ? `Dibuat Admin Vistiq · ${packageLabel(item.package_id)} · akun aktif & omzet tercatat`
                          : `Order manual Owner · ${packageLabel(item.package_id)} · akun sudah dibuat`}
                      </p>
                    )}
                    {item.reseller_id && <p>{resellerName(item.reseller_id)}</p>}
                    <p>{item.customer_name} · {item.customer_email} · {item.customer_phone}</p>
                    <p style={{ color: "#64748b", fontSize: 12 }}>{item.order_id}</p>
                    {item.status === "paid" && item.confirmed_at && (
                      <p style={{ color: "#15803d", fontSize: 12 }}>Dikonfirmasi {new Date(item.confirmed_at).toLocaleString("id-ID")}</p>
                    )}
                  </div>
                  <div>
                    <strong style={{ color: item.status === "paid" ? "#15803d" : "#b45309" }}>
                      {item.status === "paid" ? "LUNAS" : String(item.status).toUpperCase()}
                      {item.payment_type ? ` · ${item.payment_type}` : ""}
                    </strong>
                    {item.order_source === "owner_manual" && item.status === "pending" && (
                      <button
                        onClick={() => confirmPackagePayment(item)}
                        disabled={confirmingOrderId === item.id}
                        className={styles.button}
                        style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px", background: "#15803d" }}
                      >
                        {confirmingOrderId === item.id ? "Mengonfirmasi..." : "Pembayaran Sukses"}
                      </button>
                    )}
                    {item.order_source !== "owner_manual" && item.status !== "paid" && (
                      <button
                        onClick={() => syncOrder(item.order_id)}
                        disabled={syncingId === item.order_id}
                        className={styles.button}
                        style={{ display: "block", marginTop: 6, fontSize: 11, padding: "4px 10px" }}
                      >
                        {syncingId === item.order_id ? "Mengecek..." : "Cek ke Midtrans"}
                      </button>
                    )}
                    {item.order_source !== "owner_manual" && (item.status === "pending" || item.status === "expire") && (
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
