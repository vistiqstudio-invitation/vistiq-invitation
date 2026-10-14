"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ADD_CLIENT_VALUE = "__add_client__";

export default function QuickClientCreator() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });

  useEffect(() => {
    if (pathname !== "/reseller/invitations") return;

    const attachToClientSelect = () => {
      const selects = Array.from(document.querySelectorAll("select"));
      const clientSelect = selects.find((select) =>
        Array.from(select.options).some((option) => option.textContent?.trim() === "Pilih Client")
      );

      if (!clientSelect || clientSelect.dataset.quickClientAttached === "true") return Boolean(clientSelect);

      if (!Array.from(clientSelect.options).some((option) => option.value === ADD_CLIENT_VALUE)) {
        const option = document.createElement("option");
        option.value = ADD_CLIENT_VALUE;
        option.textContent = "+ Tambah Client Baru";
        clientSelect.appendChild(option);
      }

      const onChange = () => {
        if (clientSelect.value !== ADD_CLIENT_VALUE) return;
        clientSelect.value = "";
        clientSelect.dispatchEvent(new Event("change", { bubbles: true }));
        setCredentials(null);
        setError("");
        setOpen(true);
      };

      clientSelect.addEventListener("change", onChange);
      clientSelect.dataset.quickClientAttached = "true";
      return true;
    };

    attachToClientSelect();
    const observer = new MutationObserver(() => attachToClientSelect());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== "/reseller/invitations") return null;

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nama dan email client wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/create-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, package_name: "Belum dipilih", sale_price: 0 }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Gagal menambahkan client.");
        return;
      }
      setCredentials({ email: result.email, password: result.password });
    } catch {
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const finish = () => window.location.reload();

  return open ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(2,20,38,.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(100%, 460px)", background: "white", borderRadius: 24, padding: 24, boxShadow: "0 24px 70px rgba(0,0,0,.28)" }}>
        {!credentials ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#102a43" }}>Tambah Client Baru</div>
                <div style={{ marginTop: 5, fontSize: 13, lineHeight: 1.5, color: "#64748b" }}>Isi data client baru, lalu lanjutkan membuat undangan.</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} style={{ border: 0, background: "#eef2f7", borderRadius: 10, width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Nama client" style={inputStyle} />
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email client untuk login" style={inputStyle} />
              <input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="WhatsApp client (opsional)" style={inputStyle} />
            </div>

            {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#fff1f2", color: "#be123c", fontSize: 13 }}>{error}</div>}

            <button type="button" disabled={saving} onClick={submit} style={{ width: "100%", marginTop: 18, border: 0, borderRadius: 14, padding: "14px 16px", background: "var(--accent, #1863ad)", color: "white", fontWeight: 800, fontSize: 15, opacity: saving ? .65 : 1 }}>
              {saving ? "Membuat Client..." : "Simpan Client"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#102a43" }}>Client Berhasil Dibuat</div>
            <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14 }}>Simpan data login berikut untuk diberikan kepada client.</p>
            <div style={{ background: "#f1f5f9", borderRadius: 14, padding: 16, fontSize: 14, lineHeight: 1.8, color: "#0f172a" }}>
              <div><strong>Email:</strong> {credentials.email}</div>
              <div><strong>Password:</strong> {credentials.password}</div>
            </div>
            <button type="button" onClick={finish} style={{ width: "100%", marginTop: 18, border: 0, borderRadius: 14, padding: "14px 16px", background: "var(--accent, #1863ad)", color: "white", fontWeight: 800, fontSize: 15 }}>
              Lanjut Buat Undangan
            </button>
          </>
        )}
      </div>
    </div>
  ) : null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "13px 14px",
  fontSize: 15,
  color: "#0f172a",
  background: "white",
  outline: "none",
};
