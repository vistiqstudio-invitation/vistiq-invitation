"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import type { InvitationData, EventItem } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_PAGE = "/themes/adat-bali-motion/reference/index.html";
const VISTIQ_INSTAGRAM_URL = "https://www.instagram.com/vistiqinvitation/";
const VISTIQ_ADMIN_WHATSAPP_URL = "https://wa.me/6281371338032";
const PURPLE = "#3a125b";
const PURPLE_DEEP = "#2b0b46";
const PURPLE_MID = "#6e2ca0";

const countdownTimers = new WeakMap<HTMLElement, number>();

type StorySlot = {
  image: string;
  title: string;
  description: string;
};

function shortName(person: InvitationData["groom"]) {
  return person.nickname?.trim() || person.name.trim().split(/\s+/)[0] || "Mempelai";
}

function instagramHandle(value: string | null) {
  return value?.trim().replace(/^@/, "") || "";
}

function instagramUrl(value: string | null) {
  const handle = instagramHandle(value);
  return handle ? `https://www.instagram.com/${handle}/` : "https://www.instagram.com/";
}

function widget(documentRoot: Document, id: string) {
  return documentRoot.querySelector<HTMLElement>(`[data-id="${id}"]`);
}

function setWidgetText(documentRoot: Document, id: string, value: string) {
  const root = widget(documentRoot, id);
  if (!root) return;
  const target = root.querySelector<HTMLElement>(".elementor-heading-title, .elementor-widget-container");
  (target || root).textContent = value;
}

function setGuestWidget(documentRoot: Document, id: string, guest: string) {
  const root = widget(documentRoot, id);
  if (!root) return;
  const target = root.querySelector<HTMLElement>(".elementor-heading-title, .elementor-widget-container");
  const content = target || root;
  const lineBreak = documentRoot.createElement("br");
  content.replaceChildren(documentRoot.createTextNode("Kepada Yth."), lineBreak, documentRoot.createTextNode(guest));
}

function setWidgetImage(documentRoot: Document, id: string, source: string, alt: string) {
  const root = widget(documentRoot, id);
  const image = root?.querySelector<HTMLImageElement>("img");
  if (!image) return;
  image.src = source;
  image.alt = alt;
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
}

function setAnchor(anchor: HTMLAnchorElement, href: string) {
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
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

function formatEventDate(event: EventItem) {
  const match = event.date.match(/^(.*?),\s*(\d{1,2})\s+(.+?)\s+(\d{4})$/);
  if (match) {
    return { weekday: match[1], day: match[2], month: match[3], year: match[4] };
  }

  const date = event.rawDate ? new Date(event.rawDate) : new Date(event.date);
  if (!Number.isNaN(date.getTime())) {
    return {
      weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date),
      day: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(date),
      month: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date),
      year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(date),
    };
  }

  return { weekday: "", day: "", month: "", year: "" };
}

function setEventBlock(
  documentRoot: Document,
  event: EventItem,
  ids: { title: string; weekday: string; day: string; month: string; year: string; time: string; location: string; map: string },
  mapsUrl: string,
) {
  const parts = formatEventDate(event);
  setWidgetText(documentRoot, ids.title, event.name);
  setWidgetText(documentRoot, ids.weekday, parts.weekday);
  setWidgetText(documentRoot, ids.day, parts.day);
  setWidgetText(documentRoot, ids.month, parts.month);
  setWidgetText(documentRoot, ids.year, parts.year);
  setWidgetText(documentRoot, ids.time, `Pukul ${event.time} s/d selesai`);

  const locationRoot = widget(documentRoot, ids.location);
  if (locationRoot) {
    const title = locationRoot.querySelector<HTMLElement>(".elementor-icon-box-title span");
    const description = locationRoot.querySelector<HTMLElement>(".elementor-icon-box-description");
    if (title) title.textContent = "Lokasi Acara";
    if (description) description.textContent = event.location;
  }

  const mapRoot = widget(documentRoot, ids.map);
  mapRoot?.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => setAnchor(anchor, mapsUrl));
}

