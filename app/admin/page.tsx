"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import StorageCleanup from "@/components/admin/StorageCleanup";
import ResellerActivity, { type DashboardClient, type DashboardReseller, type DashboardInvitation } from "@/components/admin/ResellerActivity";
import SystemStatus from "@/components/admin/SystemStatus";
import ChangePasswordCard from "@/components/dashboard/ChangePasswordCard";
import styles from "@/styles/dashboard.module.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "clients", label: "Client", href: "/admin/clients" },
  { key: "resellers", label: "Reseller", href: "/admin/resellers" },
  { key: "affiliates", label: "Affiliate", href: "/admin/affiliates" },
  { key: "invitations", label: "Undangan", href: "/admin/invitations" },
  { key: "marketing-kit", label: "Marketing Kit", href: "/admin/marketing-kit" },
  { key: "musik", label: "Musik", href: "/admin/musik" },
  { key: "rsvp", label: "RSVP", href: "/admin/rsvp" },
  { key: "transactions", label: "Transaksi", href: "/admin/transactions" },
];

type AppUser = {
  id: string;
  role: "owner" | "reseller" | "client";
  name: string;
  email: string;
  whatsapp?: string;
  created_at: string;
};

type Transaction = {
  id: string;
  reseller_id?: string | null;
  amount: number;
  commission: number;
  status?: string;
  paid_at?: string | null;
  created_at: string;
  transaction_type?: "legacy_client_sale" | "invitation_activation";
};

type CheckoutOrder = {
  id: string;
  package_id?: string | null;
  package_name?: string | null;
  amount: number;
  status: string;
};

