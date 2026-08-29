"use client";

import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";
import type { PaymentPackageId } from "@/lib/paymentPackages";
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
  packageId: PaymentPackageId;
  label?: string;
  featured?: boolean;
  production?: boolean;
  autoOpen?: boolean;
  referralCode?: string;
};

export default function CheckoutButton({
  packageId,
  label = "Bayar Sekarang",
  featured = false,
  production = false,
  autoOpen = false,
  referralCode = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const manualPackage = packageId === "reseller" || packageId === "reseller-brand";
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
  const scriptUrl = production
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const goToStatus = (orderId?: string) => {
    if (orderId) {
      window.location.href = `/pembayaran/status?order_id=${encodeURIComponent(orderId)}`;
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cookieReferral = document.cookie
        .split("; ")
        .find((row) => row.startsWith("vistiq_ref="))
        ?.split("=")[1];
      const activeReferral = referralCode || (cookieReferral ? decodeURIComponent(cookieReferral) : "");

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, name, email, phone, referralCode: activeReferral }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout gagal dibuat.");

      if (data.manual && data.whatsappUrl) {
        setOpen(false);
        window.location.href = data.whatsappUrl;
        return;
      }

      if (!window.snap) {
        throw new Error("Layanan pembayaran belum selesai dimuat. Silakan coba lagi.");
      }

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
      {!manualPackage && (
        <Script
          src={scriptUrl}
          data-client-key={clientKey}
          strategy="afterInteractive"
        />
      )}
      <button
        type="button"
        className={`priceButton ${featured ? "featuredButton" : ""}`}
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
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`checkout-${packageId}`}
          >
            <button
              className={styles.close}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup checkout"
            >
              ×
            </button>
            <span className={styles.secure}>
              {manualPackage ? "PEMBAYARAN MANUAL · WHATSAPP ADMIN" : "PEMBAYARAN AMAN · MIDTRANS"}
            </span>
            <h2 id={`checkout-${packageId}`}>Lengkapi Data Pemesan</h2>
            <p>
              {manualPackage
                ? "Setelah data tersimpan, Anda akan diarahkan ke WhatsApp Admin Vistiq untuk menerima informasi rekening dan konfirmasi pembayaran."
                : "Data ini digunakan untuk konfirmasi pembayaran dan pembuatan akun Anda."}
            </p>
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
                {loading
                  ? "Menyiapkan pembayaran..."
                  : manualPackage
                    ? "Lanjut Konfirmasi via WhatsApp"
                    : "Lanjut ke Pembayaran"}
              </button>
            </form>
            <small>
              {manualPackage
                ? "Pembayaran dinyatakan sukses hanya setelah Admin Vistiq memverifikasi transfer dan menekan Pembayaran Sukses di Dashboard Owner."
                : "Anda akan memilih QRIS, virtual account, atau e-wallet di halaman Midtrans."}
            </small>
          </section>
        </div>
      )}
    </>
  );
}
