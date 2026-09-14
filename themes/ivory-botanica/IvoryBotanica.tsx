"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_PAGE = "/themes/ivory-botanica/reference/index.html";
const REFERENCE_DATE = "Minggu, 20 September 2026";
const LEGACY_REFERENCE_DATE = "Senin, 28 Desember 2026";

type TimerElement = HTMLElement & { __idbTimer?: number };

function shortName(person: InvitationData["groom"]) {
  return person.nickname?.trim() || person.name.trim().split(/\s+/)[0] || "Mempelai";
}

function instagramUrl(value: string | null) {
  const handle = value?.trim().replace(/^@/, "");
  return handle ? `https://instagram.com/${handle}` : "https://www.instagram.com/";
}

function instagramHandle(value: string | null) {
  return value?.trim().replace(/^@/, "") || "";
}

function parentParts(value: string | null) {
  const parts = (value || "").split(/\s*&\s*/).map((part) => part.trim()).filter(Boolean);
  return [parts[0] || "", parts[1] || ""];
}

function replaceText(documentRoot: Document, from: string, to: string) {
  if (!from || from === to || !documentRoot.body) return;

  const walker = documentRoot.createTreeWalker(documentRoot.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }

  nodes.forEach((textNode) => {
    if (textNode.nodeValue?.includes(from)) {
      textNode.nodeValue = textNode.nodeValue.replaceAll(from, to);
    }
  });
}

function setCountdown(documentRoot: Document, rawDate: string | null) {
  const countdown = documentRoot.querySelector<HTMLElement>(".idb-countdown");
  if (!countdown || !rawDate) return;

  const target = new Date(rawDate).getTime();
  if (!Number.isFinite(target)) return;

  const timerElement = countdown as TimerElement;
  const childWindow = documentRoot.defaultView;
  if (timerElement.__idbTimer && childWindow) {
    childWindow.clearInterval(timerElement.__idbTimer);
  }

  countdown.dataset.target = String(target);
  countdown.dataset.targetIso = rawDate;

  const update = () => {
    const remaining = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000),
    };

    Object.entries(values).forEach(([part, value]) => {
      const number = countdown.querySelector<HTMLElement>(
        `.idb-countdown__item[data-part="${part}"] [data-role="num"]`,
      );
      if (number) number.textContent = part === "days" ? String(value) : String(value).padStart(2, "0");
    });
  };

  update();
  if (childWindow) timerElement.__idbTimer = childWindow.setInterval(update, 1000);
}

function setEventContent(eventRoot: HTMLElement, event: InvitationData["events"][number]) {
  const marker = eventRoot.querySelector<HTMLElement>(".nama-acara-marker");
  if (marker) marker.textContent = event.name;

  const editors = Array.from(
    eventRoot.querySelectorAll<HTMLElement>(".elementor-widget-text-editor .elementor-widget-container"),
  );
  if (editors[0]) editors[0].textContent = event.date;
  if (editors[1]) editors[1].textContent = `Pukul : ${event.time}`;
  if (editors[2]) editors[2].textContent = `Tempat : ${event.location}`;
}

function setParents(documentRoot: Document, side: "pria" | "wanita", parents: string | null) {
  const [father, mother] = parentParts(parents);
  const markers = Array.from(
    documentRoot.querySelectorAll<HTMLElement>(`[data-idb-mempelai-side="${side}"]`),
  );
  if (markers[0]) markers[0].textContent = father;
  if (markers[1]) markers[1].textContent = mother;
}

function localizeInternalLinks(documentRoot: Document) {
  documentRoot.querySelectorAll<HTMLAnchorElement>('a[href*="inv.wekita.id/spesial-02-animasi/#"]').forEach((anchor) => {
    const rawHref = anchor.getAttribute("href") || "";
    const hashStart = rawHref.indexOf("#");
    const hash = hashStart >= 0 ? decodeURIComponent(rawHref.slice(hashStart + 1)).trim() : "";
    const isGiftLink = /#(?:%20|\s*)$/i.test(rawHref);
    anchor.setAttribute("href", isGiftLink ? "#amplop" : hash ? `#${hash}` : "#home");
  });
}

function setAudioSource(documentRoot: Document, musicUrl: string | null) {
  if (!musicUrl) return;

  documentRoot.querySelectorAll<HTMLAudioElement>(".idb-audio-el").forEach((audio) => {
    const source = audio.querySelector<HTMLSourceElement>("source");
    if (source) source.src = musicUrl;
    audio.src = musicUrl;
    audio.load();
  });
}

