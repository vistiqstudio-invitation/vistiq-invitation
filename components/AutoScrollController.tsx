"use client";

import { useEffect, useRef, useState } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { getInvitationControlFrame, getInvitationScrollTarget } from "./invitationControlFrame";
import { useInvitationMusicControl } from "./useInvitationMusicControl";
import styles from "./InvitationControls.module.css";

const SCROLL_SPEED = 24;
const MANUAL_START_EVENT = "vistiq:auto-scroll-start";
const MANUAL_MODE_SELECTOR = '[data-auto-scroll-mode="manual"]';
const AUTO_SCROLL_MANUAL_SELECTOR = [
  '[data-wedding-theme="adat-bali-motion"]',
  '[data-wedding-theme="adat-minang-motion"]',
].join(",");
const AUTO_SCROLL_MANUAL_PATHS = ["/adat-bali-motion", "/adat-minang-motion"];

export default function AutoScrollController() {
  const { opened } = useInvitation();
  const [running, setRunning] = useState(false);
  const [available, setAvailable] = useState(false);
  const music = useInvitationMusicControl(opened);
  const [heroVisible, setHeroVisible] = useState(false);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!opened) {
      const resetTimer = window.setTimeout(() => {
        setRunning(false);
        setAvailable(false);
        setHeroVisible(false);
        startedRef.current = false;
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const manualOnly =
      AUTO_SCROLL_MANUAL_PATHS.some((path) => window.location.pathname.includes(path)) ||
      Boolean(document.querySelector(`${MANUAL_MODE_SELECTOR},${AUTO_SCROLL_MANUAL_SELECTOR}`));

    // Re-check the document after opening because images/fonts and theme sections
    // can change the final page height at different times on different devices.
    // Do not hide the control for prefers-reduced-motion: users can still choose
    // to start it manually, while automatic movement remains disabled.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const updateAvailability = () => {
      const target = getInvitationScrollTarget();
      const canScroll = target.scrollHeight - target.clientHeight > 80;
      setAvailable(canScroll);
      return canScroll;
    };

    const maybeStart = () => {
      const canScroll = updateAvailability();
      const hero = document.querySelector<HTMLElement>("[data-opening-hero]");
      const heroBounds = hero?.getBoundingClientRect();
      const heroIsVisible = Boolean(heroBounds && heroBounds.top < window.innerHeight && heroBounds.bottom > 0);
      if (canScroll && !manualOnly && !reducedMotion && !startedRef.current && !heroIsVisible) {
        startedRef.current = true;
        setRunning(true);
      }
    };

    updateAvailability();
    const timers = [250, 900, 1800, 3200].map((delay) => window.setTimeout(maybeStart, delay));
    window.addEventListener("load", maybeStart);
    window.addEventListener("resize", updateAvailability);
    document.addEventListener("load", updateAvailability, true);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", maybeStart);
      window.removeEventListener("resize", updateAvailability);
      document.removeEventListener("load", updateAvailability, true);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;

    const startManualScroll = () => {
      if (!document.querySelector(MANUAL_MODE_SELECTOR)) return;
      const target = getInvitationScrollTarget();
      const canScroll = target.scrollHeight - target.clientHeight > 80;
      if (!canScroll) return;
      setAvailable(true);
      startedRef.current = true;
      setRunning(true);
    };

    window.addEventListener(MANUAL_START_EVENT, startManualScroll);
    return () => window.removeEventListener(MANUAL_START_EVENT, startManualScroll);
  }, [opened]);

  useEffect(() => {
    if (!opened) return;

    const hero = document.querySelector<HTMLElement>("[data-opening-hero]");
    if (!hero) {
      setHeroVisible(false);
      return;
    }

    const updateVisibility = () => {
      const bounds = hero.getBoundingClientRect();
      setHeroVisible(bounds.top < window.innerHeight && bounds.bottom > 0);
    };

    updateVisibility();
    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    if (!running) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimeRef.current = null;
      return;
    }

    const target = getInvitationScrollTarget();
    let distance = 0;
    const step = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const elapsed = Math.min(time - lastTimeRef.current, 50);
      lastTimeRef.current = time;
      distance += (SCROLL_SPEED * elapsed) / 1000;
      const pixels = Math.floor(distance);
      if (pixels > 0) {
        target.scrollBy({ top: pixels, behavior: "instant" });
        distance -= pixels;
      }

      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 4) {
        setRunning(false);
        return;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [running]);

  useEffect(() => {
    if (!opened) return;

    const pauseForManualControl = () => setRunning(false);
    const pauseForKeyboard = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        setRunning(false);
      }
    };

    const frameDocument = getInvitationControlFrame()?.contentDocument;
    const targets: Array<Window | Document> = frameDocument ? [window, frameDocument] : [window];
    targets.forEach((target) => {
      target.addEventListener("wheel", pauseForManualControl, { passive: true });
      target.addEventListener("touchstart", pauseForManualControl, { passive: true });
      target.addEventListener("keydown", pauseForKeyboard as EventListener);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener("wheel", pauseForManualControl);
        target.removeEventListener("touchstart", pauseForManualControl);
        target.removeEventListener("keydown", pauseForKeyboard as EventListener);
      });
    };
  }, [opened]);

  const showScroll = opened && available && !heroVisible;
  if (!showScroll && !music) return null;

  const scrollLabel = running ? "Jeda scroll otomatis" : "Lanjutkan scroll otomatis";
  const musicLabel = music?.playing ? "Jeda musik" : "Putar musik";

  return (
    <div className={styles.controls} data-invitation-controls>
      {showScroll && (
        <button
          type="button"
          className={`${styles.button} ${styles.scroll}`}
          onClick={() => setRunning((value) => !value)}
          onTouchStart={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
          aria-label={scrollLabel}
          title={scrollLabel}
        >
          <span aria-hidden="true">{running ? "Ⅱ" : "▶"}</span>
        </button>
      )}
      {music && (
        <button
          type="button"
          className={`${styles.button} ${styles.music}`}
          onClick={music.toggle}
          aria-label={musicLabel}
          title={musicLabel}
        >
          <span aria-hidden="true">{music.playing ? "♫" : "♪"}</span>
        </button>
      )}
    </div>
  );
}
