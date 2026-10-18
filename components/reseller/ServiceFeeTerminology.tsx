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

function serviceFeeCopy(value: string) {
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function rewriteTextNodes(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    const current = root.nodeValue ?? "";
    const next = serviceFeeCopy(current);
    if (next !== current) root.nodeValue = next;
    return;
  }

  if (!(root instanceof Element) && root !== document.body) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node.nodeValue ?? "";
    const next = serviceFeeCopy(current);
    if (next !== current) node.nodeValue = next;
    node = walker.nextNode();
  }
}

export default function ServiceFeeTerminology() {
  useEffect(() => {
    const originalAlert = window.alert.bind(window);
    window.alert = (message?: unknown) => originalAlert(serviceFeeCopy(String(message ?? "")));

    rewriteTextNodes(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          rewriteTextNodes(mutation.target);
          continue;
        }
        mutation.addedNodes.forEach((node) => rewriteTextNodes(node));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      window.alert = originalAlert;
    };
  }, []);

  return null;
}