function applyInvitationData(documentRoot: Document, invitation: InvitationData, guest: string) {
  const groomShort = shortName(invitation.groom);
  const brideShort = shortName(invitation.bride);
  const firstEvent = invitation.events[0];
  const groomNameToken = "__IVORY_BOTANICA_GROOM_NAME__";
  const brideNameToken = "__IVORY_BOTANICA_BRIDE_NAME__";

  documentRoot.title = `${groomShort} & ${brideShort} — Ivory Botanica`;
  documentRoot.documentElement.lang = "id";

  replaceText(documentRoot, "Habib & Adiba", `${groomShort} & ${brideShort}`);
  replaceText(documentRoot, "Rizky & Nabila", `${groomShort} & ${brideShort}`);
  replaceText(documentRoot, "Habib Yulianto", groomNameToken);
  replaceText(documentRoot, "Rizky Pratama", groomNameToken);
  replaceText(documentRoot, "Adiba Putri Syakila", brideNameToken);
  replaceText(documentRoot, "Nabila Putri", brideNameToken);
  replaceText(documentRoot, "Habib", groomShort);
  replaceText(documentRoot, "Adiba", brideShort);
  replaceText(documentRoot, "Rizky", groomShort);
  replaceText(documentRoot, "Nabila", brideShort);
  replaceText(documentRoot, groomNameToken, invitation.groom.name);
  replaceText(documentRoot, brideNameToken, invitation.bride.name);
  replaceText(documentRoot, "Nama Tamu", guest);
  const guestMarker = documentRoot.querySelector<HTMLElement>(
    ".elementor-element-633aaeac .elementor-widget-container",
  );
  if (guestMarker) guestMarker.textContent = guest;
  replaceText(documentRoot, LEGACY_REFERENCE_DATE, firstEvent?.date || REFERENCE_DATE);
  replaceText(documentRoot, REFERENCE_DATE, firstEvent?.date || REFERENCE_DATE);

  setParents(documentRoot, "pria", invitation.groom.parents);
  setParents(documentRoot, "wanita", invitation.bride.parents);

  const eventRoots = Array.from(documentRoot.querySelectorAll<HTMLElement>(".acara-con"));
  invitation.events.slice(0, eventRoots.length).forEach((event, index) => {
    setEventContent(eventRoots[index], event);
  });

  const streamEditors = Array.from(
    documentRoot.querySelectorAll<HTMLElement>(".stream-con .elementor-widget-text-editor .elementor-widget-container"),
  );
  if (firstEvent && streamEditors[0]) streamEditors[0].textContent = firstEvent.date;
  if (firstEvent && streamEditors[1]) streamEditors[1].textContent = `Pukul : ${firstEvent.time}`;

  documentRoot.querySelectorAll<HTMLAnchorElement>("a[data-idb-maps-link]").forEach((anchor) => {
    anchor.href = invitation.mapsUrl || "https://maps.google.com";
  });

  const instagramAnchors = Array.from(
    documentRoot.querySelectorAll<HTMLAnchorElement>('.elementor-widget-bisdev_social_icons a[aria-label="Instagram"]'),
  );
  const instagramValues = [invitation.groom.instagram, invitation.bride.instagram, invitation.groom.instagram];
  instagramAnchors.forEach((anchor, index) => {
    const value = instagramValues[index] || null;
    anchor.href = instagramUrl(value);
    const label = anchor.querySelector<HTMLElement>(".idb-social-icons__text");
    const handle = instagramHandle(value);
    if (label && handle) label.textContent = `@${handle}`;
  });

  const giftCards = Array.from(documentRoot.querySelectorAll<HTMLElement>(".idb-copy-rek"));
  invitation.gifts.slice(0, giftCards.length).forEach((gift, index) => {
    const card = giftCards[index];
    if (gift.accountNumber) {
      card.dataset.copy = gift.accountNumber;
      const number = card.querySelector<HTMLElement>(".no-rekening-marker");
      if (number) number.textContent = gift.accountNumber;
    }
    const name = card.querySelector<HTMLElement>(".idb-copy-rek__name");
    if (name && gift.accountName) name.textContent = gift.accountName;
  });

  const giftValues = Array.from(documentRoot.querySelectorAll<HTMLElement>(".idb-kirim-hadiah__value"));
  if (giftValues[0]) giftValues[0].textContent = invitation.groom.name;
  if (giftValues[1]) giftValues[1].textContent = invitation.contactWhatsapp || "—";
  if (giftValues[2]) giftValues[2].textContent = firstEvent?.location || "—";

  setAudioSource(documentRoot, invitation.musicUrl);
  setCountdown(documentRoot, firstEvent?.rawDate || null);
  localizeInternalLinks(documentRoot);

  if (!documentRoot.getElementById("ivory-botanica-frame-overrides")) {
    const style = documentRoot.createElement("style");
    style.id = "ivory-botanica-frame-overrides";
    style.textContent = `
      :root, body { background-color: #f7f3e8 !important; }
      .elementor-8395 .elementor-element.elementor-element-11b016c5:not(.elementor-motion-effects-element-type-background),
      .elementor-8395 .elementor-element.elementor-element-11b016c5 > .elementor-motion-effects-container > .elementor-motion-effects-layer {
        background-color: #f7f3e8 !important;
      }
    `;
    documentRoot.head.appendChild(style);
  }
}

export default function IvoryBotanica({ invitation }: { invitation: InvitationData }) {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const guest = searchParams.get("to")?.trim() || "Bapak/Ibu/Saudara/i";

  const handleLoad = useCallback(() => {
    const documentRoot = iframeRef.current?.contentDocument;
    if (documentRoot) applyInvitationData(documentRoot, invitation, guest);
  }, [guest, invitation]);

  return (
    <div className={styles.root}>
      <iframe
        ref={iframeRef}
        className={styles.frame}
        src={REFERENCE_PAGE}
        title={`Undangan ${shortName(invitation.groom)} dan ${shortName(invitation.bride)}`}
        allow="autoplay; fullscreen; picture-in-picture"
        onLoad={handleLoad}
      />
    </div>
  );
}
