"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { EventItem, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_SOURCE = "/themes/azure-bloom/reference/source.html";
const REFERENCE_DIRECTORY = "/themes/azure-bloom/reference/";
const OPENING_MOTION = "/themes/azure-bloom/opening-motion.mp4";
const OUR_PHOTO_DIRECTORY = "/photos/luxury-art-love-paradise/";
const THEME_COVER = `${OUR_PHOTO_DIRECTORY}couple-cover.webp`;
const THEME_LOVE_STORY = `${OUR_PHOTO_DIRECTORY}hero.webp`;
const THEME_PURPLE = "#7046a3";
const THEME_PURPLE_DARK = "#59367f";
const THEME_PURPLE_LIGHT = "#9876c2";
const ADMIN_WHATSAPP_URL = "https://wa.me/6281371338032";
const ADMIN_WHATSAPP_MESSAGE = "Saya mau pesan undangan seperti ini juga";

const REFERENCE_PAPER = `${REFERENCE_DIRECTORY}paper-bg.webp`;
const REFERENCE_PROFILE = `${REFERENCE_DIRECTORY}profile-bg-1.webp`;

const PLACEHOLDER_INTRO =
  "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami.";

type FrameCleanup = () => void;

function sourceWithoutHash(value: string | null | undefined) {
  return value?.split("#", 1)[0]?.trim() || "";
}

function displayName(person: InvitationData["groom"] | InvitationData["bride"]) {
  return person.nickname?.trim() || person.name.trim();
}

function coupleName(invitation: InvitationData) {
  return `${displayName(invitation.groom)} & ${displayName(invitation.bride)}`;
}

function decodeGuest(value: string | null) {
  if (!value) return "";

  try {
    return decodeURIComponent(value.replace(/\+/g, " ")).trim();
  } catch {
    return value.trim();
  }
}

function setText(doc: Document, selector: string, value: string) {
  const element = doc.querySelector<HTMLElement>(selector);
  if (element) element.textContent = value;
}

function setLink(doc: Document, selector: string, href: string | null | undefined) {
  if (!href) return;
  const element = doc.querySelector<HTMLAnchorElement>(selector);
  if (!element) return;

  element.href = sourceWithoutHash(href) || href;
  element.target = "_blank";
  element.rel = "nofollow noopener noreferrer";
}

function setImage(
  doc: Document,
  selector: string,
  src: string | null | undefined,
  alt: string,
) {
  const image = doc.querySelector<HTMLImageElement>(selector);
  const value = sourceWithoutHash(src);
  if (!image || !value) return;

  image.src = value;
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.alt = alt;
}

type ReferenceIconKind = "envelope" | "location" | "instagram" | "gift" | "whatsapp";

const REFERENCE_ICON_MARKUP: Record<ReferenceIconKind, string> = {
  envelope:
    '<path d="M3.75 5.25h16.5A1.75 1.75 0 0 1 22 7v10a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 17V7a1.75 1.75 0 0 1 1.75-1.75Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m3 6.5 9 6.25 9-6.25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  location:
    '<path d="M12 21s7-6.15 7-11a7 7 0 1 0-14 0c0 4.85 7 11 7 11Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.35" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  instagram:
    '<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.45" cy="6.65" r="1.05" fill="currentColor"/>',
  gift:
    '<path d="M3.25 10.25h17.5v10.5H3.25zM2.5 6.75h19v3.5h-19zM12 6.75v14M12 6.75H8.65A2.65 2.65 0 1 1 12 4.1v2.65Zm0 0h3.35A2.65 2.65 0 1 0 12 4.1v2.65Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  whatsapp:
    '<path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.73 3.03 15.79c0 2.25.6 4.45 1.74 6.38L3 28.55l6.6-1.7a13.1 13.1 0 0 0 6.43 1.63h.01c7.17 0 13.01-5.74 13.01-12.79C29.05 8.64 23.21 3 16.04 3Zm0 23.32h-.01a10.9 10.9 0 0 1-5.55-1.49l-.4-.23-3.92 1.01 1.05-3.75-.26-.39a10.5 10.5 0 0 1-1.68-5.68c0-5.87 4.83-10.64 10.78-10.64 5.94 0 10.77 4.77 10.77 10.64 0 5.86-4.84 10.53-10.78 10.53Zm5.91-7.98c-.32-.16-1.92-.93-2.22-1.03-.29-.11-.51-.16-.72.16-.22.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.61-1.56a9.7 9.7 0 0 1-1.81-2.22c-.19-.32-.02-.49.14-.65.15-.14.33-.37.49-.55.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.15-.73-1.72-.99-2.36-.27-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.31-1.14 1.09-1.14 2.67 0 1.57 1.16 3.09 1.32 3.3.16.21 2.29 3.44 5.54 4.82.78.33 1.38.52 1.85.67.78.24 1.48.21 2.04.13.62-.09 1.92-.78 2.19-1.52.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.63-.37Z"/>',
};

function createReferenceIcon(doc: Document, kind: ReferenceIconKind) {
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `vistiq-inline-icon vistiq-inline-icon-${kind}`);
  svg.setAttribute("viewBox", kind === "whatsapp" ? "0 0 32 32" : "0 0 24 24");
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = REFERENCE_ICON_MARKUP[kind];
  return svg;
}

