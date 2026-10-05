"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import styles from "./CheckoutButton.module.css";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: Record<string, (result?: { order_id?: string }) => void>,
      ) => void;
    };
  }
}

type Props = {
  resellerKey: string;
  themeKey: string;
  themeLabel: string;
  category: "wedding" | "khitan" | "akikah" | "ulang-tahun";
  className?: string;
  label?: string;
  production?: boolean;
};

export default function StorefrontCheckoutButton({
  resellerKey,
  themeKey,
  themeLabel,
  category,
  className,
  label = "Order",
  production = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true",
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
  const scriptUrl = production
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  const goToStatus = (orderId?: string) => {
    if (orderId) window.location.href = `/pembayaran/status?order_id=${encodeURIComponent(orderId)}`;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/storefront/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resellerKey, themeKey, category, name, email, phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout gagal dibuat.");
      if (!window.snap) throw new Error("Layanan pembayaran belum selesai dimuat. Silakan coba lagi.");

      setOpen(false);
      window.snap.pay(data.token, {
        onSuccess: (result) => goToStatus(result?.order_id || data.orderId),
        onPending: (result) => goToStatus(result?.order_id || data.orderId),
        onError: () => {
          setOpen(true);
          setError("Pembayaran tidak berhasil. Silakan coba kembali.");
        },
        onClose: () => setLoading(false),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src={scriptUrl} data-client-key={clientKey} strategy="afterInteractive" />
      <button
        type="button"
        className={className}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {label}
      </button>

      {open && (
        <div
          className={styles.backdrop}
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={`storefront-checkout-${themeKey}`}>
            <button className={styles.close} type="button" onClick={() => setOpen(false)} aria-label="Tutup checkout">×</button>
            <span className={styles.secure}>PEMBAYARAN AMAN · MIDTRANS</span>
            <h2 id={`storefront-checkout-${themeKey}`}>Order {themeLabel}</h2>
            <p>Lengkapi data pemesan. Setelah pembayaran terverifikasi, akun client akan dibuat dan diaktifkan otomatis.</p>
            <form onSubmit={submit}>
              <label>
                Nama lengkap
                <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} />
              </label>
              <label>
                Email aktif
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </label>
              <label>
                Nomor WhatsApp
                <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required />
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.pay} disabled={loading}>
                {loading ? "Menyiapkan pembayaran..." : "Lanjut ke Pembayaran"}
              </button>
            </form>
            <small>Metode pembayaran tersedia melalui Midtrans sesuai konfigurasi merchant.</small>
          </section>
        </div>
      )}
    </>
  );
}
