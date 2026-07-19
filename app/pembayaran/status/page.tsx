"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type PaymentStatus = { orderId:string;status:string;paymentType:string|null;grossAmount:string };

const LABELS:Record<string,{title:string;copy:string;color:string}>={
  settlement:{title:"Pembayaran Berhasil",copy:"Pembayaran Anda sudah diterima. Tim Vistiq akan memproses pesanan Anda.",color:"#139b52"},
  capture:{title:"Pembayaran Berhasil",copy:"Pembayaran Anda sudah diterima dan sedang diverifikasi.",color:"#139b52"},
  pending:{title:"Menunggu Pembayaran",copy:"Selesaikan pembayaran sesuai metode yang Anda pilih di Midtrans.",color:"#d18a11"},
  expire:{title:"Pembayaran Kedaluwarsa",copy:"Waktu pembayaran telah habis. Silakan buat checkout baru.",color:"#c2413b"},
  cancel:{title:"Pembayaran Dibatalkan",copy:"Transaksi telah dibatalkan. Anda dapat mencoba kembali.",color:"#c2413b"},
  deny:{title:"Pembayaran Ditolak",copy:"Silakan gunakan metode pembayaran lain.",color:"#c2413b"},
};

function StatusContent(){
  const orderId=useSearchParams().get("order_id")??"";
  const[data,setData]=useState<PaymentStatus|null>(null);const[error,setError]=useState(orderId?"":"Nomor pesanan tidak ditemukan.");const[loading,setLoading]=useState(Boolean(orderId));const[refresh,setRefresh]=useState(0);
  useEffect(()=>{if(!orderId)return;const controller=new AbortController();fetch(`/api/payments/status?order_id=${encodeURIComponent(orderId)}`,{cache:"no-store",signal:controller.signal}).then(async(r)=>{const j=await r.json();if(!r.ok)throw new Error(j.error||"Status belum tersedia.");setData(j);setError("")}).catch(e=>{if(e instanceof Error&&e.name!=="AbortError")setError(e.message||"Status belum tersedia.")}).finally(()=>setLoading(false));return()=>controller.abort()},[orderId,refresh]);
  const check=()=>{setLoading(true);setRefresh(value=>value+1)};
  const meta=LABELS[data?.status??""]??{title:"Status Pembayaran",copy:"Status transaksi sedang diperiksa.",color:"#1167b2"};
  return <main className="paymentStatus"><div className="statusCard"><div className="statusIcon" style={{background:meta.color}}>{data&&["settlement","capture"].includes(data.status)?"✓":"⌛"}</div><p className="statusLabel">VISTIQ INVITATION · MIDTRANS</p><h1>{loading?"Memeriksa Pembayaran...":error?"Status Belum Tersedia":meta.title}</h1><p className="statusCopy">{loading?"Mohon tunggu sebentar.":error||meta.copy}</p>{data&&<div className="statusDetails"><span>Nomor pesanan<b>{data.orderId}</b></span><span>Total<b>Rp {Number(data.grossAmount).toLocaleString("id-ID")}</b></span><span>Metode<b>{data.paymentType||"Belum dipilih"}</b></span></div>}<div className="statusActions"><button onClick={check} disabled={loading}>Periksa Lagi</button><Link href="/#harga">Kembali ke Paket</Link></div><small>Butuh bantuan? Gunakan tombol WhatsApp di sudut halaman.</small></div><style>{css}</style></main>
}

export default function PaymentStatusPage(){return <Suspense fallback={<main className="paymentStatus">Memuat...</main>}><StatusContent/></Suspense>}

const css=`.paymentStatus{min-height:100svh;display:grid;place-items:center;padding:25px;color:#0f172a;font-family:Arial,sans-serif;background:radial-gradient(circle at 20% 10%,#e8f4ff,transparent 35%),#f6f8fb}.statusCard{width:min(580px,100%);padding:48px;border:1px solid #dce7f2;border-radius:28px;text-align:center;background:#fff;box-shadow:0 25px 70px rgba(15,78,138,.12)}.statusIcon{display:grid;place-items:center;width:70px;height:70px;margin:0 auto 20px;border-radius:50%;color:#fff;font-size:30px}.statusLabel{color:#1167b2;font-size:10px;font-weight:800;letter-spacing:.16em}.statusCard h1{margin:12px 0;font-size:34px;letter-spacing:-.03em}.statusCopy{margin:0 auto 26px;max-width:430px;color:#64748b;line-height:1.65}.statusDetails{display:grid;gap:1px;margin:24px 0;text-align:left;overflow:hidden;border:1px solid #e2e8f0;border-radius:15px}.statusDetails span{display:flex;justify-content:space-between;gap:20px;padding:14px 17px;background:#f8fafc;font-size:12px}.statusDetails b{overflow-wrap:anywhere;text-align:right}.statusActions{display:flex;justify-content:center;gap:10px}.statusActions button,.statusActions a{padding:12px 18px;border:1px solid #1167b2;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;cursor:pointer}.statusActions button{color:#fff;background:#1167b2}.statusActions a{color:#1167b2;background:#fff}.statusCard>small{display:block;margin-top:24px;color:#94a3b8}@media(max-width:600px){.statusCard{padding:35px 20px}.statusCard h1{font-size:28px}.statusActions{flex-direction:column}.statusDetails span{flex-direction:column;gap:5px}.statusDetails b{text-align:left}}`;
