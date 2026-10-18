"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TEXT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Mitra Brand \(Rp59\.000\/bulan \+ Rp20\.000\/aktivasi\)/g, "Mitra Brand Lama (Legacy)"],
  [/Mitra Brand - White Label/g, "Mitra Brand Lama (Legacy)"],
  [/Rp20\.000 \/ AKTIVASI/g, "BIAYA LAYANAN Rp20.000"],
  [/Sistem baru · Aktivasi Rp20\.000\/undangan/g, "Sistem baru · Biaya layanan Rp20.000/undangan"],
  [/Rp20\.000\/aktivasi/g, "biaya layanan Rp20.000/undangan"],
  [/pembayaran Rp20\.000 melalui Midtrans/g, "pembayaran biaya layanan Rp20.000 melalui Midtrans"],
  [/diaktifkan dengan pembayaran biaya layanan/g, "dipublikasikan setelah pembayaran biaya layanan"],
];

function replaceCopy(value: string) {
  return TEXT_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function rewriteText(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    const current = root.nodeValue ?? "";
    const next = replaceCopy(current);
    if (next !== current) root.nodeValue = next;
    return;
  }
  if (!(root instanceof Element) && root !== document.body) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node.nodeValue ?? "";
    const next = replaceCopy(current);
    if (next !== current) node.nodeValue = next;
    node = walker.nextNode();
  }
}

function lockLegacyPackageControls() {
  document.querySelectorAll<HTMLSelectElement>("select").forEach((select) => {
    const legacyOption = Array.from(select.options).find((option) => option.value === "reseller_brand");
    if (!legacyOption) return;

    if (select.value === "reseller_brand") {
      legacyOption.textContent = "Mitra Brand Lama (Legacy)";
      select.disabled = true;
      select.title = "Paket Mitra Brand hanya dipertahankan untuk akun lama.";
      return;
    }

    legacyOption.remove();
  });
}

export default function LegacyMitraBrandAdminGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/admin/resellers") return;

    const apply = () => {
      rewriteText(document.body);
      lockLegacyPackageControls();
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
