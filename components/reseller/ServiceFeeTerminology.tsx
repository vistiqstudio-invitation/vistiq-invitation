"use client";

import { useEffect } from "react";

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/Bayar Aktivasi/g, "Bayar Biaya Layanan"],
  [/Bayar aktivasi/g, "Bayar biaya layanan"],
  [/biaya aktivasi Vistiq/g, "biaya layanan Vistiq"],
  [/Biaya aktivasi Vistiq/g, "Biaya layanan Vistiq"],
  [/Pembayaran aktivasi/g, "Pembayaran biaya layanan"],
  [/pembayaran aktivasi/g, "pembayaran biaya layanan"],
  [/Tagihan aktivasi/g, "Tagihan biaya layanan"],
  [/tagihan aktivasi/g, "tagihan biaya layanan"],
  [/Aktivasi Rp20\.000 per undangan/g, "Biaya layanan Rp20.000 per undangan"],
];

const MONTHLY_LEGACY_REPLACEMENTS: Array<[RegExp, string]> = [
  [
    /Harga jual kepada client bebas Anda tentukan\. Untuk akun baru, biaya layanan Vistiq tetap Rp20\.000 per undangan\./g,
    "Harga jual kepada client bebas Anda tentukan. Akun Mitra Brand bulanan lama tetap menggunakan sistem sebelumnya: selama masa aktif, undangan dapat diaktifkan tanpa biaya layanan per undangan.",
  ],
  [
    /Harga jual kepada client bebas Anda tentukan\. Untuk akun baru, biaya aktivasi Vistiq tetap Rp20\.000 per undangan\./g,
    "Harga jual kepada client bebas Anda tentukan. Akun Mitra Brand bulanan lama tetap menggunakan sistem sebelumnya: selama masa aktif, undangan dapat diaktifkan tanpa biaya layanan per undangan.",
  ],
];

function serviceFeeCopy(value: string, monthlyLegacy: boolean) {
  let text = REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), value);
  if (monthlyLegacy) {
    text = MONTHLY_LEGACY_REPLACEMENTS.reduce(
      (result, [pattern, replacement]) => result.replace(pattern, replacement),
      text,
    );
  }
  return text;
}

function rewriteTextNodes(root: Node, monthlyLegacy: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node.nodeValue ?? "";
    const next = serviceFeeCopy(current, monthlyLegacy);
    if (next !== current) node.nodeValue = next;
    node = walker.nextNode();
  }
}

export default function ServiceFeeTerminology({ monthlyLegacy = false }: { monthlyLegacy?: boolean }) {
  useEffect(() => {
    const originalAlert = window.alert.bind(window);
    window.alert = (message?: unknown) => originalAlert(serviceFeeCopy(String(message ?? ""), monthlyLegacy));

    // Rewrite existing static copy once after the dashboard mounts. Do not watch
    // the entire document continuously: a global MutationObserver here used to
    // rescan text on every React update/keystroke and made the mobile dashboard
    // feel sluggish, especially on large owner/reseller pages.
    const frame = window.requestAnimationFrame(() => {
      rewriteTextNodes(document.body, monthlyLegacy);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.alert = originalAlert;
    };
  }, [monthlyLegacy]);

  return null;
}
