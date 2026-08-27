"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import themeStyles from "@/themes/luxury-art-champagne-romance/style.module.css";
import previewStyles from "./ThemeCoverPreview.module.css";

const BASE_WIDTH = 390;
const BASE_HEIGHT = 693;

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 7 7.5 6 7.5-6" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArcTitle() {
  return (
    <svg className={themeStyles.coverArc} viewBox="0 0 190 74" aria-hidden="true">
      <defs>
        <path id="champagne-catalog-cover-arc" d="M 31 61 A 67 67 0 0 1 159 61" />
      </defs>
      <text>
        <textPath href="#champagne-catalog-cover-arc" startOffset="50%" textAnchor="middle">
          THE WEDDING OF
        </textPath>
      </text>
    </svg>
  );
}

export default function ChampagneRomanceCatalogCover() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateScale = () => setScale(host.clientWidth / BASE_WIDTH);
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={previewStyles.liveCoverHost} aria-label="Tampilan pembuka undangan tema Luxury Art — Champagne Romance">
      <div
        className={`${themeStyles.stage} ${previewStyles.liveCoverCanvas}`}
        style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}
      >
        <section className={`${themeStyles.cover} ${themeStyles.coverStatic}`}>
          <div className={themeStyles.coverPhoto}>
            <Image
              src="/photos/luxury-art-love-paradise/couple-cover.webp"
              alt="Alya & Raka"
              fill
              sizes="390px"
              quality={95}
              priority={false}
            />
          </div>
          <div className={themeStyles.coverGradient} />
          <div className={themeStyles.coverTopDetail}><i /><span /><i /></div>
          <div className={themeStyles.coverCopy}>
            <ArcTitle />
            <h1>Alya <em>&amp;</em> Raka</h1>
            <div className={themeStyles.coverGuest}>
              <span>Kepada Yth.</span>
              <strong>Bpk/Ibu/Saudara/i</strong>
              <small>di Tempat</small>
            </div>
            <button type="button" tabIndex={-1} aria-hidden="true">
              <MailIcon /> Buka Undangan
            </button>
          </div>
          <div className={themeStyles.coverLeafShadow} />
        </section>
      </div>
    </div>
  );
}