function setCountdown(documentRoot: Document, rawDate: string | null) {
  const countdown = documentRoot.querySelector<HTMLElement>(".elementor-countdown-wrapper");
  const childWindow = documentRoot.defaultView;
  if (!countdown || !childWindow || !rawDate) return;

  const target = new Date(rawDate).getTime();
  if (!Number.isFinite(target)) return;

  const existingTimer = countdownTimers.get(countdown);
  if (existingTimer) childWindow.clearInterval(existingTimer);

  countdown.dataset.date = String(Math.floor(target / 1000));
  const update = () => {
    const remaining = Math.max(0, target - Date.now());
    const values = [
      Math.floor(remaining / 86400000),
      Math.floor((remaining % 86400000) / 3600000),
      Math.floor((remaining % 3600000) / 60000),
      Math.floor((remaining % 60000) / 1000),
    ];
    const digits = countdown.querySelectorAll<HTMLElement>(".elementor-countdown-digits");
    digits.forEach((digit, index) => {
      digit.textContent = index === 0 ? String(values[index]) : String(values[index]).padStart(2, "0");
    });
  };

  update();
  countdownTimers.set(countdown, childWindow.setInterval(update, 1000));
}

function setCalendarLink(documentRoot: Document, invitation: InvitationData, coupleTitle: string) {
  const event = invitation.coverEvent || invitation.events[0];
  if (!event) return;

  const start = event.rawDate ? new Date(event.rawDate) : new Date(event.date);
  if (Number.isNaN(start.getTime())) return;
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const compact = (value: Date) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(coupleTitle)}&dates=${compact(start)}/${compact(end)}&details=${encodeURIComponent("Undangan Vistiq Invitation")}&location=${encodeURIComponent(event.location)}`;
  documentRoot.querySelectorAll<HTMLAnchorElement>('a[href*="calendar/render"]').forEach((anchor) => setAnchor(anchor, href));
}

function setGallery(documentRoot: Document, gallery: string[], stories: InvitationData["story"]) {
  const photos = gallery.filter(Boolean);
  if (!photos.length) return;

  documentRoot.querySelectorAll<HTMLElement>(".e-gallery-item").forEach((item, index) => {
    const source = photos[index % photos.length];
    const image = item.querySelector<HTMLElement>(".e-gallery-image");
    item.setAttribute("href", source);
    item.setAttribute("data-lightbox-title", `Adat Bali ${index + 1}`);
    if (image) {
      image.style.backgroundImage = `url("${source}")`;
      image.dataset.thumbnail = source;
    }
  });

  const storySlots: StorySlot[] = [
    { image: "3d7eb3af", title: "747796af", description: "44652b1a" },
    { image: "579a9a8b", title: "2fb093e1", description: "7b9aa61a" },
    { image: "6142f453", title: "42ce87bd", description: "1eece830" },
    { image: "15f35cf6", title: "dd5c4c3", description: "2681188c" },
  ];

  storySlots.forEach((slot, index) => {
    const story = stories[index];
    if (!story) return;
    setWidgetImage(documentRoot, slot.image, photos[index % photos.length], `Cerita ${story.title}`);
    setWidgetText(documentRoot, slot.title, story.year ? `${story.year} — ${story.title}` : story.title);
    setWidgetText(documentRoot, slot.description, story.description);
  });
}

function setGiftData(documentRoot: Document, invitation: InvitationData, coupleTitle: string) {
  const cards = [
    { root: "6b018e4b", number: "24ce3ab0", owner: "2506799b" },
    { root: "42ffc436", number: "5a1b4728", owner: "31df277f" },
    { root: "6b065621", number: "5d1866d4", owner: "723b981e" },
  ];

  cards.forEach((card, index) => {
    const root = widget(documentRoot, card.root);
    const gift = invitation.gifts[index];
    if (!root) return;
    if (!gift?.accountNumber) {
      root.style.display = "none";
      return;
    }

    root.style.display = "";
    setWidgetText(documentRoot, card.number, gift.accountNumber);
    setWidgetText(documentRoot, card.owner, gift.accountName || gift.owner);
    root.querySelector<HTMLElement>(".copy-content")?.replaceChildren(documentRoot.createTextNode(gift.accountNumber));
    const bankImage = root.querySelector<HTMLImageElement>(".elementor-widget-image img");
    if (bankImage && gift.bankName && ["BCA", "Mandiri"].includes(gift.bankName)) {
      bankImage.src = `/banks/${gift.bankName}.png`;
      bankImage.alt = gift.bankName;
    }
  });

  const addressRoot = widget(documentRoot, "9eaab1a");
  if (addressRoot) {
    setWidgetText(documentRoot, "7cf94aba", coupleTitle);
    setWidgetText(documentRoot, "6a3f8680", invitation.coverEvent?.location || invitation.events[0]?.location || "—");
    const copy = addressRoot.querySelector<HTMLElement>(".copy-content");
    if (copy) copy.textContent = invitation.coverEvent?.location || "—";
  }
}

function createIcon(documentRoot: Document, kind: "instagram" | "whatsapp") {
  const icon = documentRoot.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", kind === "whatsapp" ? "0 0 32 32" : "0 0 24 24");
  icon.setAttribute("width", "20");
  icon.setAttribute("height", "20");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.innerHTML =
    kind === "instagram"
      ? '<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.45" cy="6.65" r="1.05" fill="currentColor"/>'
      : '<path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.73 3.03 15.79c0 2.25.6 4.45 1.74 6.38L3 28.55l6.6-1.7a13.1 13.1 0 0 0 6.43 1.63h.01c7.17 0 13.01-5.74 13.01-12.79C29.05 8.64 23.21 3 16.04 3Zm0 23.32h-.01a10.9 10.9 0 0 1-5.55-1.49l-.4-.23-3.92 1.01 1.05-3.75-.26-.39a10.5 10.5 0 0 1-1.68-5.68c0-5.87 4.83-10.64 10.78-10.64 5.94 0 10.77 4.77 10.77 10.64 0 5.86-4.84 10.53-10.78 10.53Zm5.91-7.98c-.32-.16-1.92-.93-2.22-1.03-.29-.11-.51-.16-.72.16-.22.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.61-1.56a9.7 9.7 0 0 1-1.81-2.22c-.19-.32-.02-.49.14-.65.15-.14.33-.37.49-.55.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.15-.73-1.72-.99-2.36-.27-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.31-1.14 1.09-1.14 2.67 0 1.57 1.16 3.09 1.32 3.3.16.21 2.29 3.44 5.54 4.82.78.33 1.38.52 1.85.67.78.24 1.48.21 2.04.13.62-.09 1.92-.78 2.19-1.52.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.63-.37Z"/>';
  return icon;
}

function replaceFontAwesomeIcon(documentRoot: Document, anchor: HTMLAnchorElement, kind: "instagram" | "whatsapp") {
  const oldIcon = anchor.querySelector("i.fa-instagram, i.fab.fa-instagram, i.fa-whatsapp, i.fab.fa-whatsapp");
  if (oldIcon) oldIcon.replaceWith(createIcon(documentRoot, kind));
}

function setSocialLinks(documentRoot: Document, invitation: InvitationData) {
  const coupleSocials = [
    { id: "26d7ca8f", value: invitation.bride.instagram },
    { id: "74150bc4", value: invitation.groom.instagram },
  ];

  coupleSocials.forEach(({ id, value }) => {
    const root = widget(documentRoot, id);
    const anchor = root?.querySelector<HTMLAnchorElement>("a");
    if (!anchor) return;
    setAnchor(anchor, instagramUrl(value));
    replaceFontAwesomeIcon(documentRoot, anchor, "instagram");
    const label = anchor.querySelector<HTMLElement>(".elementor-button-text");
    if (label) label.textContent = instagramHandle(value) || "Instagram";
  });

  documentRoot.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
    if (anchor.querySelector("i.fa-whatsapp, i.fab.fa-whatsapp")) {
      const raw = invitation.contactWhatsapp?.trim() || "";
      const whatsapp = raw.startsWith("http")
        ? raw
        : raw
          ? `https://wa.me/${raw.replace(/\D/g, "").replace(/^0/, "62")}`
          : VISTIQ_ADMIN_WHATSAPP_URL;
      setAnchor(anchor, whatsapp);
      replaceFontAwesomeIcon(documentRoot, anchor, "whatsapp");
    }
  });
}