function replaceReferenceIcons(doc: Document) {
  doc.querySelectorAll<HTMLElement>("i").forEach((icon) => {
    const className = icon.className;
    let kind: ReferenceIconKind | null = null;

    if (className.includes("fa-envelope")) kind = "envelope";
    else if (className.includes("fa-map-marker")) kind = "location";
    else if (className.includes("fa-instagram")) kind = "instagram";
    else if (className.includes("fa-gift")) kind = "gift";
    else if (className.includes("fa-whatsapp")) kind = "whatsapp";

    if (!kind) return;

    icon.replaceWith(createReferenceIcon(doc, kind));
  });
}

function setEventPlace(doc: Document, selector: string, location: string) {
  const element = doc.querySelector<HTMLElement>(selector);
  if (!element) return;

  element.replaceChildren();
  element.append(doc.createTextNode("Tempat : "));

  const wrapper = doc.createElement("span");
  wrapper.className = "niku-multiline";
  const place = doc.createElement("strong");
  place.textContent = location;
  wrapper.append(place);
  element.append(wrapper);
}

function setQuote(doc: Document, quote: string, source: string) {
  const element = doc.querySelector<HTMLElement>(
    "#date .elementor-element-13baa66b .elementor-heading-title",
  );
  if (!element) return;

  element.replaceChildren();
  element.append(doc.createTextNode(`"${quote}"`));
  element.append(doc.createElement("br"), doc.createElement("br"));
  element.append(doc.createTextNode(`(${source})`));
}

function setWatermark(doc: Document, brandName: string) {
  const watermark = doc.querySelector<HTMLElement>(".idb-watermark-text");
  if (!watermark) return;

  const heart = watermark.querySelector("img");
  watermark.replaceChildren(doc.createTextNode("Made with "));
  if (heart) watermark.append(heart);
  watermark.append(doc.createTextNode(` by ${brandName}`));
}

function setAudioSource(doc: Document, musicUrl: string | null | undefined) {
  const source = sourceWithoutHash(musicUrl);
  if (!source) return;

  doc.querySelectorAll<HTMLAudioElement>(".idb-audio-el").forEach((audio) => {
    audio.preload = "none";
    const sourceElement = audio.querySelector<HTMLSourceElement>("source");
    if (sourceElement) sourceElement.src = source;
    audio.src = source;
  });
}

function setGallery(doc: Document, invitation: InvitationData) {
  const photos = invitation.gallery
    .map(sourceWithoutHash)
    .filter(Boolean);

  const fallback = [
    sourceWithoutHash(invitation.coverImage),
    sourceWithoutHash(invitation.groom.photo),
    sourceWithoutHash(invitation.bride.photo),
    sourceWithoutHash(invitation.coverImage),
  ].filter(Boolean);

  const slots = Array.from(doc.querySelectorAll<HTMLElement>(".e-gallery-item"));
  slots.forEach((slot, index) => {
    const photo = photos[index] || fallback[index] || fallback[0];
    if (!photo) return;

    slot.setAttribute("href", photo);
    slot.removeAttribute("data-e-action-hash");
    const image = slot.querySelector<HTMLElement>(".e-gallery-image");
    if (!image) return;

    image.dataset.thumbnail = photo;
    image.style.backgroundImage = `url("${photo}")`;
  });
}

function updateCountdown(doc: Document, event: EventItem | undefined) {
  if (!event?.rawDate) return () => undefined;

  const raw = event.rawDate.trim();
  const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw)
    ? raw
    : `${raw}+07:00`;
  const target = new Date(normalized).getTime();
  if (!Number.isFinite(target)) return () => undefined;

  const countdown = doc.querySelector<HTMLElement>(".idb-countdown");
  if (!countdown) return () => undefined;

  countdown.dataset.target = String(target);
  countdown.dataset.targetIso = new Date(target).toISOString();

  const render = () => {
    const remaining = Math.max(0, target - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const values: Record<string, number> = { days, hours, minutes, seconds };
    Object.entries(values).forEach(([part, value]) => {
      const element = countdown.querySelector<HTMLElement>(
        `[data-part="${part}"] [data-role="num"]`,
      );
      if (element) element.textContent = String(value).padStart(2, "0");
    });
  };

  render();
  const timer = window.setInterval(render, 1000);
  return () => window.clearInterval(timer);
}

function addRsvpEntry(
  doc: Document,
  name: string,
  message: string,
  attendance: Attendance,
) {
  const list = doc.querySelector<HTMLUListElement>(".rsvp-list");
  if (!list) return;

  const item = doc.createElement("li");
  item.className = "rsvp-item";

  const avatar = doc.createElement("div");
  avatar.className = "rsvp-ava";
  avatar.textContent = name.charAt(0).toUpperCase();

  const body = doc.createElement("div");
  body.className = "rsvp-body";

  const headline = doc.createElement("div");
  headline.className = "rsvp-headline";
  const author = doc.createElement("span");
  author.className = "rsvp-name";
  author.textContent = name;
  headline.append(author, doc.createTextNode(" "));

  const status = doc.createElement("span");
  status.className = `rsvp-status-label rsvp-status-${attendance === "Hadir" ? "hadir" : "tidak"}`;
  status.textContent = attendance;
  headline.append(status);

  const meta = doc.createElement("div");
  meta.className = "rsvp-meta";
  meta.textContent = "Baru saja";

  const copy = doc.createElement("div");
  copy.className = "rsvp-msg";
  copy.textContent = message;

  body.append(headline, meta, copy);
  item.append(avatar, body);
  list.prepend(item);
}

function renderExistingRsvpEntries(
  doc: Document,
  entries: Array<{ name: string; message: string; attendance: Attendance }>,
) {
  const list = doc.querySelector<HTMLUListElement>(".rsvp-list");
  if (!list || entries.length === 0) return;

  list.replaceChildren();
  entries.forEach((entry) => {
    addRsvpEntry(doc, entry.name, entry.message, entry.attendance);
  });
}

