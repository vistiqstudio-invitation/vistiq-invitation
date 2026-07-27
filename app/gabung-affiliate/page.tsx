"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function JoinAffiliatePage() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", promotionChannel: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/affiliate/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json(); setLoading(false);
    if (!response.ok) return setError(result.error || "Pendaftaran gagal.");
    setDone(true);
  };

  return <main style={s.page}><style>{`form label{display:grid;gap:7px;font-weight:700;font-size:14px}form input{width:100%;padding:14px 15px;border:1px solid #cbd5e1;border-radius:12px;font:inherit}form button{border:0;border-radius:12px;background:#1167b2;color:white;padding:15px;font-weight:800;font-size:15px;cursor:pointer}form button:disabled{opacity:.65}form small{text-align:center;color:#64748b}`}</style><section style={s.card}>
    <Link href="/" style={s.back}>← Kembali ke Vistiq Invitation</Link>
    <span style={s.badge}>PROGRAM AFFILIATE · GRATIS</span>
    <h1 style={s.title}>Dapatkan Komisi 10%</h1>
    <p style={s.lead}>Bagikan link referral Anda dan dapatkan komisi dari setiap pembelian paket Client, Reseller, maupun Reseller Brand.</p>
    <div style={s.info}><b>Komisi 10%</b><span>Ditahan 7 hari</span><span>Minimal pencairan Rp100.000</span></div>
    {done ? <div style={s.success}><h2>Pendaftaran berhasil 🎉</h2><p>Data Anda sedang diperiksa Admin. Informasi login akan dikirim setelah pendaftaran disetujui.</p></div> :
      <form onSubmit={submit} style={s.form}>
        <label>Nama lengkap<input required minLength={2} value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></label>
        <label>Email aktif<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></label>
        <label>Nomor WhatsApp<input required inputMode="tel" placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={e => setForm({...form, whatsapp:e.target.value})} /></label>
        <label>Media promosi (opsional)<input placeholder="Instagram, TikTok, WhatsApp, dll." value={form.promotionChannel} onChange={e => setForm({...form, promotionChannel:e.target.value})} /></label>
        {error && <p style={s.error}>{error}</p>}
        <button disabled={loading}>{loading ? "Mengirim..." : "Daftar Affiliate"}</button>
        <small>Setelah mendaftar, akun menunggu persetujuan Admin.</small>
      </form>}
  </section></main>;
}

const s: Record<string, React.CSSProperties> = {
  page:{minHeight:"100vh",background:"linear-gradient(135deg,#eff6ff,#fff 55%,#dbeafe)",display:"grid",placeItems:"center",padding:24,fontFamily:"Arial,sans-serif",color:"#0f172a"},
  card:{width:"100%",maxWidth:620,background:"#fff",borderRadius:28,padding:"clamp(24px,5vw,48px)",boxShadow:"0 25px 70px rgba(15,78,138,.14)"},
  back:{color:"#64748b",textDecoration:"none",fontSize:14},badge:{display:"inline-block",marginTop:28,background:"#dbeafe",color:"#1167b2",padding:"9px 14px",borderRadius:999,fontWeight:800,fontSize:12},
  title:{fontSize:"clamp(34px,7vw,52px)",lineHeight:1.05,color:"#0f4e8a",margin:"18px 0 14px"},lead:{color:"#475569",lineHeight:1.7,fontSize:17},
  info:{display:"flex",gap:10,flexWrap:"wrap",margin:"22px 0 28px"},form:{display:"grid",gap:16},success:{padding:22,background:"#ecfdf5",borderRadius:18,color:"#065f46"},
  error:{color:"#b91c1c",background:"#fee2e2",padding:12,borderRadius:10,margin:0}
};