function addVistiqFooter(documentRoot: Document) {
  if (documentRoot.querySelector(".vistiq-adat-bali-motion-brand")) return;
  const host = widget(documentRoot, "736eda7b") || documentRoot.body;
  if (!host) return;

  const brand = documentRoot.createElement("div");
  brand.className = "vistiq-adat-bali-motion-brand";
  const label = documentRoot.createElement("span");
  label.textContent = "Vistiq Invitation";
  brand.append(label);

  const instagram = documentRoot.createElement("a");
  instagram.setAttribute("aria-label", "Instagram Vistiq Invitation");
  instagram.append(createIcon(documentRoot, "instagram"));
  setAnchor(instagram, VISTIQ_INSTAGRAM_URL);

  const whatsapp = documentRoot.createElement("a");
  whatsapp.setAttribute("aria-label", "WhatsApp Admin Vistiq Invitation");
  whatsapp.append(createIcon(documentRoot, "whatsapp"));
  setAnchor(whatsapp, VISTIQ_ADMIN_WHATSAPP_URL);

  brand.append(instagram, whatsapp);
  host.append(brand);
}

function wireLocalForms(documentRoot: Document) {
  documentRoot.addEventListener(
    "submit",
    (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || !form.matches(".wds-rsvp-only__form, .wds-wishes__form")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const message = form.querySelector<HTMLElement>(".wds-rsvp-only__message, .wds-wishes__message");
      if (message) {
        message.textContent = form.matches(".wds-wishes__form")
          ? "Terima kasih, ucapan Anda sudah diterima."
          : "Terima kasih, konfirmasi kehadiran Anda sudah diterima.";
        message.classList.remove("is-hidden");
      }
    },
    true,
  );
}

