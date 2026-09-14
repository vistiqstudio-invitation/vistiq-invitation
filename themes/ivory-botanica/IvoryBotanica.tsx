"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_PAGE = "/themes/ivory-botanica/reference/index.html";
const REFERENCE_DATE = "Minggu, 20 September 2026";
const LEGACY_REFERENCE_DATE = "Senin, 28 Desember 2026";
const VISTIQ_INSTAGRAM_URL = "https://www.instagram.com/vistiqinvitation/";
const VISTIQ_ADMIN_WHATSAPP_URL = "https://wa.me/6281371338032";

type FooterIconKind = "instagram" | "whatsapp";

const FOOTER_ICON_MARKUP: Record<FooterIconKind, string> = {
  instagram:
    '<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.45" cy="6.65" r="1.05" fill="currentColor"/>',
  whatsapp:
    '<path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.73 3.03 15.79c0 2.25.6 4.45 1.74 6.38L3 28.55l6.6-1.7a13.1 13.1 0 0 0 6.43 1.63h.01c7.17 0 13.01-5.74 13.01-12.79C29.05 8.64 23.21 3 16.04 3Zm0 23.32h-.01a10.9 10.9 0 0 1-5.55-1.49l-.4-.23-3.92 1.01 1.05-3.75-.26-.39a10.5 10.5 0 0 1-1.68-5.68c0-5.87 4.83-10.64 10.78-10.64 5.94 0 10.77 4.77 10.77 10.64 0 5.86-4.84 10.53-10.78 10.53Zm5.91-7.98c-.32-.16-1.92-.93-2.22-1.03-.29-.11-.51-.16-.72.16-.22.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.61-1.56a9.7 9.7 0 0 1-1.81-2.22c-.19-.32-.02-.49.14-.65.15-.14.33-.37.49-.55.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.15-.73-1.72-.99-2.36-.27-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.31-1.14 1.09-1.14 2.67 0 1.57 1.16 3.09 1.32 3.3.16.21 2.29 3.44 5.54 4.82.78.33 1.38.52 1.85.67.78.24 1.48.21 2.04.13.62-.09 1.92-.78 2.19-1.52.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.63-.37Z"/>',
};

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

function createFooterIcon(documentRoot: Document, kind: FooterIconKind) {
  const svg = documentRoot.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `vistiq-footer-icon vistiq-footer-icon-${kind}`);
  svg.setAttribute("viewBox", kind === "whatsapp" ? "0 0 32 32" : "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = FOOTER_ICON_MARKUP[kind];
  return svg;
}

function setFooterBranding(documentRoot: Document) {
  const footer = documentRoot.querySelector<HTMLElement>(".elementor-element-12b47c4c");
  if (!footer) return;

  const whatsapp = footer.querySelector<HTMLAnchorElement>('a[aria-label="WhatsApp"]');
  if (whatsapp) {
    whatsapp.href = VISTIQ_ADMIN_WHATSAPP_URL;
    whatsapp.replaceChildren(createFooterIcon(documentRoot, "whatsapp"));
  }

  const instagram = footer.querySelector<HTMLAnchorElement>('a[aria-label="Instagram"]');
  if (instagram) {
    instagram.href = VISTIQ_INSTAGRAM_URL;
    instagram.replaceChildren(createFooterIcon(documentRoot, "instagram"));
  }

  const watermark = documentRoot.querySelector<HTMLElement>(".idb-watermark-text");
  if (watermark && !watermark.querySelector(".vistiq-footer-logo")) {
    watermark.innerHTML =
      'Made with <img draggable="false" role="img" class="emoji" alt="❤" src="./Undangan Website Spesial 02 Animasi_files/2764.svg"> by <img class="vistiq-footer-logo" src="/vistiq-invitation-logo.png" alt="Vistiq Invitation" style="display:inline-block;width:92px;height:auto;max-height:28px;object-fit:contain;vertical-align:middle;margin-left:4px;">';
  }
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
  setFooterBranding(documentRoot);

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