type AffiliateCommission = {
  id: string;
  commission_amount: number;
  status: string;
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AppUser | null>(null);
  const [clients, setClients] = useState<DashboardClient[]>([]);
  const [resellers, setResellers] = useState<DashboardReseller[]>([]);
  const [invitations, setInvitations] = useState<DashboardInvitation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [checkoutOrders, setCheckoutOrders] = useState<CheckoutOrder[]>([]);
  const [affiliateCommissions, setAffiliateCommissions] = useState<AffiliateCommission[]>([]);
  const [resellerDataUnavailable, setResellerDataUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dashboardError, setDashboardError] = useState(false);
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string>("");
  const [verifyRunning, setVerifyRunning] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string>("");
  const [logoMigrationRunning, setLogoMigrationRunning] = useState(false);
  const [logoMigrationResult, setLogoMigrationResult] = useState<string>("");

  const supabaseFetch = async (table: string) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setDashboardError(true);
      return [];
    }

    return data ?? [];
  };

  const fetchDirectory = async <Row,>(table: string, columns: string): Promise<Row[] | null> => {
    const pageSize = 500;
    const rows: Row[] = [];
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .order("id")
        .range(offset, offset + pageSize - 1)
        .returns<Row[]>();

      if (error) {
        console.error(error);
        setDashboardError(true);
        return null;
      }

      rows.push(...data);
      if (data.length < pageSize) return rows;
    }
  };

  const fetchDashboard = async () => {
    setDashboardError(false);

    try {
      const [
        clientsData,
        resellersData,
        invitationsData,
        transactionsData,
        checkoutOrdersData,
        affiliateCommissionsData,
      ] = await Promise.all([
        fetchDirectory<DashboardClient>("clients", "id, name, email, status, reseller_id"),
        fetchDirectory<DashboardReseller>("resellers", "id, name, brand_name, package"),
        fetchDirectory<DashboardInvitation>("invitations", "id, client_id, slug, category, baby_name, groom_name, bride_name, is_active"),
        supabaseFetch("transactions"),
        supabaseFetch("checkout_orders"),
        supabaseFetch("affiliate_commissions"),
      ]);

      setClients(clientsData ?? []);
      setResellers(resellersData ?? []);
      setInvitations(invitationsData ?? []);
      setResellerDataUnavailable(!clientsData || !resellersData || !invitationsData);
      setTransactions(transactionsData);
      setCheckoutOrders(checkoutOrdersData);
      setAffiliateCommissions(affiliateCommissionsData);
    } catch (err) {
      console.error(err);
      setDashboardError(true);
      setResellerDataUnavailable(true);
    }

    setLoading(false);
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
        .select("role, name, whatsapp")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "owner") {
        router.push("/login");
        return;
      }

      setUser({
        id: authUser.id,
        role: profile.role,
        name: profile.name || "Owner",
        email: authUser.email || "",
        whatsapp: profile.whatsapp,
        created_at: authUser.created_at,
      });
      fetchDashboard();
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const runMediaMigration = async () => {
    if (migrationRunning) return;
    if (!window.confirm("Mulai menyalin media undangan aktif dari Supabase ke Cloudflare R2 secara bertahap? File lama tidak akan dihapus dan database belum akan diubah.")) return;
    setMigrationRunning(true);
    let offset = 0, copied = 0, existing = 0, failed = 0, total = 0;
    try {
      while (true) {
        const response = await fetch("/api/admin/media-migration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
        });
        const text = await response.text();
        let result: any;
        try { result = JSON.parse(text); } catch { throw new Error(text.slice(0, 180) || "Respons server tidak valid."); }
        if (!response.ok) throw new Error(result.error || "Migrasi gagal dijalankan.");
        total = result.total || total;
        copied += result.copied || 0;
        existing += result.existing || 0;
        failed += result.failed?.length || 0;
        offset = result.nextOffset || offset;
        setMigrationResult(`Progress ${Math.min(offset, total)} / ${total}. Disalin ${copied}, sudah ada ${existing}, gagal ${failed}.`);
        if (result.done) break;
      }
      setMigrationResult(`Selesai. Total ${total}, disalin ${copied}, sudah ada ${existing}, gagal ${failed}.`);
    } catch (error) {
      setMigrationResult(error instanceof Error ? `Terhenti di ${offset} / ${total || "?"}: ${error.message}` : "Migrasi gagal dijalankan.");
    } finally {
      setMigrationRunning(false);
    }
  };

  const runMediaVerification = async () => {
    if (verifyRunning) return;
    setVerifyRunning(true);
    let offset = 0, verified = 0, failed = 0, total = 0;
    try {
      while (true) {
        const response = await fetch("/api/admin/media-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offset }),
        });
        const text = await response.text();
        let result: any;
        try { result = JSON.parse(text); } catch { throw new Error(text.slice(0, 180) || "Respons server tidak valid."); }
        if (!response.ok) throw new Error(result.error || "Verifikasi gagal dijalankan.");
        total = result.total || total;
        verified += result.verified || 0;
        failed += result.failed?.length || 0;
        offset = result.nextOffset || offset;
        setVerifyResult(`Progress ${Math.min(offset, total)} / ${total}. Terverifikasi ${verified}, gagal ${failed}.`);
        if (result.done) break;
      }
      setVerifyResult(`Verifikasi selesai. Total ${total}, OK ${verified}, gagal ${failed}.`);
    } catch (error) {
      setVerifyResult(error instanceof Error ? `Terhenti di ${offset} / ${total || "?"}: ${error.message}` : "Verifikasi gagal dijalankan.");
    } finally {
      setVerifyRunning(false);
    }
  };

  const runLogoMigration = async () => {
    if (logoMigrationRunning) return;
    if (!window.confirm("Migrasikan logo reseller dari Supabase ke Cloudflare R2? File lama Supabase tidak akan dihapus.")) return;
    setLogoMigrationRunning(true);
    setLogoMigrationResult("Memproses logo reseller...");
    try {
      const response = await fetch("/api/admin/logo-migration", { method: "POST" });
      const text = await response.text();
      let result: any;
      try { result = JSON.parse(text); } catch { throw new Error(text.slice(0, 180) || "Respons server tidak valid."); }
      if (!response.ok) throw new Error(result.error || "Migrasi logo gagal.");
      setLogoMigrationResult(`Selesai. Total ${result.total}, disalin ${result.copied}, sudah ada ${result.existing}, URL diperbarui ${result.updated}, gagal ${result.failed?.length || 0}.`);
    } catch (error) {
      setLogoMigrationResult(error instanceof Error ? `Migrasi logo gagal: ${error.message}` : "Migrasi logo gagal.");
    } finally {
      setLogoMigrationRunning(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const resellerById = new Map(resellers.map((item) => [item.id, item]));

  const isBrandResellerTransaction = (item: Transaction) => {
    if (!item.reseller_id) return false;
    const reseller = resellerById.get(item.reseller_id);
    return reseller?.package === "reseller_brand";
  };

  // Aturan omzet Vistiq:
  // 1. Pembayaran paket yang benar-benar paid masuk 100% sebagai omzet
  //    (Reseller sekali bayar, Mitra Brand langganan bulanan, dan paket
  //    direct-client bila ada). Nilai yang dipakai adalah amount transaksi
  //    aktual, sehingga histori harga lama tetap tercatat sesuai pembayaran.
  // 2. Penjualan sistem lama tetap mengikuti pembagian historisnya.
  // 3. Pembayaran aktivasi Rp20.000 sistem baru masuk penuh sebagai omzet
  //    Vistiq dan tidak menghasilkan komisi reseller.
  const paidStandardResellerSales = transactions.filter(
    (item) => item.status === "paid"
      && item.transaction_type !== "invitation_activation"
      && !isBrandResellerTransaction(item),
  );
  const paidInvitationActivations = transactions.filter(
    (item) => item.status === "paid" && item.transaction_type === "invitation_activation",
  );

  const packageRevenue = checkoutOrders
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const regularResellerGrossSales = paidStandardResellerSales.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const invitationActivationRevenue = paidInvitationActivations.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const totalOmzet = packageRevenue + regularResellerGrossSales + invitationActivationRevenue;

  // Komisi reseller hanya lahir dari penjualan undangan Reseller standar yang
  // sudah dibayar client. Transaksi pending belum menjadi omzet/komisi. Komisi
  // affiliate yang masih menjadi kewajiban tetap digabung ke kartu total
  // komisi; penjualan Mitra Brand tidak pernah menghasilkan komisi Vistiq.
  const resellerCommission = paidStandardResellerSales.reduce(
    (sum, item) => sum + Number(item.commission || 0),
    0,
  );

  const outstandingAffiliateCommission = affiliateCommissions
    .filter((item) => item.status !== "paid" && item.status !== "cancelled")
    .reduce((sum, item) => sum + Number(item.commission_amount || 0), 0);

  const totalKomisi = resellerCommission + outstandingAffiliateCommission;

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Invitation"
        items={NAV_ITEMS}
        activeKey="dashboard"
        notificationRole="owner"
        onLogout={logout}
      />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>OWNER DASHBOARD</p>
            <h1 className={styles.title}>Halo, {user?.name || "Owner"}</h1>
            <p className={styles.subtitle}>
              Pantau klien, reseller, undangan, dan transaksi.
            </p>
          </div>

          <div className={styles.actions}>
            <button onClick={fetchDashboard} className={styles.button}>
              Refresh
            </button>
          </div>
        </header>

        {loading ? (
          <p>Memuat dashboard...</p>
        ) : (
          <>
            {dashboardError && (
              <section className={styles.warningBox}>
                <h2>Sebagian data gagal dimuat.</h2>
                <p>
                  Terjadi gangguan koneksi ke server, jadi data di bawah ini
                  bisa jadi tidak lengkap. Klik tombol Refresh di atas untuk
                  mencoba lagi.
                </p>
              </section>
            )}

            <section className={styles.stats}>
              <StatCard title="Total Client" value={clients.length} />
              <StatCard title="Total Reseller" value={resellers.length} />
              <StatCard title="Total Undangan" value={invitations.length} />
              <StatCard
                title="Total Omzet"
                value={`Rp ${totalOmzet.toLocaleString("id-ID")}`}
              />
              <StatCard
                title="Aktivasi Undangan"
                value={`Rp ${invitationActivationRevenue.toLocaleString("id-ID")}`}
              />
              <StatCard
                title="Total Komisi"
                value={`Rp ${totalKomisi.toLocaleString("id-ID")}`}
              />
            </section>

            <ResellerActivity
              clients={clients}
              resellers={resellers}
              invitations={invitations}
              unavailable={resellerDataUnavailable}
            />

            <SystemStatus />

            <section className={styles.generatorCard}>
              <h2 className={styles.sectionTitle}>Migrasi Media ke Cloudflare R2</h2>
              <p>Salin dan verifikasi media undangan aktif, lalu periksa salinan sumber yang siap dibersihkan.</p>
              <div className={styles.generatorWrap}>
                <button onClick={runMediaMigration} className={styles.button} disabled={migrationRunning}>
                  {migrationRunning ? "Sedang Migrasi..." : "Mulai Migrasi ke R2"}
                </button>
              </div>
              {migrationResult && <div className={styles.linkBox}>{migrationResult}</div>}
              <div className={styles.generatorWrap}>
                <button onClick={runMediaVerification} className={styles.exportButton} disabled={verifyRunning || migrationRunning}>
                  {verifyRunning ? "Sedang Verifikasi..." : "Verifikasi media R2"}
                </button>
              </div>
              {verifyResult && <div className={styles.linkBox}>{verifyResult}</div>}
              <div className={styles.generatorWrap}>
                <button onClick={runLogoMigration} className={styles.button} disabled={logoMigrationRunning || migrationRunning || verifyRunning}>
                  {logoMigrationRunning ? "Sedang Migrasi Logo..." : "Migrasi logo reseller ke R2"}
                </button>
              </div>
              {logoMigrationResult && <div className={styles.linkBox}>{logoMigrationResult}</div>}
              <StorageCleanup disabled={migrationRunning || verifyRunning || logoMigrationRunning} />
            </section>

            <ChangePasswordCard />
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className={styles.statCard}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}