function removeThirdPartyVideo(documentRoot: Document) {
  documentRoot.querySelector<HTMLElement>('[data-id="7fb120df"]')?.remove();

  documentRoot.querySelectorAll<HTMLIFrameElement>(
    'iframe[src*="youtube.com"], iframe[src*="youtu.be"], iframe[src*="pWtP7PPaQtI"]',
  ).forEach((frame) => frame.remove());

  documentRoot.querySelectorAll<HTMLAnchorElement>('a[href*="youtube.com"], a[href*="youtu.be"]').forEach((anchor) => {
    anchor.closest<HTMLElement>('[data-id="5a9868e"]')?.remove();
    if (anchor.isConnected) anchor.remove();
  });
}

function removeThirdPartyAudio(documentRoot: Document) {
  documentRoot.querySelector('[data-widget_type="wds_audio.default"]')?.remove();
  documentRoot.querySelector("#wds_audio_play")?.closest<HTMLElement>('[data-widget_type="wds_audio.default"]')?.remove();
  documentRoot.querySelectorAll<HTMLScriptElement>("script").forEach((script) => {
    if (script.textContent?.includes("WdsAudio")) script.remove();
  });
}

function appendOverrides(documentRoot: Document, coupleTitle: string) {
  if (documentRoot.getElementById("vistiq-adat-bali-motion-overrides")) return;
  const style = documentRoot.createElement("style");
  style.id = "vistiq-adat-bali-motion-overrides";
  style.textContent = `
    :root, body { background: ${PURPLE_DEEP} !important; }
    body, body[unresolved] { opacity: 1 !important; visibility: visible !important; display: block !important; }
    .elementor-invisible, [data-aos] { visibility: visible !important; opacity: 1 !important; }
    html.vistiq-cover-locked, html.vistiq-cover-locked body { height: 100% !important; overflow: hidden !important; touch-action: none !important; }
    html.vistiq-cover-open #bukaUndangan .elementor-background-video-hosted { display: block !important; visibility: visible !important; opacity: 1 !important; }
    html.vistiq-cover-open #bukaUndangan .elementor-widget-heading { animation-delay: 0ms !important; visibility: visible !important; opacity: 1 !important; }
    #wds_audio_play { display: none !important; }
    [data-id="7fb120df"] { display: none !important; }
    [data-id="2ea54e2e"], [data-id="217a781e"] { background-color: ${PURPLE} !important; }
    [data-id="38e771dc"] .elementor-button,
    [data-id="26d7ca8f"] .elementor-button,
    [data-id="74150bc4"] .elementor-button,
    [data-id="7a5ada9b"] .elementor-button,
    [data-id="655f782e"] .elementor-button,
    [data-id="7b041181"] .elementor-button {
      background-color: ${PURPLE} !important;
      background-image: linear-gradient(180deg, ${PURPLE_MID} 0%, ${PURPLE_DEEP} 100%) !important;
    }
    .vistiq-adat-bali-motion-brand { display:flex; align-items:center; justify-content:center; gap:12px; margin:24px auto 0; padding:10px 16px; color:#fff; font:500 12px/1.3 Poppins, sans-serif; letter-spacing:.04em; opacity:.95; }
    .vistiq-adat-bali-motion-brand a { display:inline-flex; color:#fff; align-items:center; justify-content:center; text-decoration:none; }
    .vistiq-adat-bali-motion-brand svg { display:block; }
  `;
  documentRoot.head.append(style);
  documentRoot.body.dataset.vistiqCouple = coupleTitle;
}

