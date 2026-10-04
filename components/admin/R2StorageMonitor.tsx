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
    <aside style={{ position: "fixed", right: 12, bottom: 82, zIndex: 50, width: "min(250px, calc(100vw - 24px))", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,.12)", padding: 10, fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".06em", color: "#64748b" }}>CLOUDFLARE R2</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginTop: 1 }}>Monitor Storage</div>
        </div>
        <button onClick={refresh} disabled={loading} style={{ border: "1px solid #dbe2ea", background: "#f8fafc", borderRadius: 7, padding: "4px 6px", cursor: loading ? "default" : "pointer", fontSize: 9, fontWeight: 700 }}>
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {error ? <div style={{ marginTop: 7, fontSize: 9, color: "#b91c1c" }}>{error}</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 7 }}>
            <div style={{ fontSize: 8, color: "#64748b" }}>Terpakai</div>
            <strong style={{ display: "block", marginTop: 2, fontSize: 13, color: "#0f172a" }}>{usage ? formatBytes(usage.bytes) : loading ? "..." : "-"}</strong>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 7 }}>
            <div style={{ fontSize: 8, color: "#64748b" }}>Total file</div>
            <strong style={{ display: "block", marginTop: 2, fontSize: 13, color: "#0f172a" }}>{usage ? usage.objects.toLocaleString("id-ID") : loading ? "..." : "-"}</strong>
          </div>
        </div>
      )}

      <div style={{ marginTop: 6, padding: "5px 7px", borderRadius: 7, background: "#f8fafc", fontSize: 8, lineHeight: 1.3, color: "#64748b" }}>
        <b style={{ color: "#334155" }}>Gratis 10 GB · Kapasitas tidak terbatas</b><br />
        Pemakaian di atas 10 GB mengikuti billing Cloudflare.
      </div>

      {usage && <div style={{ marginTop: 5, fontSize: 7, color: "#94a3b8" }}>Dicek {new Date(usage.checkedAt).toLocaleString("id-ID")}</div>}
    </aside>
  );
}
