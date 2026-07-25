"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import styles from "@/styles/dashboard.module.css";

const NAV = [
  { key: "dashboard", label: "Dashboard", href: "/affiliate" },
];

type Affiliate = {
  id: string;
  name: string;
  referral_code: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
};

type Commission = {
  id: string;
  order_id: string;
  package_id: string;
  sale_amount: number;
  commission_amount: number;
  status: string;
  available_at: string;
  created_at: string;
};

type ReferralLink = {
  key: string;
  title: string;
  description: string;
  url: string;
};

export default function AffiliatePage() {
  const router = useRouter();
  const supabase = createClient();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [form, setForm] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const load = async () => {
    await supabase.rpc("refresh_affiliate_commissions");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: affiliateData } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!affiliateData) return;

    setAffiliate(affiliateData);
    setForm({
      bank_name: affiliateData.bank_name || "",
      account_number: affiliateData.account_number || "",
      account_name: affiliateData.account_name || "",
    });

    const { data: commissionData } = await supabase
      .from("affiliate_commissions")
      .select("*")
      .eq("affiliate_id", affiliateData.id)
      .order("created_at", { ascending: false });
    setCommissions(commissionData ?? []);
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const available = commissions
    .filter((item) => item.status === "available")
    .reduce((total, item) => total + Number(item.commission_amount), 0);
  const held = commissions
    .filter((item) => item.status === "held")
    .reduce((total, item) => total + Number(item.commission_amount), 0);
  const paid = commissions
    .filter((item) => item.status === "paid")
    .reduce((total, item) => total + Number(item.commission_amount), 0);

  const code = affiliate?.referral_code ?? "";
  const referralLinks: ReferralLink[] = code
    ? [
        {
          key: "all",
          title: "Link Referral Utama",
          description:
            "Berisi pilihan paket Client, Reseller, dan Reseller Brand.",
          url: `https://www.vistiqinvitation.com/pilih-paket?ref=${code}`,
        },
      ]
    : [];

  const copyLink = async (item: ReferralLink) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedKey(item.key);
      window.setTimeout(() => {
        setCopiedKey((current) =>
          current === item.key ? null : current,
        );
      }, 2000);
    } catch {
      alert("Link belum berhasil disalin. Silakan coba kembali.");
    }
  };

  const saveBank = async () => {
    if (!affiliate) return;
    const { error } = await supabase
      .from("affiliates")
      .update(form)
      .eq("id", affiliate.id);
    if (error) return alert(error.message);
    alert("Data rekening tersimpan.");
  };

  const withdraw = async () => {
    if (available < 100000) {
      return alert("Saldo tersedia belum mencapai Rp100.000.");
    }
    if (!form.bank_name || !form.account_number || !form.account_name) {
      return alert("Lengkapi data rekening dahulu.");
    }

    const response = await fetch("/api/affiliate/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if (!response.ok) {
      return alert(result.error || "Permintaan gagal.");
    }
    alert("Permintaan pencairan berhasil dikirim.");
    load();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar
        brandTop="VISTIQ"
        brandBottom="Affiliate"
        items={NAV}
        activeKey="dashboard"
        onLogout={logout}
      />
      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>AFFILIATE DASHBOARD</p>
            <h1 className={styles.title}>
              Halo, {affiliate?.name || "Affiliate"}
            </h1>
            <p className={styles.subtitle}>
              Bagikan satu link referral dan pantau komisi 30%.
            </p>
          </div>
          <button className={styles.button} onClick={load}>
            Refresh
          </button>
        </header>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Link Referral Anda</h2>
          <p className={styles.subtitle}>
            Bagikan link ini kepada calon pembeli. Mereka akan memilih satu
            dari tiga paket yang tersedia.
          </p>
          <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
            {referralLinks.map((item) => (
              <div
                key={item.key}
                style={{
                  padding: 18,
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <button
                    className={
                      item.key === "all"
                        ? styles.button
                        : styles.secondaryButton
                    }
                    onClick={() => copyLink(item)}
                  >
                    {copiedKey === item.key
                      ? "✓ Berhasil Disalin"
                      : "Salin Link"}
                  </button>
                </div>
                <div
                  className={styles.linkBox}
                  style={{ marginTop: 12 }}
                >
                  {item.url}
                </div>
              </div>
            ))}
            {!affiliate && (
              <p className={styles.subtitle}>
                Memuat link referral Anda...
              </p>
            )}
          </div>
        </section>

        <section className={styles.stats}>
          <Card title="Komisi Ditahan" value={held} />
          <Card title="Saldo Tersedia" value={available} />
          <Card title="Sudah Dicairkan" value={paid} />
          <Card title="Total Transaksi" value={commissions.length} />
        </section>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Rekening Pencairan</h2>
          <div className={styles.form}>
            <input
              className={styles.input}
              placeholder="Nama bank / e-wallet"
              value={form.bank_name}
              onChange={(event) =>
                setForm({ ...form, bank_name: event.target.value })
              }
            />
            <input
              className={styles.input}
              placeholder="Nomor rekening"
              value={form.account_number}
              onChange={(event) =>
                setForm({
                  ...form,
                  account_number: event.target.value,
                })
              }
            />
            <input
              className={styles.input}
              placeholder="Nama pemilik rekening"
              value={form.account_name}
              onChange={(event) =>
                setForm({ ...form, account_name: event.target.value })
              }
            />
            <div className={styles.actions}>
              <button
                className={styles.exportButton}
                onClick={saveBank}
              >
                Simpan Rekening
              </button>
              <button className={styles.button} onClick={withdraw}>
                Ajukan Pencairan
              </button>
            </div>
          </div>
          <p className={styles.subtitle}>
            Minimal pencairan Rp100.000. Komisi tersedia 7 hari setelah
            pembayaran berhasil.
          </p>
        </section>

        <section className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Riwayat Komisi</h2>
          {commissions.length === 0 ? (
            <p>Belum ada transaksi dari link Anda.</p>
          ) : (
            commissions.map((commission) => (
              <div
                key={commission.id}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <b>{commission.order_id}</b>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#64748b",
                  }}
                >
                  {commission.package_id} · Penjualan Rp{" "}
                  {Number(commission.sale_amount).toLocaleString(
                    "id-ID",
                  )}{" "}
                  · Komisi Rp{" "}
                  {Number(commission.commission_amount).toLocaleString(
                    "id-ID",
                  )}{" "}
                  · {commission.status}
                </p>
              </div>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className={styles.statCard}>
      <p>{title}</p>
      <h2>
        {title === "Total Transaksi"
          ? value
          : `Rp ${value.toLocaleString("id-ID")}`}
      </h2>
    </div>
  );
}