function initialiseCoverFlow(documentRoot: Document) {
  const html = documentRoot.documentElement;
  const body = documentRoot.body;
  const button = documentRoot.querySelector<HTMLAnchorElement>("#tombolBuka a");
  const opening = documentRoot.querySelector<HTMLElement>("#bukaUndangan");
  if (!html || !body || !button || !opening) return;

  html.classList.add("vistiq-cover-locked");
  body.style.overflowY = "hidden";
  body.style.touchAction = "none";

  if (button.dataset.vistiqCoverFlowBound === "true") return;
  button.dataset.vistiqCoverFlowBound = "true";

  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (html.classList.contains("vistiq-cover-open")) return;

    html.classList.remove("vistiq-cover-locked");
    html.classList.add("vistiq-cover-open");
    body.style.overflowY = "auto";
    body.style.touchAction = "auto";

    const video = opening.querySelector<HTMLVideoElement>("video.elementor-background-video-hosted");
    if (video) {
      video.autoplay = true;
      video.style.setProperty("display", "block", "important");
      video.style.setProperty("visibility", "visible", "important");
      video.style.setProperty("opacity", "1", "important");
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    }

    opening.querySelectorAll<HTMLElement>(".elementor-widget-heading").forEach((element) => {
      element.classList.remove("elementor-invisible");
      element.style.animationDelay = "0ms";
      element.style.visibility = "visible";
      element.style.opacity = "1";
    });

    window.setTimeout(() => opening.scrollIntoView({ behavior: "auto", block: "start" }), 30);
  });
}

function localizeLinks(documentRoot: Document) {
  const openButton = documentRoot.querySelector<HTMLAnchorElement>("#tombolBuka a");
  if (openButton) openButton.href = "#bukaUndangan";

  documentRoot.querySelectorAll<HTMLAnchorElement>('a[href*="hallomoment.my.id"], a[href^="/demo/adat-bali-motion"]').forEach((anchor) => {
    const hash = anchor.hash;
    anchor.href = hash || "#home";
  });
}

