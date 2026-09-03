"use client";

import { useEffect, useRef, useState } from "react";
import { useInvitation } from "@/components/InvitationProvider";

const SCROLL_SPEED = 24;
const MANUAL_START_EVENT = "vistiq:auto-scroll-start";
const MANUAL_MODE_SELECTOR = '[data-auto-scroll-mode="manual"]';

export default function AutoScrollController() {
  const { opened } = useInvitation();
  const [running, setRunning] = useState(false);
  const [available, setAvailable] = useState(false);
  const [manualOnly, setManualOnly] = useState(false);
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
        setManualOnly(false);
        startedRef.current = false;
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const isManualOnly = Boolean(document.querySelector(MANUAL_MODE_SELECTOR));
    setManualOnly(isManualOnly);
    if (isManualOnly) {
      setRunning(false);
      setAvailable(false);
      startedRef.current = false;
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const canScroll = document.documentElement.scrollHeight > window.innerHeight + 80;
      setAvailable(canScroll);
      const hero = document.querySelector<HTMLElement>("[data-opening-hero]");
      const heroBounds = hero?.getBoundingClientRect();
      const heroIsVisible = Boolean(heroBounds && heroBounds.top < window.innerHeight && heroBounds.bottom > 0);
      if (canScroll && !reducedMotion && !startedRef.current && !heroIsVisible) {
        startedRef.current = true;
        setRunning(true);
      }
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [opened]);

  useEffect(() => {
    if (!opened) return;

    const startManualScroll = () => {
      if (!document.querySelector(MANUAL_MODE_SELECTOR)) return;
      const canScroll = document.documentElement.scrollHeight > window.innerHeight + 80;
      if (!canScroll) return;
      setManualOnly(true);
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

    const step = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const elapsed = Math.min(time - lastTimeRef.current, 50);
      lastTimeRef.current = time;

      window.scrollBy({ top: (SCROLL_SPEED * elapsed) / 1000, left: 0 });

      const bottomReached =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;

      if (bottomReached) {
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

    window.addEventListener("wheel", pauseForManualControl, { passive: true });
    window.addEventListener("touchstart", pauseForManualControl, { passive: true });
    window.addEventListener("keydown", pauseForKeyboard);

    return () => {
      window.removeEventListener("wheel", pauseForManualControl);
      window.removeEventListener("touchstart", pauseForManualControl);
      window.removeEventListener("keydown", pauseForKeyboard);
    };
  }, [opened]);

  if (!opened || !available || heroVisible || manualOnly) return null;

  return (
    <>
      <button
        type="button"
        className="autoScrollButton"
        onClick={() => setRunning((value) => !value)}
        onTouchStart={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
        aria-label={running ? "Jeda scroll otomatis" : "Lanjutkan scroll otomatis"}
        title={running ? "Jeda scroll otomatis" : "Lanjutkan scroll otomatis"}
      >
        <span aria-hidden="true">{running ? "Ⅱ" : "▶"}</span>
        <small>{running ? "Jeda" : "Auto Scroll"}</small>
      </button>

      <style jsx>{`
        .autoScrollButton {
          position: fixed;
          left: 18px;
          bottom: 96px;
          z-index: 9997;
          min-width: 54px;
          height: 54px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.88);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
          backdrop-filter: blur(10px);
          font-family: Arial, Helvetica, sans-serif;
          cursor: pointer;
        }

        .autoScrollButton span {
          font-size: 14px;
          line-height: 1;
        }

        .autoScrollButton small {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        @media (max-width: 560px) {
          .autoScrollButton {
            left: 14px;
            bottom: 88px;
            min-width: 48px;
            height: 48px;
            padding: 0 11px;
          }

          .autoScrollButton small {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .autoScrollButton {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
