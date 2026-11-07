"use client";

import { useState } from "react";
import styles from "@/styles/dashboard.module.css";

type DomainResult = {
  domain: string | null;
  status: "not_configured" | "pending_dns" | "active";
  verified?: boolean;
  configured?: boolean;
  dns?: { type: "CNAME"; name: string; value: string };
  verification?: Array<{ type?: string; name?: string; value?: string }>;
  hostnameStatus?: string;
  certificateStatus?: string;
  routingReady?: boolean;
  error?: string;
};

function domainErrorMessage(message: unknown, fallback: string) {
  if (typeof message !== "string" || !message.trim()) return fallback;
  if (/VERCEL_|CLOUDFLARE_|SUPABASE_|API.?TOKEN|PROJECT.?ID|SERVICE.?ROLE|konfigurasi|configuration/i.test(message)) {
    return "Layanan pengaturan domain sedang disiapkan admin. Anda tetap dapat menggunakan alamat Vistiq atau subdomain yang sudah terpasang.";
  }
  return message;
}

export default function CustomDomainCard({
  initialDomain,
  initialSubdomain,
}: {
  initialDomain?: string | null;
  initialSubdomain?: string | null;
}) {
  const [domain, setDomain] = useState(initialDomain || "");
  const [result, setResult] = useState<DomainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [subdomainError, setSubdomainError] = useState("");
  const [subdomainNotice, setSubdomainNotice] = useState("");
  const [subdomain, setSubdomain] = useState(initialSubdomain || "");
  const [hasSubdomain, setHasSubdomain] = useState(Boolean(initialSubdomain));
  const [subdomainLoading, setSubdomainLoading] = useState(false);
  const [availability, setAvailability] = useState<null | "available" | "unavailable">(null);

  const request = async (method: string, body?: object) => {
    setLoading(true);
    setDomainError("");
    try {
      const response = await fetch("/api/reseller/custom-domain", {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (!response.ok) {
        setDomainError(domainErrorMessage(data.error, "Pengaturan domain belum dapat diproses. Silakan coba lagi atau hubungi admin."));
        return null;
      }
      setResult(data);
      if (data.domain) setDomain(data.domain);
      return data;
    } catch {
      setDomainError("Koneksi terputus. Periksa internet dan coba lagi.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Domain checks are manual while custom-domain setup is deferred.
  // Opening the reseller dashboard must not call the domain provider.

  const remove = async () => {
    if (!confirm(`Lepaskan ${domain} dari dashboard? Link undangan lama mungkin tidak dapat dibuka melalui domain ini. Lanjutkan?`)) return;
    const data = await request("DELETE");
    if (data) {
      setDomain("");
      setResult({ domain: null, status: "not_configured" });
    }
  };

  const active = result?.status === "active";
  const savedDomain = result ? result.domain : initialDomain;

  const subdomainRequest = async (action: "check" | "activate") => {
    setSubdomainLoading(true);
    setAvailability(null);
    setSubdomainError("");
    setSubdomainNotice("");
    try {
      const response = await fetch("/api/reseller/subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, subdomain }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubdomainError(domainErrorMessage(data.error, "Pengaturan subdomain belum dapat diproses. Silakan coba lagi atau hubungi admin."));
        return;
      }
      setSubdomain(data.subdomain);
      setAvailability("available");
      if (action === "activate") {
        setHasSubdomain(true);
        setSubdomainNotice(`Subdomain https://${data.hostname} berhasil diaktifkan.`);
      }
    } catch {
      setSubdomainError("Koneksi terputus. Periksa internet dan coba lagi.");
    } finally {
      setSubdomainLoading(false);
    }
  };

  const removeSubdomain = async () => {
    if (!confirm(`Hapus ${subdomain}.vistiqinvitation.com dari brand Anda?`)) return;
    setSubdomainLoading(true);
    setSubdomainError("");
    setSubdomainNotice("");
    try {
      const response = await fetch("/api/reseller/subdomain", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setSubdomainError(domainErrorMessage(data.error, "Subdomain belum dapat dilepaskan. Silakan coba lagi atau hubungi admin."));
        return;
      }
      setSubdomain("");
      setHasSubdomain(false);
      setAvailability(null);
      setSubdomainNotice("Subdomain berhasil dilepaskan.");
    } catch {
      setSubdomainError("Koneksi terputus. Periksa internet dan coba lagi.");
    } finally {
      setSubdomainLoading(false);
    }
  };

  return (
    <section className={styles.formCard}>
      <h2 className={styles.sectionTitle}>Domain Brand</h2>
      <div style={{ padding: 16, border: "1px solid #bfdbfe", borderRadius: 12, background: "#eff6ff", marginBottom: 22 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1e40af" }}>Subdomain Gratis</h3>
        <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "#475569", lineHeight: 1.7 }}>
          Pilih alamat brand gratis. Subdomain aktif otomatis tanpa membeli domain atau mengatur DNS.
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flex: "1 1 300px", alignItems: "center" }}>
            <input
              className={styles.input}
              style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              placeholder="elova"
              value={subdomain}
              onChange={(event) => {
                setSubdomain(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                setAvailability(null);
              }}
              disabled={subdomainLoading || hasSubdomain}
            />
            <span style={{ padding: "10px 12px", background: "#fff", border: "1px solid #cbd5e1", borderLeft: 0, borderRadius: "0 8px 8px 0", color: "#475569", fontSize: 13 }}>
              .vistiqinvitation.com
            </span>
          </div>
          {!hasSubdomain && (
            <>
              <button className={styles.button} disabled={subdomainLoading || subdomain.length < 3} onClick={() => subdomainRequest("check")}>
                Periksa Nama
              </button>
              <button className={styles.button} disabled={subdomainLoading || subdomain.length < 3} onClick={() => subdomainRequest("activate")}>
                {subdomainLoading ? "Memproses..." : "Aktifkan"}
              </button>
            </>
          )}
        </div>
        {subdomainError && <p role="alert" style={{ color: "#b91c1c", fontSize: 13.5, marginTop: 12 }}>{subdomainError}</p>}
        {subdomainNotice && <p role="status" style={{ color: "#15803d", fontSize: 13.5, marginTop: 12 }}>{subdomainNotice}</p>}
        {availability === "available" && !hasSubdomain && (
          <p style={{ margin: "10px 0 0", color: "#15803d", fontWeight: 700, fontSize: 13.5 }}>Nama tersedia dan dapat diaktifkan.</p>
        )}
        {hasSubdomain && (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: "0 0 10px", color: "#15803d", fontWeight: 700, fontSize: 13.5 }}>
              Aktif: <a href={`https://${subdomain}.vistiqinvitation.com`} target="_blank" style={{ color: "#1167b2" }}>https://{subdomain}.vistiqinvitation.com</a>
            </p>
            <button className={styles.button} disabled={subdomainLoading} onClick={removeSubdomain} style={{ background: "#fff", color: "#dc2626", border: "1px solid #fecaca" }}>
              Hapus Subdomain
            </button>
          </div>
        )}
      </div>

      <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Custom Domain Milik Sendiri</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>
        Pemasangan custom domain sementara ditunda. Gunakan alamat Vistiq atau subdomain
        gratis untuk aktivitas Anda. Domain yang sudah tersimpan hanya diperiksa saat
        Anda menekan tombol Periksa Domain.
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
            {loading ? "Memproses..." : initialDomain || result?.domain ? "Simpan / Perbarui" : "Hubungkan Domain"}
          </button>
        )}
      </div>

      {domainError && <p role="alert" style={{ color: "#b91c1c", fontSize: 13.5, marginTop: 12 }}>{domainError}</p>}

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
              <p style={{ margin: "0 0 8px" }}>Salin pengaturan ini ke pengelola DNS domain Anda (bukan selalu tempat membeli domain):</p>
              <div className={styles.linkBox}>
                Tipe: {result.dns.type}<br />Nama/Host: {result.dns.name}<br />Nilai/Target: {result.dns.value}
                <button type="button" style={{ marginLeft: 8 }} onClick={() => navigator.clipboard.writeText(result.dns!.value)}>Salin target</button>
              </div>
              <p style={{ margin: "8px 0 0" }}>Domain utama (@) membutuhkan dukungan CNAME flattening atau ALIAS/ANAME dari penyedia DNS. Jika memakai Cloudflare DNS, gunakan CNAME untuk @ dan periksa record lama yang bentrok.</p>
              {result.verification?.map((item, index) => item.value ? (
                <div className={styles.linkBox} style={{ marginTop: 8 }} key={`${item.name}-${index}`}>
                  Verifikasi {item.type || "TXT"}: {item.name || "@"}<br />Nilai: {item.value}
                  <button type="button" style={{ marginLeft: 8 }} onClick={() => navigator.clipboard.writeText(item.value!)}>Salin nilai</button>
                </div>
              ) : null)}
              <p style={{ margin: "10px 0 0", color: "#92400e" }}>Status Cloudflare: {result.hostnameStatus || "pending"}; SSL: {result.certificateStatus || "pending"}. DNS dan sertifikat dapat memerlukan waktu propagasi. Status aktif hanya diberikan setelah koneksi aplikasi diverifikasi.</p>
            </div>
          ) : null}
        </div>
      )}

      {savedDomain && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className={styles.button} disabled={loading} onClick={() => request("GET")}>{loading ? "Memeriksa..." : "Periksa Domain"}</button>
          <button className={styles.button} disabled={loading} onClick={remove} style={{ background: "#fff", color: "#dc2626", border: "1px solid #fecaca" }}>Lepaskan Domain</button>
        </div>
      )}
    </section>
  );
}
