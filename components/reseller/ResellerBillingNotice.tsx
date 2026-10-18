"use client";

import { useEffect, useState } from "react";

const NOTICE_KEY = "vistiq_reseller_billing_notice_2026_10";

export default function ResellerBillingNotice({ packageName }: { packageName?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (packageName !== "reseller") return;
    try {
      if (window.localStorage.getItem(NOTICE_KEY) !== "seen") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [packageName]);

  if (!open || packageName !== "reseller") return null;

  const close = () => {
    try { window.localStorage.setItem(NOTICE_KEY, "seen"); } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reseller-billing-notice-title">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-[#1863AD] to-[#0F4E8A] px-6 py-7 text-white">
          <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">PEMBERITAHUAN PENTING</div>
          <h2 id="reseller-billing-notice-title" className="text-2xl font-bold leading-tight">Sistem Reseller Vistiq Lebih Simpel</h2>
          <p className="mt-2 text-sm leading-6 text-white/85">Mulai sekarang setiap undangan menggunakan biaya layanan tetap.</p>
        </div>
        <div className="space-y-4 px-6 py-6 text-sm text-slate-600">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="font-semibold text-slate-900">Biaya layanan hanya Rp20.000 per undangan</p>
            <p className="mt-1 leading-6">Setelah membuat client dan undangan, lakukan pembayaran biaya layanan Rp20.000. Setelah pembayaran berhasil melalui Midtrans, akun client dan undangannya akan aktif otomatis.</p>
          </div>
          <p className="leading-6">Tidak ada lagi sistem persentase komisi atau prosedur pencairan untuk Reseller. Anda bebas menentukan harga jual kepada client dan keuntungan penjualan menjadi milik Anda.</p>
          <button type="button" onClick={close} className="w-full rounded-2xl bg-[#1863AD] px-4 py-3.5 font-semibold text-white transition hover:bg-[#0F4E8A]">Saya Mengerti</button>
        </div>
      </div>
    </div>
  );
}