function prepareReference(
  doc: Document,
  invitation: InvitationData,
  guest: string,
  onOpen: () => void,
  submitRsvp: (
    input: {
      name: string;
      whatsapp: string;
      attendance: Attendance;
      message: string;
    },
  ) => Promise<{ error: string | null | undefined }>,
  isSubmitting: () => boolean,
): FrameCleanup {
  const view = doc.defaultView;
  const couple = coupleName(invitation);
  const groomName = displayName(invitation.groom);
  const firstEvent = invitation.events[0];
  const secondEvent = invitation.events[1] || firstEvent;
  const guestName = guest || "Nama Tamu";
  const instagram = invitation.groom.instagram || invitation.bride.instagram;
  const brandName = invitation.brand?.name || "Vistiq Invitation";

  const root = doc.querySelector<HTMLElement>(".elementor-33329");
  const cover = doc.getElementById("sec");
  const coverColumn = doc.getElementById("kolom");
  const body = doc.body;

  if (root) root.dataset.vistiqClone = "true";
  if (body) {
    body.dataset.idbCoverClosed = "1";
    body.style.position = "fixed";
    body.style.height = "calc(var(--vh, 1vh) * 100)";
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflowY = "scroll";
    body.style.overflowX = "hidden";
  }

  if (doc.documentElement && view) {
    doc.documentElement.style.setProperty("--vh", `${view.innerHeight * 0.01}px`);
  }

  if (cover) {
    cover.style.opacity = "1";
    cover.style.visibility = "visible";
    cover.style.transition = "none";
  }
  if (coverColumn) {
    coverColumn.style.transform = "translateY(0)";
    coverColumn.style.transition = "none";
  }

  doc.querySelectorAll<HTMLElement>("#sec .idb-reveal.idb-ef").forEach((element) => {
    element.classList.add("active");
  });

  setText(doc, "#sec .elementor-element-2609fb97 .elementor-widget-container", couple);
  setText(doc, "#sec .elementor-element-609919c9 .elementor-widget-container", guestName);
  setText(doc, "#home .elementor-element-1b81d2a1 .elementor-heading-title", couple);
  setText(
    doc,
    "#home .elementor-element-3da322da .elementor-widget-container",
    invitation.opening.description?.trim() || "Kami berharap Anda menjadi bagian dari hari istimewa kami.",
  );
  setText(doc, "#home .elementor-element-31d6eccf .elementor-widget-container", firstEvent?.date || "");

  setText(doc, "#mempelai .elementor-element-5db6a90 .elementor-heading-title", invitation.opening.greeting?.trim() || "Assalamu'alaikum Wr. Wb");
  setText(doc, "#mempelai .elementor-element-54f7706b .elementor-widget-container", PLACEHOLDER_INTRO);
  setText(doc, "#mempelai .elementor-element-5e230f64 .elementor-heading-title", invitation.groom.name);
  setText(doc, "#mempelai .elementor-element-1fba950c .elementor-widget-container", invitation.groom.parents || "");
  setText(doc, "#mempelai .elementor-element-5b4d997b .elementor-heading-title", invitation.bride.name);
  setText(doc, "#mempelai .elementor-element-35980867 .elementor-widget-container", invitation.bride.parents || "");

  setImage(doc, "#home .elementor-element-2277f517 img", invitation.coverImage, couple);
  setImage(doc, ".elementor-element-65a5beb8.story img", THEME_LOVE_STORY, "Love Story");
  setImage(doc, "#mempelai .elementor-element-19be02e5 img", invitation.groom.photo, invitation.groom.name);
  setImage(doc, "#mempelai .elementor-element-7d0c7c16 img", invitation.bride.photo, invitation.bride.name);
  setImage(doc, ".elementor-element-2f3b2d9a img", invitation.coverImage, couple);

  setLink(doc, "#mempelai .elementor-element-68904f21 a", invitation.groom.instagram ? `https://www.instagram.com/${invitation.groom.instagram}` : null);
  setLink(doc, "#mempelai .elementor-element-5ef3be7f a", invitation.bride.instagram ? `https://www.instagram.com/${invitation.bride.instagram}` : null);

  setText(doc, "#date .elementor-element-157099ba .elementor-widget-container", firstEvent?.date || "");
  setText(doc, "#date .elementor-element-71face8a .elementor-widget-container", firstEvent ? `Pukul : ${firstEvent.time}` : "");
  setEventPlace(doc, "#date .elementor-element-3eaff97b .elementor-widget-container", firstEvent?.location || "");
  setText(doc, "#date .elementor-element-3e28174d .elementor-widget-container", secondEvent?.date || "");
  setText(doc, "#date .elementor-element-25a7de9e .elementor-widget-container", secondEvent ? `Pukul : ${secondEvent.time}` : "");
  setEventPlace(doc, "#date .elementor-element-3f33b338 .elementor-widget-container", secondEvent?.location || "");
  setQuote(
    doc,
    invitation.opening.quote?.trim() || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri.",
    invitation.opening.quoteSource?.trim() || "QS. Ar-Rum : 21",
  );

  setText(doc, ".stream-con .elementor-element-5de6c857 .elementor-widget-container", firstEvent?.date || "");
  setText(doc, ".stream-con .elementor-element-fc08f57 .elementor-widget-container", firstEvent ? `Pukul : ${firstEvent.time}` : "");
  setText(doc, ".stream-con .elementor-element-78228d40 .idb-social-icons__text", instagram ? `@${instagram}` : `@${groomName}`);
  setLink(doc, ".stream-con .elementor-element-78228d40 a", instagram ? `https://www.instagram.com/${instagram}` : null);
  doc.querySelectorAll<HTMLAnchorElement>("[data-idb-maps-link]").forEach((link) => {
    const mapsUrl = invitation.mapsUrl || invitation.mapsEmbedUrl;
    if (mapsUrl) link.href = sourceWithoutHash(mapsUrl) || mapsUrl;
  });
  const saveDate = doc.querySelector<HTMLAnchorElement>("#home .elementor-element-9ffa1e4 a");
  if (saveDate) saveDate.href = "#date";

  setAudioSource(doc, invitation.musicUrl);
  setGallery(doc, invitation);

  const quoteVideo = doc.querySelector<HTMLIFrameElement>(".bisdev-invite-video__iframe");
  if (quoteVideo && sourceWithoutHash(invitation.videoUrl)) quoteVideo.src = sourceWithoutHash(invitation.videoUrl);

  const giftCards = Array.from(doc.querySelectorAll<HTMLElement>(".no-rekening-marker"));
  giftCards.forEach((marker, index) => {
    const account = invitation.gifts[index];
    if (!account) return;

    marker.textContent = account.accountNumber || "";
    const card = marker.closest<HTMLElement>(".idb-copy-rek");
    card?.setAttribute("data-copy", account.accountNumber || "");
    const name = card?.querySelector<HTMLElement>(".idb-copy-rek__name");
    if (name) name.textContent = account.accountName || "";
    const bank = card?.querySelector<HTMLElement>(".idb-copy-rek__banktext");
    if (bank) bank.textContent = account.bankName || "";
  });

  const giftRecipient = doc.querySelectorAll<HTMLElement>(".idb-kirim-hadiah__value")[0];
  if (giftRecipient && invitation.gifts[0]?.accountName) {
    giftRecipient.textContent = invitation.gifts[0].accountName;
  }

  const footerSocial = doc.querySelector<HTMLElement>(".elementor-element-4a8e37fd .idb-social-icons");
  if (footerSocial) {
    const adminLink = doc.createElement("a");
    adminLink.className = "idb-social-icons__item elementor-animation-grow";
    adminLink.href = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(ADMIN_WHATSAPP_MESSAGE)}`;
    adminLink.target = "_blank";
    adminLink.rel = "nofollow noopener noreferrer";
    adminLink.setAttribute("aria-label", "Pesan undangan melalui WhatsApp");
    adminLink.title = "Pesan undangan melalui WhatsApp";
    adminLink.append(createReferenceIcon(doc, "whatsapp"));
    footerSocial.replaceChildren(adminLink);
  }

  setText(doc, ".elementor-element-76c781d0 .elementor-widget-container", couple);
  setWatermark(doc, brandName);

  const countdownCleanup = updateCountdown(doc, firstEvent);

  const gift = doc.getElementById("amplop");
  const giftToggle = doc.querySelector<HTMLElement>("#klik .elementor-button");
  const giftCardsToReveal = gift
    ? Array.from(gift.querySelectorAll<HTMLElement>(".idb-copy-rek, .idb-kirim-hadiah"))
    : [];
  const setGiftVisibility = (visible: boolean) => {
    if (!gift) return;

    gift.style.display = visible ? "" : "none";
    gift.setAttribute("aria-hidden", visible ? "false" : "true");
    giftCardsToReveal.forEach((card, index) => {
      card.classList.toggle("elementor-invisible", !visible);
      if (visible) {
        card.classList.add("animated", "zoomIn");
        card.style.animationDelay = `${index * 120}ms`;
      } else {
        card.classList.remove("animated", "zoomIn");
        card.style.animationDelay = "";
      }
    });
    giftToggle?.setAttribute("aria-expanded", String(visible));
  };
  const toggleGift = () => {
    setGiftVisibility(gift?.style.display === "none");
  };
  if (giftToggle) {
    giftToggle.setAttribute("role", "button");
    giftToggle.setAttribute("tabindex", "0");
    giftToggle.setAttribute("aria-controls", "amplop");
  }
  setGiftVisibility(false);

  let attendance: Attendance | null = null;
  const rsvpCard = doc.querySelector<HTMLElement>(".rsvp-card");
  const rsvpSend = doc.querySelector<HTMLButtonElement>("[data-rsvp=\"send\"]");
  const rsvpName = doc.querySelector<HTMLInputElement>("[data-rsvp=\"name\"]");
  const rsvpMessage = doc.querySelector<HTMLTextAreaElement>("[data-rsvp=\"message\"]");
  const rsvpTopError = doc.querySelector<HTMLElement>(".rsvp-error-top");
  const rsvpNameError = doc.querySelector<HTMLElement>(".rsvp-error--name");
  const rsvpMessageError = doc.querySelector<HTMLElement>(".rsvp-error--message");
  const rsvpLive = doc.querySelector<HTMLElement>(".rsvp-live");

  if (rsvpCard) {
    rsvpCard.dataset.guestTo = guest;
    rsvpCard.dataset.staticError = guest ? "" : "Mohon maaf! Khusus untuk tamu undangan.";
  }
  if (guest) {
    if (rsvpSend) rsvpSend.disabled = false;
    if (rsvpNameError) rsvpNameError.style.display = "none";
  }

  const copyHandlers: Array<{ button: HTMLButtonElement; handler: () => void }> = [];
  doc.querySelectorAll<HTMLButtonElement>(".idb-copy-rek__btn").forEach((button) => {
    const handler = () => {
      const card = button.closest<HTMLElement>(".idb-copy-rek");
      const number = card?.dataset.copy || card?.querySelector(".no-rekening-marker")?.textContent || "";
      if (!number) return;

      const showToast = (message: string) => {
        const toast = card?.querySelector<HTMLElement>(".idb-copy-rek__toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-show");
        window.setTimeout(() => toast.classList.remove("is-show"), 1600);
      };

      navigator.clipboard?.writeText(number).then(
        () => showToast("Tersalin."),
        () => showToast("Gagal menyalin."),
      );
    };
    button.addEventListener("click", handler);
    copyHandlers.push({ button, handler });
  });

  const audio = doc.querySelector<HTMLAudioElement>(".idb-audio-el");
  const playButton = doc.querySelector<HTMLElement>(".idb-mute-sound");
  const pauseButton = doc.querySelector<HTMLElement>(".idb-unmute-sound");
  const syncAudioUi = () => {
    if (!audio || !playButton || !pauseButton) return;
    playButton.style.display = audio.paused ? "" : "none";
    pauseButton.style.display = audio.paused ? "none" : "";
  };
  const playAudio = () => {
    audio?.play().catch(() => undefined);
  };
  const pauseAudio = () => audio?.pause();
  playButton?.addEventListener("click", playAudio);
  pauseButton?.addEventListener("click", pauseAudio);
  audio?.addEventListener("play", syncAudioUi);
  audio?.addEventListener("pause", syncAudioUi);
  syncAudioUi();

  const submitForm = async () => {
    if (!rsvpName || !rsvpMessage || !rsvpSend) return;
    if (!guest) {
      if (rsvpTopError) {
        rsvpTopError.textContent = "Mohon maaf! Khusus untuk tamu undangan.";
        rsvpTopError.style.display = "block";
      }
      return;
    }

    const name = rsvpName.value.trim();
    const message = rsvpMessage.value.trim();
    if (!name) {
      if (rsvpNameError) {
        rsvpNameError.textContent = "Nama wajib diisi.";
        rsvpNameError.style.display = "block";
      }
      return;
    }
    if (!message) {
      if (rsvpMessageError) {
        rsvpMessageError.textContent = "Ucapan / doa wajib diisi.";
        rsvpMessageError.style.display = "block";
      }
      return;
    }
    if (!attendance) {
      if (rsvpTopError) {
        rsvpTopError.textContent = "Pilih konfirmasi kehadiran.";
        rsvpTopError.style.display = "block";
      }
      return;
    }
    if (isSubmitting()) return;

    rsvpSend.disabled = true;
    rsvpSend.classList.add("is-loading");
    const result = await submitRsvp({ name, whatsapp: "", attendance, message });
    rsvpSend.disabled = false;
    rsvpSend.classList.remove("is-loading");

    if (result.error && invitation.id !== 0) {
      if (rsvpLive) {
        rsvpLive.textContent = result.error;
        rsvpLive.classList.add("show", "rsvp-live--error");
      }
      return;
    }

    addRsvpEntry(doc, name, message, attendance);
    rsvpName.value = "";
    rsvpMessage.value = "";
    attendance = null;
    doc.querySelectorAll<HTMLElement>("[data-rsvp-pill]").forEach((pill) => {
      pill.dataset.active = "0";
    });
    if (rsvpTopError) rsvpTopError.style.display = "none";
    if (rsvpNameError) rsvpNameError.style.display = "none";
    if (rsvpMessageError) rsvpMessageError.style.display = "none";
    if (rsvpLive) {
      rsvpLive.textContent = "Terima kasih, ucapan kamu sudah terkirim.";
      rsvpLive.className = "rsvp-live show rsvp-live--success";
    }
  };

  const clickHandler = (event: MouseEvent) => {
    const target = event.target as (Element & { closest?: Element["closest"] }) | null;
    if (!target || typeof target.closest !== "function") return;

    if (target.closest("#open")) {
      event.preventDefault();
      onOpen();
      return;
    }

    if (target.closest("#klik")) {
      event.preventDefault();
      event.stopPropagation();
      toggleGift();
    }
  };
  doc.addEventListener("click", clickHandler, true);

  const giftKeydownHandler = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleGift();
  };
  giftToggle?.addEventListener("keydown", giftKeydownHandler);

  const pillHandlers: Array<{ pill: HTMLElement; handler: () => void }> = [];
  doc.querySelectorAll<HTMLElement>("[data-rsvp-pill]").forEach((pill) => {
    const handler = () => {
      const value = pill.dataset.rsvpPill;
      attendance = value === "hadir" ? "Hadir" : value === "tidak" ? "Tidak Hadir" : null;
      doc.querySelectorAll<HTMLElement>("[data-rsvp-pill]").forEach((item) => {
        item.dataset.active = item === pill ? "1" : "0";
      });
      if (rsvpTopError) rsvpTopError.style.display = "none";
    };
    pill.addEventListener("click", handler);
    pillHandlers.push({ pill, handler });
  });
  rsvpSend?.addEventListener("click", submitForm);

  const observer = view && "IntersectionObserver" in view
    ? new view.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      }, { threshold: 0.08 })
    : null;
  doc.querySelectorAll<HTMLElement>(".idb-reveal.idb-ef").forEach((element) => {
    if (observer) observer.observe(element);
  });

  const resizeHandler = () => {
    if (doc.documentElement && view) {
      doc.documentElement.style.setProperty("--vh", `${view.innerHeight * 0.01}px`);
    }
  };
  view?.addEventListener("resize", resizeHandler);

  return () => {
    countdownCleanup();
    observer?.disconnect();
    view?.removeEventListener("resize", resizeHandler);
    doc.removeEventListener("click", clickHandler, true);
    giftToggle?.removeEventListener("keydown", giftKeydownHandler);
    pillHandlers.forEach(({ pill, handler }) => pill.removeEventListener("click", handler));
    copyHandlers.forEach(({ button, handler }) => button.removeEventListener("click", handler));
    rsvpSend?.removeEventListener("click", submitForm);
    playButton?.removeEventListener("click", playAudio);
    pauseButton?.removeEventListener("click", pauseAudio);
    audio?.removeEventListener("play", syncAudioUi);
    audio?.removeEventListener("pause", syncAudioUi);
  };
}

function buildReferenceDocument(source: string) {
  const parsed = new DOMParser().parseFromString(source, "text/html");
  parsed.querySelectorAll("script, noscript").forEach((element) => element.remove());
  replaceReferenceIcons(parsed);
  parsed.querySelectorAll<HTMLAudioElement>("audio").forEach((audio) => {
    audio.preload = "none";
    audio.removeAttribute("src");
    audio.querySelectorAll("source").forEach((sourceElement) => sourceElement.removeAttribute("src"));
  });

  const base = parsed.createElement("base");
  base.href = REFERENCE_DIRECTORY;
  parsed.head.prepend(base);

  parsed
    .querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="msapplication-navbutton-color"]',
    )
    .forEach((meta) => meta.setAttribute("content", THEME_PURPLE));

  const overrides = parsed.createElement("style");
  overrides.id = "vistiq-reference-overrides";
  overrides.textContent = `
    html, body { background: #fffbf8; }
    .elementor-33329 .elementor-element.elementor-element-1c0fb2ff:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-1c0fb2ff > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-image: url("${THEME_COVER}") !important;
      background-position: center center !important;
      background-size: cover !important;
    }
    .elementor-33329 .elementor-element.elementor-element-36f18f91:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-36f18f91 > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-image: url("${REFERENCE_PAPER}") !important;
    }
    .elementor-33329 .elementor-element.elementor-element-19bee63b:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-19bee63b > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-image: linear-gradient(#8656b5, #8656b5), url("${REFERENCE_PROFILE}") !important;
      background-blend-mode: hue, normal !important;
    }
    .elementor-33329 img[src*="TEMA-01-BUNGA"],
    .elementor-33329 img[src*="bunga-akhir"] {
      filter: hue-rotate(52deg) saturate(1.18) !important;
    }
    :root {
      --vistiq-purple: ${THEME_PURPLE};
      --vistiq-purple-dark: ${THEME_PURPLE_DARK};
      --vistiq-purple-light: ${THEME_PURPLE_LIGHT};
      --idb-tl-title-divider-color: ${THEME_PURPLE} !important;
    }
    .elementor-33329 .elementor-element.elementor-element-6f74381e,
    .elementor-33329 .elementor-element.elementor-element-2609fb97,
    .elementor-33329 .elementor-element.elementor-element-1f702859,
    .elementor-33329 .elementor-element.elementor-element-1b81d2a1 .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-271e263d .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-5db6a90 .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-4081578 .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-22eb6350 .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-553b327 .elementor-heading-title,
    .elementor-33329 .elementor-element.elementor-element-76c781d0,
    .elementor-33329 .elementor-element.elementor-element-14f7c491 .idb-timeline__title {
      color: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-a4ac9e8 .idb-countdown__item,
    .elementor-33329 .elementor-element.elementor-element-452f91a:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-motion-effects-container > .elementor-motion-effects-layer,
    .elementor-33329 .elementor-element.elementor-element-452f91a::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-background-video-container::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .e-con-inner > .elementor-background-video-container::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-background-slideshow::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .e-con-inner > .elementor-background-slideshow::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-motion-effects-container > .elementor-motion-effects-layer::before,
    .elementor-33329 .elementor-element.elementor-element-50ec0594:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-50ec0594 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
    .elementor-33329 .elementor-element.elementor-element-68904f21 .idb-social-icons:not(.is-location-buttons):not(.is-streaming-buttons) .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-5ef3be7f .idb-social-icons:not(.is-location-buttons):not(.is-streaming-buttons) .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-695230ea .idb-audio-box .elementor-icon {
      background-color: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .stream-con,
    .elementor-33329 .stream-con > .e-con-inner,
    .elementor-33329 .stream-con > .e-con-inner > .elementor-element-6adad5bd,
    .elementor-33329 .amplop-section,
    .elementor-33329 .amplop-section > .e-con-inner,
    .elementor-33329 .amplop-section > .e-con-inner > .elementor-element-9137c13,
    .elementor-33329 #ucapan,
    .elementor-33329 #ucapan > .e-con-inner,
    .elementor-33329 #ucapan > .e-con-inner > .elementor-element-17f9a3b0 {
      background-color: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-6adad5bd:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-6adad5bd > .elementor-motion-effects-container > .elementor-motion-effects-layer,
    .elementor-33329 .elementor-element.elementor-element-9137c13:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-9137c13 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
    .elementor-33329 .elementor-element.elementor-element-17f9a3b0:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-17f9a3b0 > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-image: linear-gradient(180deg, var(--vistiq-purple) 0%, var(--vistiq-purple-dark) 100%) !important;
      background-color: var(--vistiq-purple-dark) !important;
      background-blend-mode: normal !important;
    }
    .elementor-33329 .elementor-element.elementor-element-452f91a:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-motion-effects-container > .elementor-motion-effects-layer,
    .elementor-33329 .elementor-element.elementor-element-452f91a::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .elementor-background-video-container::before,
    .elementor-33329 .elementor-element.elementor-element-452f91a > .e-con-inner > .elementor-background-video-container::before,
    .elementor-33329 .elementor-element.elementor-element-50ec0594:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 .elementor-element.elementor-element-50ec0594 > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-color: var(--vistiq-purple-dark) !important;
      background-image: none !important;
    }
    .elementor-33329 .vistiq-inline-icon {
      display: inline-block !important;
      width: 1em !important;
      height: 1em !important;
      flex: 0 0 auto !important;
      vertical-align: middle !important;
      overflow: visible !important;
    }
    .elementor-33329 .elementor-button-icon .vistiq-inline-icon {
      width: 1.05em !important;
      height: 1.05em !important;
    }
    .elementor-33329 .idb-social-icons__item > .vistiq-inline-icon {
      width: 1.05em !important;
      height: 1.05em !important;
    }
    .elementor-33329 #ucapan > .e-con-inner > .elementor-element-17f9a3b0:not(.elementor-motion-effects-element-type-background),
    .elementor-33329 #ucapan > .e-con-inner > .elementor-element-17f9a3b0 > .elementor-motion-effects-container > .elementor-motion-effects-layer {
      background-image: linear-gradient(180deg, rgba(89, 54, 127, 0.94), rgba(38, 22, 56, 0.98)) !important;
    }
    .elementor-33329 .stream-con .elementor-shape-fill,
    .elementor-33329 .amplop-section .elementor-shape-fill,
    .elementor-33329 #ucapan .elementor-shape-fill {
      fill: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .stream-con .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .amplop-section .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-6cf6ef95 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-5e3a7247 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-3a2d5e32 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons.is-streaming-buttons .idb-social-icons__item {
      background-image: linear-gradient(180deg, var(--vistiq-purple-light) 0%, var(--vistiq-purple-dark) 100%) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item {
      --idb-loc-btn-text: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-246ca4f5 .elementor-button,
    .elementor-33329 .elementor-element.elementor-element-9ffa1e4 .elementor-button {
      background-image: linear-gradient(180deg, var(--vistiq-purple-light) 0%, var(--vistiq-purple-dark) 100%) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-6cf6ef95 .idb-social-icons.is-location-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-6cf6ef95 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-5e3a7247 .idb-social-icons.is-location-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-5e3a7247 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-3a2d5e32 .idb-social-icons.is-location-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-3a2d5e32 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons.is-location-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons.is-streaming-buttons .idb-social-icons__item {
      background-image: linear-gradient(180deg, var(--vistiq-purple-light) 0%, var(--vistiq-purple-dark) 100%) !important;
    }
    .elementor-33329 .idb-social-icons.is-location-buttons,
    .elementor-33329 .idb-social-icons.is-streaming-buttons {
      --idb-loc-btn-text: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-location-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-location-buttons .idb-social-icons__text,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__text,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-location-buttons .idb-social-icons__item i,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item i,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-location-buttons .idb-social-icons__item svg,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item svg {
      color: var(--vistiq-purple-dark) !important;
      fill: var(--vistiq-purple-dark) !important;
      --idb-loc-btn-text: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-location-buttons .elementor-icon svg path,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .elementor-icon svg path {
      fill: var(--vistiq-purple-dark) !important;
      stroke: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-120502b6 .elementor-button {
      color: var(--vistiq-purple-dark) !important;
      fill: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-69f8173c .idb-konfirmasi-transfer__btn {
      background-color: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-69f8173c .idb-konfirmasi-transfer__btn:hover {
      background-color: var(--vistiq-purple) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-14f7c491 .idb-timeline {
      --idb-tl-title-divider-color: var(--vistiq-purple) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-4c06f5c5 .rsvp-ava,
    .elementor-33329 .rsvp-card input.rsvp-input:hover,
    .elementor-33329 .rsvp-card textarea.rsvp-textarea:hover,
    .elementor-33329 .rsvp-card input.rsvp-input:focus,
    .elementor-33329 .rsvp-card textarea.rsvp-textarea:focus {
      border-color: var(--vistiq-purple) !important;
      color: var(--vistiq-purple-dark) !important;
    }
    .elementor-33329 .rsvp-pill[data-active="1"] {
      border-color: var(--vistiq-purple) !important;
    }
    .elementor-33329 .elementor-element.elementor-element-3da322da,
    .elementor-33329 .elementor-element.elementor-element-3da322da .elementor-widget-container {
      line-height: 1.5 !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item,
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__text {
      color: #ffffff !important;
      --idb-loc-btn-text: #ffffff !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item svg {
      color: #ffffff !important;
      fill: none !important;
      stroke: #ffffff !important;
    }
    .elementor-33329 .elementor-element.elementor-element-78228d40 .idb-social-icons.is-streaming-buttons .idb-social-icons__item svg * {
      stroke: #ffffff !important;
    }
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons {
      justify-content: center !important;
      gap: 12px !important;
    }
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons__item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 30px !important;
      height: 30px !important;
      padding: 0 !important;
      color: #ffffff !important;
      background: transparent !important;
      background-image: none !important;
    }
    .elementor-33329 .elementor-element.elementor-element-4a8e37fd .idb-social-icons__item .vistiq-inline-icon {
      width: 22px !important;
      height: 22px !important;
      color: #ffffff !important;
      fill: #ffffff !important;
      stroke: #ffffff !important;
    }
  `;
  parsed.head.append(overrides);

  return `<!doctype html>${parsed.documentElement.outerHTML}`;
}

export default function AzureBloom({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const rsvp = useRsvpWishes(invitation.id);
  const motionCouple = coupleName(invitation);
  const [referenceDocument, setReferenceDocument] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [motionPlaying, setMotionPlaying] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [guest] = useState(() => {
    if (typeof window === "undefined") return "";
    return decodeGuest(new URLSearchParams(window.location.search).get("to"));
  });

  const frameRef = useRef<HTMLIFrameElement>(null);
  const motionRef = useRef<HTMLVideoElement>(null);
  const frameDocumentRef = useRef<Document | null>(null);
  const frameCleanupRef = useRef<FrameCleanup | null>(null);
  const openingStartedRef = useRef(false);
  const openingTimerRef = useRef<number | null>(null);
  const rsvpRef = useRef(rsvp);

  useEffect(() => {
    rsvpRef.current = rsvp;
  }, [rsvp]);

  useEffect(() => {
    let cancelled = false;

    fetch(REFERENCE_SOURCE)
      .then((response) => {
        if (!response.ok) throw new Error("Reference source failed to load");
        return response.text();
      })
      .then((source) => {
        if (!cancelled) setReferenceDocument(buildReferenceDocument(source));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const finishOpening = useCallback(() => {
    if (!openingStartedRef.current) return;
    openingStartedRef.current = false;
    if (openingTimerRef.current !== null) {
      window.clearTimeout(openingTimerRef.current);
      openingTimerRef.current = null;
    }

    const doc = frameDocumentRef.current;
    if (doc) {
      const cover = doc.getElementById("sec");
      const column = doc.getElementById("kolom");
      const body = doc.body;
      if (column) {
        column.style.transition = "1.5s ease-in-out";
        column.style.transform = "translateY(-100%)";
      }
      if (cover) {
        cover.style.transition = "1.5s ease-in-out";
        cover.style.opacity = "0";
        window.setTimeout(() => {
          cover.style.visibility = "hidden";
        }, 1500);
      }
      if (body) {
        body.style.position = "";
        body.style.height = "";
        body.style.left = "";
        body.style.right = "";
        body.style.overflowY = "";
        body.style.overflowX = "hidden";
      }
      doc.querySelectorAll<HTMLElement>(".idb-reveal.idb-ef").forEach((element) => {
        if (element.getBoundingClientRect().top < (doc.defaultView?.innerHeight || 0)) element.classList.add("active");
      });
      doc.querySelector<HTMLAudioElement>(".idb-audio-el")?.play().catch(() => undefined);
    }

    setMotionPlaying(false);
    setOpened(true);
  }, [setOpened]);

  const startOpening = useCallback(() => {
    if (openingStartedRef.current) return;
    openingStartedRef.current = true;
    setMotionPlaying(true);

    openingTimerRef.current = window.setTimeout(finishOpening, 11500);
    const video = motionRef.current;
    if (!video) return;

    video.load();
    video.currentTime = 0;
    video.play().catch(() => {
      window.setTimeout(finishOpening, 800);
    });
  }, [finishOpening]);

  const handleFrameLoad = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    frameCleanupRef.current?.();
    frameDocumentRef.current = doc;
    const queryGuest = decodeGuest(new URLSearchParams(window.location.search).get("to"));
    frameCleanupRef.current = prepareReference(
      doc,
      invitation,
      guest || queryGuest,
      startOpening,
      async (input) => rsvpRef.current.submit(input),
      () => rsvpRef.current.submitting,
    );
    setFrameReady(true);
  }, [guest, invitation, startOpening]);

  useEffect(() => {
    if (!frameReady || !frameDocumentRef.current) return;
    renderExistingRsvpEntries(frameDocumentRef.current, rsvp.entries);
  }, [frameReady, rsvp.entries]);

  useEffect(() => {
    return () => {
      frameCleanupRef.current?.();
      if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
    };
  }, []);

  return (
    <main
      className={styles.root}
      data-reference-ready={frameReady ? "true" : "false"}
      data-motion-playing={motionPlaying ? "true" : "false"}
    >
      {referenceDocument ? (
        <iframe
          ref={frameRef}
          className={styles.frame}
          srcDoc={referenceDocument}
          title="Undangan pernikahan"
          allow="autoplay; fullscreen; picture-in-picture"
          onLoad={handleFrameLoad}
        />
      ) : (
        <div className={styles.loading} role="status">
          {loadError ? "Undangan belum dapat dimuat." : "Memuat undangan…"}
        </div>
      )}

      <div className={styles.motionLayer} aria-hidden={!motionPlaying}>
        <video
          ref={motionRef}
          className={styles.motionVideo}
          src={OPENING_MOTION}
          poster={THEME_COVER}
          playsInline
          preload="none"
          onEnded={finishOpening}
          onError={() => window.setTimeout(finishOpening, 800)}
        />
        <div className={styles.motionIntro} aria-hidden={!motionPlaying}>
          <div className={styles.motionCopy}>
            <p className={styles.motionKicker}>THE WEDDING OF</p>
            <p className={styles.motionCouple}>{motionCouple}</p>
          </div>
          <div className={styles.motionScrollCue}>
            <span>Scroll ke bawah</span>
            <span className={styles.mouseIcon} aria-hidden="true">
              <span />
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
