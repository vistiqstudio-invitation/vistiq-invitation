"use client";

import { useEffect, useState } from "react";
import { getInvitationControlFrame } from "./invitationControlFrame";

const themeMusicSelector = ':is(button, [role="button"], .idb-audio-box):is([aria-label="Putar musik"], [aria-label="Jeda musik"]):not([data-invitation-controls] *)';
const proxyAttribute = "data-vistiq-music-proxied";

type MusicControl = {
  playing: boolean;
  toggle: () => void;
};

export function useInvitationMusicControl(opened: boolean) {
  const [control, setControl] = useState<MusicControl | null>(null);

  useEffect(() => {
    if (!opened) return;

    let source: HTMLElement | undefined;
    let audio: HTMLAudioElement | null = null;
    let frameDocument: Document | undefined;
    let pending: number | undefined;
    const hidden = new Set<HTMLElement>();

    function toggle() {
      if (!source?.isConnected) return;
      if (audio) {
        if (audio.paused) void audio.play().catch(() => undefined);
        else audio.pause();
      } else {
        source.click();
      }
    }

    function sync() {
      const documents = frameDocument ? [frameDocument, document] : [document];
      let next: HTMLElement | undefined;
      let nextAudio: HTMLAudioElement | null = null;
      for (const doc of documents) {
        next = Array.from(doc.querySelectorAll<HTMLElement>(themeMusicSelector)).find(
          (button) => button.hasAttribute(proxyAttribute) || (
            !button.closest("[hidden], [inert]") &&
            doc.defaultView?.getComputedStyle(button).display !== "none"
          ),
        );
        if (!next) {
          const audioBox = doc.querySelector<HTMLElement>("[data-invitation-music-box]");
          const track = doc.querySelector<HTMLAudioElement>(".idb-audio-el[src]");
          if (audioBox && track?.getAttribute("src")) {
            next = audioBox;
            nextAudio = track;
          }
        }
        if (next) break;
      }

      const controls = next ? [...next.ownerDocument.querySelectorAll<HTMLElement>(themeMusicSelector), next] : [];
      for (const button of hidden) {
        if (controls.includes(button)) continue;
        button.removeAttribute(proxyAttribute);
        hidden.delete(button);
      }
      source = next;
      audio = nextAudio;
      if (!source) {
        setControl(null);
        return;
      }
      for (const button of controls) {
        if (hidden.has(button)) continue;
        button.setAttribute(proxyAttribute, "");
        hidden.add(button);
      }
      const playing = audio ? !audio.paused : source.getAttribute("aria-label") === "Jeda musik";
      setControl((current) => current?.toggle === toggle && current.playing === playing ? current : { playing, toggle });
    }

    function scheduleSync() {
      if (pending !== undefined) return;
      pending = window.requestAnimationFrame(() => {
        pending = undefined;
        sync();
      });
    }

    const options = {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-label", "hidden", "src"],
    };
    const frameObserver = new MutationObserver(scheduleSync);
    const pageStyle = document.createElement("style");
    pageStyle.textContent = `[${proxyAttribute}] { display: none !important; }`;
    document.head.appendChild(pageStyle);
    const frameStyle = pageStyle.cloneNode(true);

    function bindFrame() {
      const next = getInvitationControlFrame()?.contentDocument ?? undefined;
      if (frameDocument === next) return;
      frameObserver.disconnect();
      frameDocument?.removeEventListener("play", scheduleSync, true);
      frameDocument?.removeEventListener("pause", scheduleSync, true);
      frameStyle.parentNode?.removeChild(frameStyle);
      frameDocument = next;
      if (next?.body && next.head) {
        next.head.appendChild(frameStyle);
        frameObserver.observe(next.body, options);
        next.addEventListener("play", scheduleSync, true);
        next.addEventListener("pause", scheduleSync, true);
      }
    }

    const pageObserver = new MutationObserver(() => {
      bindFrame();
      scheduleSync();
    });
    const onLoad = (event: Event) => {
      if (!(event.target instanceof HTMLIFrameElement)) return;
      bindFrame();
      scheduleSync();
    };
    pageObserver.observe(document.body, options);
    document.addEventListener("load", onLoad, true);
    bindFrame();
    sync();

    return () => {
      pageObserver.disconnect();
      frameObserver.disconnect();
      frameDocument?.removeEventListener("play", scheduleSync, true);
      frameDocument?.removeEventListener("pause", scheduleSync, true);
      document.removeEventListener("load", onLoad, true);
      if (pending !== undefined) cancelAnimationFrame(pending);
      frameStyle.parentNode?.removeChild(frameStyle);
      pageStyle.remove();
      hidden.forEach((button) => button.removeAttribute(proxyAttribute));
    };
  }, [opened]);

  return opened ? control : null;
}
