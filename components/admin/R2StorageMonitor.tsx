"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toLocaleString("id-ID", { maximumFractionDigits: index >= 3 ? 2 : 1 })} ${units[index]}`;
}

export default function R2StorageMonitor() {
  const pathname = usePathname();
  const [usage, setUsage] = useState<{ objects: number; bytes: number; checkedAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/r2-usage", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal membaca R2.");
      setUsage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membaca R2.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pathname === "/admin") refresh();
  }, [pathname, refresh]);

  if (pathname !== "/admin") return null;

  return (
    <aside style={{ position: "fixed", right: 12, bottom: 12, zIndex: 50, width: "min(270px, calc(100vw - 24px))", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 13, boxShadow: "0 8px 24px rgba(15,23,42,.13)", padding: 12, fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".06em", color: "#64748b" }}>CLOUDFLARE R2</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginTop: 1 }}>Monitor Storage</div>
        </div>
        <button onClick={refresh} disabled={loading} style={{ border: "1px solid #dbe2ea", background: "#f8fafc", borderRadius: 7, padding: "5px 7px", cursor: loading ? "default" : "pointer", fontSize: 10, fontWeight: 700 }}>
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {error ? <div style={{ marginTop: 8, fontSize: 10, color: "#b91c1c" }}>{error}</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 9 }}>
          <div style={{ background: "#f8fafc", borderRadius: 9, padding: 8 }}>
            <div style={{ fontSize: 9, color: "#64748b" }}>Terpakai</div>
            <strong style={{ display: "block", marginTop: 2, fontSize: 14, color: "#0f172a" }}>{usage ? formatBytes(usage.bytes) : loading ? "..." : "-"}</strong>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 9, padding: 8 }}>
            <div style={{ fontSize: 9, color: "#64748b" }}>Total file</div>
            <strong style={{ display: "block", marginTop: 2, fontSize: 14, color: "#0f172a" }}>{usage ? usage.objects.toLocaleString("id-ID") : loading ? "..." : "-"}</strong>
          </div>
        </div>
      )}

      <div style={{ marginTop: 7, padding: "6px 8px", borderRadius: 8, background: "#f8fafc", fontSize: 9, lineHeight: 1.35, color: "#64748b" }}>
        <b style={{ color: "#334155" }}>Kapasitas maksimum: Tidak terbatas*</b><br />
        *R2 tidak membatasi kapasitas bucket; pemakaian di atas kuota gratis mengikuti billing Cloudflare.
      </div>

      {usage && <div style={{ marginTop: 6, fontSize: 8, color: "#94a3b8" }}>Dicek {new Date(usage.checkedAt).toLocaleString("id-ID")}</div>}
    </aside>
  );
}
