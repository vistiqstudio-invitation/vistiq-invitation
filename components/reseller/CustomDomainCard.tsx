"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/dashboard.module.css";

type DomainResult = {
  domain: string | null;
  status: "not_configured" | "pending_dns" | "active";
  verified?: boolean;
  configured?: boolean;
  dns?: { type: "A" | "CNAME"; name: string; value: string };
  verification?: Array<{ type?: string; domain?: string; value?: string; reason?: string }>;
  error?: string;
};

export default function CustomDomainCard({ initialDomain }: { initialDomain?: string | null }) {
  const [domain, setDomain] = useState(initialDomain || "");
  const [result, setResult] = useState<DomainResult | null>(null);
  const [loading, setLoading] = useState(Boolean(initialDomain));

  const request = async (method: string, body?: object) => {
    setLoading(true);
    const response = await fetch("/api/reseller/custom-domain", {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      alert(data.error || "Proses domain gagal.");
      return null;
    }
    setResult(data);
    if (data.domain) setDomain(data.domain);
    return data;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- status is synchronized from the external Vercel API
    if (initialDomain) request("GET");
  }, [initialDomain]);

  const remove = async () => {
    if (!confirm(`Hapus ${domain} dari brand Anda?`)) return;
    const data = await request("DELETE");
    if (data) {
      setDomain("");
      setResult({ domain: null, status: "not_configured" });
    }
  };

  const active = result?.status === "active";

  return (
    <section className={styles.formCard}>
      <h2 className={styles.sectionTitle}>Custom Domain</h2>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>
        Hubungkan domain milik Anda. Setelah DNS aktif, domain akan membuka landing page,
        halaman login, dan link undangan menggunakan alamat brand Anda sendiri.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          className={styles.input}
          style={{ flex: "1 1 260px" }}
          placeholder="contoh: elovainvitation.com"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          disabled={loading || active}
        />
        {!active && (
          <button className={styles.button} disabled={loading || !domain.trim()} onClick={() => request("POST", { domain })}>
            {loading ? "Memproses..." : initialDomain || result?.domain ? "Simpan Ulang" : "Hubungkan Domain"}
          </button>
        )}
      </div>

      {result?.domain && (
        <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: active ? "#f0fdf4" : "#fffbeb", border: `1px solid ${active ? "#bbf7d0" : "#fde68a"}` }}>
          <p style={{ margin: 0, fontWeight: 800, color: active ? "#15803d" : "#b45309" }}>
            {active ? "Domain Aktif" : "Menunggu Pengaturan DNS"}
          </p>
          {active ? (
            <p style={{ margin: "8px 0 0", fontSize: 13.5 }}>
              Domain siap digunakan: <a href={`https://${result.domain}`} target="_blank" style={{ color: "#1167b2", fontWeight: 700 }}>https://{result.domain}</a>
            </p>
          ) : result.dns ? (
            <div style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 8px" }}>Tambahkan record berikut di tempat Anda membeli domain:</p>
              <div className={styles.linkBox}>
                Tipe: {result.dns.type}<br />Nama/Host: {result.dns.name}<br />Nilai/Target: {result.dns.value}
              </div>
              {result.verification?.map((item, index) => item.value ? (
                <div className={styles.linkBox} style={{ marginTop: 8 }} key={`${item.domain}-${index}`}>
                  Verifikasi {item.type || "TXT"}: {item.domain || "_vercel"}<br />Nilai: {item.value}
                </div>
              ) : null)}
              <p style={{ margin: "10px 0 0", color: "#92400e" }}>Perubahan DNS dapat membutuhkan waktu beberapa menit hingga 24 jam.</p>
            </div>
          ) : null}
        </div>
      )}

      {result?.domain && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {!active && <button className={styles.button} disabled={loading} onClick={() => request("POST", { action: "check" })}>Periksa Domain</button>}
          <button className={styles.button} disabled={loading} onClick={remove} style={{ background: "#fff", color: "#dc2626", border: "1px solid #fecaca" }}>Hapus Domain</button>
        </div>
      )}
    </section>
  );
}
