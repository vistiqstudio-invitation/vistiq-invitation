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
    <aside style={{ position: "fixed", right: 18, bottom: 18, zIndex: 50, width: "min(340px, calc(100vw - 36px))", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 12px 35px rgba(15,23,42,.16)", padding: 16, fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: "#64748b" }}>CLOUDFLARE R2</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>Monitor Storage</div>
        </div>
        <button onClick={refresh} disabled={loading} style={{ border: "1px solid #dbe2ea", background: "#f8fafc", borderRadius: 9, padding: "7px 10px", cursor: loading ? "default" : "pointer", fontWeight: 700 }}>
          {loading ? "Mengecek..." : "Refresh"}
        </button>
      </div>

      {error ? <div style={{ marginTop: 12, fontSize: 13, color: "#b91c1c" }}>{error}</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <div style={{ background: "#f8fafc", borderRadius: 11, padding: 11 }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>Total storage</div>
            <strong style={{ display: "block", marginTop: 4, fontSize: 18, color: "#0f172a" }}>{usage ? formatBytes(usage.bytes) : loading ? "..." : "-"}</strong>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 11, padding: 11 }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>Total file</div>
            <strong style={{ display: "block", marginTop: 4, fontSize: 18, color: "#0f172a" }}>{usage ? usage.objects.toLocaleString("id-ID") : loading ? "..." : "-"}</strong>
          </div>
        </div>
      )}

      {usage && <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8" }}>Terakhir dicek {new Date(usage.checkedAt).toLocaleString("id-ID")}</div>}
    </aside>
  );
}