function initialiseScrollMotion(documentRoot: Document) {
  const body = documentRoot.body;
  body?.removeAttribute("unresolved");
  if (body) {
    body.style.opacity = "1";
    body.style.visibility = "visible";
  }

  documentRoot.querySelectorAll<HTMLElement>(".elementor-invisible").forEach((element) => {
    element.classList.remove("elementor-invisible");
  });

  const animated = Array.from(documentRoot.querySelectorAll<HTMLElement>("[data-aos]"));
  animated.forEach((element) => {
    element.classList.add("aos-init");
    element.style.visibility = "visible";
  });

  const reveal = (element: HTMLElement) => element.classList.add("aos-animate");
  const view = documentRoot.defaultView;
  if (!animated.length || !view || !view.IntersectionObserver) {
    animated.forEach(reveal);
    return;
  }

  const observer = new view.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        reveal(element);
      } else {
        element.classList.remove("aos-animate");
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

  animated.forEach((element) => observer.observe(element));
}

function applyInvitationData(documentRoot: Document, invitation: InvitationData, guest: string) {
  const groomShort = shortName(invitation.groom);
  const brideShort = shortName(invitation.bride);
  const coupleTitle = `${groomShort} & ${brideShort}`;
  const coverEvent = invitation.coverEvent || invitation.events[0];
  const firstEvent = invitation.events[0];
  const mapsUrl = invitation.mapsUrl || "https://maps.google.com";

  documentRoot.title = `${coupleTitle} — 3D Motion Adat Bali`;
  documentRoot.documentElement.lang = "id";
  initialiseScrollMotion(documentRoot);

  replaceText(documentRoot, "Elyana & Syahril", coupleTitle);
  replaceText(documentRoot, "Elyana Azkiya Nur", invitation.bride.name);
  replaceText(documentRoot, "Syahril Rendra Backhtiar", invitation.groom.name);
  replaceText(documentRoot, "Elyana", brideShort);
  replaceText(documentRoot, "Syahril", groomShort);
  replaceText(documentRoot, "Minggu, 14 September 2026", coverEvent?.date || "");

  setWidgetText(documentRoot, "23b0e096", coupleTitle);
  setWidgetText(documentRoot, "64fb35", coupleTitle);
  setWidgetText(documentRoot, "7cf94aba", coupleTitle);
  setWidgetText(documentRoot, "2e1c36ee", coupleTitle);
  setWidgetText(documentRoot, "4b691464", brideShort);
  setWidgetText(documentRoot, "240913d3", groomShort);
  setWidgetText(documentRoot, "6028e7c3", brideShort.slice(0, 1).toUpperCase());
  setWidgetText(documentRoot, "4ea8e3ba", groomShort.slice(0, 1).toUpperCase());
  if (coverEvent) setWidgetText(documentRoot, "a160f53", coverEvent.date);
  setGuestWidget(documentRoot, "16c0cd89", guest);

  if (invitation.coverImage) {
    setWidgetImage(documentRoot, "10d02f95", invitation.coverImage, coupleTitle);
  }

  setWidgetImage(documentRoot, "514ffad0", invitation.bride.photo || "/photos/adat-bali-bride.webp", invitation.bride.name);
  setWidgetImage(documentRoot, "3c269c52", invitation.groom.photo || "/photos/adat-bali-groom.webp", invitation.groom.name);
  setWidgetText(documentRoot, "5b0f10f9", brideShort);
  setWidgetText(documentRoot, "cf0c52", invitation.bride.name);
  setWidgetText(documentRoot, "58174033", invitation.bride.parents || "");
  setWidgetText(documentRoot, "413ff3fb", groomShort);
  setWidgetText(documentRoot, "4995f5ed", invitation.groom.name);
  setWidgetText(documentRoot, "2d5b4241", invitation.groom.parents || "");

  if (invitation.opening.quote) setWidgetText(documentRoot, "6bf6ebb7", invitation.opening.quote);
  if (invitation.opening.quoteSource) setWidgetText(documentRoot, "13a55786", invitation.opening.quoteSource);
  if (invitation.opening.greeting) setWidgetText(documentRoot, "5f174049", invitation.opening.greeting);
  if (invitation.opening.description) setWidgetText(documentRoot, "269f6844", invitation.opening.description);

  if (invitation.events[0]) {
    setEventBlock(documentRoot, invitation.events[0], {
      title: "7754cb23", weekday: "12e54bb2", day: "83d8272", month: "4055a056", year: "1e8f9f50", time: "625aac09", location: "dacf3b2", map: "7a5ada9b",
    }, mapsUrl);
  }
  if (invitation.events[1]) {
    setEventBlock(documentRoot, invitation.events[1], {
      title: "62eb9216", weekday: "e8a3463", day: "2db74fa", month: "12ff2fad", year: "7d9142ae", time: "7cf3fdb8", location: "522fae74", map: "655f782e",
    }, mapsUrl);
  }

  documentRoot.querySelectorAll<HTMLAnchorElement>('a[href*="google.com/maps"], a[href*="share.google"], a[href*="maps.app.goo.gl"]').forEach((anchor) => setAnchor(anchor, mapsUrl));
  setCalendarLink(documentRoot, invitation, coupleTitle);
  setCountdown(documentRoot, coverEvent?.rawDate || firstEvent?.rawDate || null);

  setGallery(documentRoot, invitation.gallery, invitation.story);
  removeThirdPartyVideo(documentRoot);
  removeThirdPartyAudio(documentRoot);
  setBackgroundVideo(documentRoot, invitation.videoUrl);
  setGiftData(documentRoot, invitation, coupleTitle);
  setSocialLinks(documentRoot, invitation);
  setAudioSource(documentRoot, invitation.musicUrl);
  localizeLinks(documentRoot);
  wireLocalForms(documentRoot);
  addVistiqFooter(documentRoot);
  appendOverrides(documentRoot, coupleTitle);
  initialiseCoverFlow(documentRoot);

  const titleMeta = documentRoot.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (titleMeta) titleMeta.content = coupleTitle;
  const imageMeta = documentRoot.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  if (imageMeta && invitation.coverImage) imageMeta.content = invitation.coverImage;
}

