"use client";

import { ReactNode, useEffect, useRef } from "react";
import type { Brand } from "@/types/invitation";

export default function WhiteLabelFrame({
  brand,
  children,
}: {
  brand: Brand;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!brand?.name || !rootRef.current) return;

    const replaceVistiqText = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = root.nodeType === Node.TEXT_NODE ? [root as Text] : [];
      let current = walker.nextNode();

      while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
      }

      for (const node of nodes) {
        const parent = node.parentElement?.tagName;
        if (parent === "SCRIPT" || parent === "STYLE") continue;

        const original = node.nodeValue || "";
        const replaced = original
          .replace(/Vistiq Invitation/gi, brand.name)
          .replace(/VISTIQ\s+(PICTURES|POST|COASTAL HOUSE|ATELIER|PREMIERE)/g, brand.name.toUpperCase())
          .replace(/\bVISTIQ\b/g, brand.name.toUpperCase());

        if (replaced !== original) node.nodeValue = replaced;
      }
    };

    replaceVistiqText(rootRef.current);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") replaceVistiqText(mutation.target);
        mutation.addedNodes.forEach((node) => replaceVistiqText(node));
      }
    });
    observer.observe(rootRef.current, { childList: true, characterData: true, subtree: true });

    return () => observer.disconnect();
  }, [brand]);

  if (!brand) return <>{children}</>;

  const accent = brand.color && /^#[0-9a-f]{6}$/i.test(brand.color)
    ? brand.color
    : "#1167b2";

  return (
    <div
      ref={rootRef}
      className="whiteLabelRoot"
      style={{ "--brand-color": accent, "--accent": accent } as React.CSSProperties}
    >
      <div className="whiteLabelBadge" aria-label={`Powered by ${brand.name}`}>
        {brand.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logoUrl} alt={`Logo ${brand.name}`} />
        )}
        <span>{brand.name}</span>
      </div>
      {children}
      <style jsx>{`
        .whiteLabelRoot { display: contents; }
        .whiteLabelBadge {
          position: fixed;
          z-index: 9998;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: min(240px, calc(100vw - 28px));
          padding: 7px 11px;
          border: 1px solid color-mix(in srgb, ${accent} 35%, white);
          border-radius: 999px;
          color: ${accent};
          background: rgba(255,255,255,.92);
          box-shadow: 0 8px 28px rgba(15,23,42,.14);
          backdrop-filter: blur(10px);
          font: 800 11px/1.2 Arial, sans-serif;
          letter-spacing: .04em;
        }
        .whiteLabelBadge img {
          width: 26px;
          height: 26px;
          flex: 0 0 auto;
          object-fit: contain;
          border-radius: 6px;
        }
        .whiteLabelBadge span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
