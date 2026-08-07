"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PhoneMockup.module.css";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const DESIGN_BEZEL = 5;
const OUTER_RADIUS = 52;
const SCREEN_RADIUS = 42;
const ISLAND_WIDTH = 96;
const ISLAND_HEIGHT = 28;
const ISLAND_TOP = 14;
const HOME_BAR_WIDTH = 120;
const HOME_BAR_HEIGHT = 5;

type Props = {
  themeKey: string;
  /** Visible screen width in px (the phone body will be slightly larger to fit the bezel). */
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Base demo route the iframe points at - "/demo" for wedding themes, "/demo-akikah" for aqiqah themes. */
  demoPath?: string;
  /**
   * "live" (default) embeds the actual theme page in an iframe - fine for a
   * handful of mockups (hero fans), but a full catalog grid means dozens of
   * simultaneously-running React apps, animations and all, which is what
   * made those pages heavy to scroll on phones. "static" swaps the screen
   * for a single cover image (or a gradient card using the theme's own
   * swatch colors, when no cover photo exists) - no iframe, no motion.
   */
  mode?: "live" | "static";
  /** Cover photo to show in static mode. Falls back to a swatch-colored card with the label when omitted. */
  coverImage?: string | null;
  /** Two-color gradient used for the static fallback card when there's no coverImage. */
  swatch?: [string, string];
  /** Theme label shown on the static fallback card. */
  label?: string;
  /** Cover-screen text overlay (name, date, "Buka Undangan" button) drawn on top of the static image/card. */
  overlay?: {
    eyebrow: string;
    title: string;
    date?: string;
  };
};

// A phone-shaped frame showing either a live (non-interactive) iframe of the
// actual theme demo, or a static cover image/color card - see `mode` above.
export default function PhoneMockup({
  themeKey,
  width = 220,
  className,
  style,
  demoPath = "/demo",
  mode = "live",
  coverImage,
  swatch,
  label,
  overlay,
}: Props) {
  const scale = width / DESIGN_WIDTH;
  const screenHeight = DESIGN_HEIGHT * scale;
  const outerRadius = OUTER_RADIUS * scale;
  const screenRadius = SCREEN_RADIUS * scale;
  const buttonRadius = 2.5 * scale;
  const bezel = Math.max(DESIGN_BEZEL * scale, 1.5);

  // "live" mode's iframe is the expensive part (a whole extra React app,
  // animations and all) - on a catalog grid with dozens of cards that's
  // heavy to scroll through if every one loads immediately. Defer mounting
  // the iframe until the mockup is actually about to enter view.
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearView, setIsNearView] = useState(mode !== "live");

  useEffect(() => {
    if (mode !== "live" || isNearView) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsNearView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(node);

    // Safety net: a backgrounded/prerendered tab can pause intersection
    // callbacks indefinitely (they resume once foregrounded, but we'd
    // rather not leave the card permanently blank if that never happens).
    const fallback = window.setTimeout(() => setIsNearView(true), 4000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [mode, isNearView]);

  return (
    <div
      ref={containerRef}
      className={`${styles.phone} ${className ?? ""}`}
      style={{ ...style, width: width + bezel * 2, padding: bezel, borderRadius: outerRadius }}
    >
      <div className={styles.edgeHighlight} style={{ borderRadius: outerRadius }} />

      <div
        className={styles.buttonMute}
        style={{ top: 92 * scale, width: 3 * scale, height: 26 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonVolUp}
        style={{ top: 130 * scale, width: 3 * scale, height: 44 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonVolDown}
        style={{ top: 182 * scale, width: 3 * scale, height: 44 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonPower}
        style={{ top: 148 * scale, width: 3 * scale, height: 66 * scale, borderRadius: buttonRadius }}
      />

      <div className={styles.screen} style={{ width, height: screenHeight, borderRadius: screenRadius }}>
        {mode === "static" ? (
          coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt={label || themeKey} className={styles.staticImage} loading="lazy" />
          ) : (
            <div
              className={styles.staticFallback}
              style={{
                background: swatch
                  ? `linear-gradient(155deg, ${swatch[0]}, ${swatch[1]})`
                  : "#1c1c1e",
              }}
            >
              <span
                className={styles.staticFallbackLabel}
                style={{ fontSize: Math.max(width * 0.09, 13), color: swatch ? swatch[1] : "#fff" }}
              >
                {label || themeKey}
              </span>
            </div>
          )
        ) : isNearView ? (
          <iframe
            src={`${demoPath}/${themeKey}`}
            className={styles.frame}
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: `scale(${scale})`,
            }}
            tabIndex={-1}
            aria-hidden="true"
            loading="lazy"
            scrolling="no"
          />
        ) : (
          <div
            className={styles.staticFallback}
            style={{
              background: swatch
                ? `linear-gradient(155deg, ${swatch[0]}, ${swatch[1]})`
                : "#1c1c1e",
            }}
          >
            <span
              className={styles.staticFallbackLabel}
              style={{ fontSize: Math.max(width * 0.09, 13), color: swatch ? swatch[1] : "#fff" }}
            >
              {label || themeKey}
            </span>
          </div>
        )}

        {mode === "static" && overlay && (
          <>
            <div className={styles.staticScrim} />
            <div
              className={styles.staticOverlay}
              style={{ padding: `0 ${8 * scale}px ${22 * scale}px` }}
            >
              <p
                className={styles.staticEyebrow}
                style={{ fontSize: Math.max(width * 0.032, 7), letterSpacing: 2 * scale, marginBottom: 4 * scale }}
              >
                {overlay.eyebrow}
              </p>
              <p
                className={styles.staticTitle}
                style={{ fontSize: Math.max(width * 0.072, 12), marginBottom: 6 * scale }}
              >
                {overlay.title}
              </p>
              {overlay.date && (
                <p
                  className={styles.staticEyebrow}
                  style={{ fontSize: Math.max(width * 0.03, 6.5), marginBottom: 10 * scale, letterSpacing: 0.5 }}
                >
                  {overlay.date}
                </p>
              )}
              <p
                className={styles.staticInvite}
                style={{ fontSize: Math.max(width * 0.032, 7), marginBottom: 10 * scale }}
              >
                Kepada Yth.
                <b style={{ fontSize: Math.max(width * 0.036, 7.5) }}>Bapak/Ibu/Saudara/i</b>
              </p>
              <span
                className={styles.staticButton}
                style={{
                  fontSize: Math.max(width * 0.034, 7.5),
                  padding: `${8 * scale}px ${20 * scale}px`,
                  borderRadius: 999,
                  background: swatch?.[1] || "#1167b2",
                }}
              >
                Buka Undangan
              </span>
            </div>
          </>
        )}

        <div className={styles.screenGloss} />

        <div
          className={styles.island}
          style={{
            top: ISLAND_TOP * scale,
            width: ISLAND_WIDTH * scale,
            height: ISLAND_HEIGHT * scale,
            borderRadius: (ISLAND_HEIGHT / 2) * scale,
          }}
        />

        <div
          className={styles.homeBar}
          style={{
            width: HOME_BAR_WIDTH * scale,
            height: HOME_BAR_HEIGHT * scale,
            borderRadius: (HOME_BAR_HEIGHT / 2) * scale,
            bottom: 6 * scale,
          }}
        />

        <div className={styles.tapShield} />
      </div>
    </div>
  );
}