function setBackgroundVideo(documentRoot: Document, videoUrl: string | null) {
  if (!videoUrl) return;
  const video = documentRoot.querySelector<HTMLVideoElement>("#bukaUndangan video.elementor-background-video-hosted");
  if (!video) return;
  video.src = videoUrl;
  video.muted = true;
  video.autoplay = false;
  video.playsInline = true;
  video.style.setProperty("display", "block", "important");
  video.style.setProperty("visibility", "visible", "important");
  video.style.setProperty("opacity", "1", "important");
  video.load();
  video.pause();
  video.currentTime = 0;
}

function setAudioSource(documentRoot: Document, musicUrl: string | null) {
  if (!musicUrl) return;
  documentRoot.querySelectorAll<HTMLAudioElement>("audio").forEach((audio) => {
    const source = audio.querySelector<HTMLSourceElement>("source");
    if (source) source.src = musicUrl;
    audio.src = musicUrl;
    audio.load();
  });
}

export default function AdatBaliMotion({ invitation }: { invitation: InvitationData }) {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const guest = searchParams.get("to")?.trim() || "Bapak/Ibu/Saudara/i";

  const handleLoad = useCallback(() => {
    const hydrate = () => {
      const documentRoot = iframeRef.current?.contentDocument;
      if (documentRoot) applyInvitationData(documentRoot, invitation, guest);
    };

    hydrate();
    window.setTimeout(hydrate, 250);
    window.setTimeout(hydrate, 1000);
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
