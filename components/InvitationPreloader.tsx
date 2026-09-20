"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { preloadInvitationAssets, type PreloadAsset } from "@/lib/invitationPreload";
import styles from "./InvitationPreloader.module.css";

export default function InvitationPreloader({
  title,
  image,
  assets,
  children,
}: {
  title: string;
  image: string;
  assets: PreloadAsset[];
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  // Stable across parent rerenders; a new invitation gets a new React key.
  const assetsKey = JSON.stringify(assets);

  useEffect(() => {
    let cancelled = false;
    let releaseTimer: number | undefined;
    const startedAt = Date.now();
    const continueTimer = window.setTimeout(() => setCanContinue(true), 6000);
    const planned: PreloadAsset[] = JSON.parse(assetsKey);
    const canonical = (url: string) => {
      try { return new URL(url, document.baseURI).href.split("#", 1)[0]; }
      catch { return url; }
    };
    const seen = new Set(planned.map(asset => canonical(asset.url)));
    // Include actual responsive image URLs already rendered by the theme.
    contentRef.current?.querySelectorAll("img").forEach(img => {
      const url = img.currentSrc || img.getAttribute("src");
      if (url && !seen.has(canonical(url))) { seen.add(canonical(url)); planned.push({ kind: "image", url }); }
    });
    const stop = preloadInvitationAssets(planned, {
      onProgress: value => { if (!cancelled) setProgress(previous => Math.max(previous, value)); },
      onComplete: () => {
        if (cancelled) return;
        // Briefly display the finished state without introducing a fixed wait.
        releaseTimer = window.setTimeout(() => setReady(true), Math.max(120, 450 - (Date.now() - startedAt)));
      },
    });
    stopRef.current = stop;
    return () => {
      cancelled = true;
      stop();
      window.clearTimeout(continueTimer);
      window.clearTimeout(releaseTimer);
      stopRef.current = null;
    };
  }, [assetsKey]);

  const continueNow = () => {
    stopRef.current?.();
    setReady(true);
  };
  const initials = title.split(" & ").map(name => name.trim().charAt(0)).filter(Boolean).join(" & ");

  return (
    <>
      <div ref={contentRef} className={ready ? styles.content : styles.pending} inert={!ready} aria-hidden={!ready || undefined}>
        {children}
      </div>
      {!ready && (
        <section className={styles.loader} aria-label="Memuat undangan" data-invitation-loader="true">
          <div className={styles.card}>
            {image && !photoFailed ? (
              // Use the same URL as the theme so the decoded photo can be reused.
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.photo} src={image} alt="" fetchPriority="high" onError={() => setPhotoFailed(true)} />
            ) : (
              <div className={styles.monogram} aria-hidden="true">{initials || "♡"}</div>
            )}
            {title && <p className={styles.title}>{title}</p>}
            <div role="progressbar" aria-label="Pemuatan undangan" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <p className={styles.percent}>LOADING... {progress}%</p>
              <div className={styles.track} aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
            </div>
            {canContinue && <button type="button" className={styles.continue} onClick={continueNow}>Lanjutkan</button>}
            <noscript>Aktifkan JavaScript untuk membuka undangan.</noscript>
          </div>
        </section>
      )}
    </>
  );
}
