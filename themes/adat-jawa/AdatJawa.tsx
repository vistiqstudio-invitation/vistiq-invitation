"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import { useRsvpWishes, type Attendance, type RsvpWish } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_SOURCE = "/themes/adat-jawa/reference/source.html";
const ADMIN_WHATSAPP =
  "https://wa.me/6281371338032?text=" +
  encodeURIComponent("Saya mau pesan undangan seperti ini juga");

type RsvpSubmit = (input: {
  name: string;
  whatsapp: string;
  attendance: Attendance;
  message: string;
}) => Promise<{ error: string | null }>;

type IconKind =
  | "envelope"
  | "map"
  | "instagram"
  | "whatsapp"
  | "gift"
  | "copy"
  | "music";

const ICON_PATHS: Record<IconKind, string> = {
  envelope:
    '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path>',
  map:
    '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle>',
  whatsapp:
    '<path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L4 20l.9-3.7A8.5 8.5 0 1 1 20.5 11.8Z"></path><path d="M8.7 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.5.6c.8 1.4 1.8 2.3 3.2 3l.5-.6c.2-.2.4-.3.7-.2l1.6.7c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.5.3-1.3.5-2 .3-1.5-.3-3.1-1.2-4.4-2.5-1.3-1.3-2.2-2.9-2.5-4.4-.1-.7 0-1.4.3-2Z"></path>',
  gift:
    '<path d="M3 10h18v11H3z"></path><path d="M2 7h20v3H2z"></path><path d="M12 7v14"></path><path d="M12 7H8.7a2.2 2.2 0 1 1 2.2-2.2C11.5 6 12 7 12 7Zm0 0h3.3a2.2 2.2 0 1 0-2.2-2.2C12.5 6 12 7 12 7Z"></path>',
  copy:
    '<rect x="8" y="8" width="11" height="12" rx="1.5"></rect><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"></path>',
  music:
    '<circle cx="8" cy="17" r="3"></circle><circle cx="18" cy="15" r="3"></circle><path d="M11 17V5l10-2v12"></path>',
};

function sourceWithoutHash(value: string | null | undefined) {
  return String(value || "").trim();
}

function displayName(person: InvitationData["groom"] | InvitationData["bride"]) {
  return person.name || person.nickname || "Mempelai";
}

function coupleName(invitation: InvitationData) {
  return displayName(invitation.groom) + " & " + displayName(invitation.bride);
}

function formatTime(value: string | null | undefined) {
  const time = String(value || "").trim();
  if (!time) return "";
  return /^pukul\b/i.test(time) ? time : "Pukul : " + time;
}

function setText(doc: Document, selector: string, value: string | null | undefined) {
  const element = doc.querySelector<HTMLElement>(selector);
  if (element) element.textContent = value || "";
}

function hideElement(element: HTMLElement | null | undefined) {
  element?.style.setProperty("display", "none", "important");
}

function showElement(element: HTMLElement | null | undefined) {
  element?.style.removeProperty("display");
}

function setImage(
  doc: Document,
  selector: string,
  value: string | null | undefined,
  alt: string
) {
  const image = doc.querySelector<HTMLImageElement>(selector);
  if (!image) return;

  const widget = image.closest<HTMLElement>(".elementor-element");
  const source = sourceWithoutHash(value);
  if (!source) {
    image.removeAttribute("src");
    image.removeAttribute("srcset");
    hideElement(widget);
    return;
  }

  showElement(widget);
  image.src = source;
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.alt = alt;
}

function setLink(
  doc: Document,
  selector: string,
  value: string | null | undefined,
  label?: string
) {
  const link = doc.querySelector<HTMLAnchorElement>(selector);
  if (!link) return;

  const href = sourceWithoutHash(value);
  const host = link.closest<HTMLElement>(".elementor-element");
  if (!href) {
    link.removeAttribute("href");
    hideElement(host);
    return;
  }

  showElement(host);
  link.href = href;
  if (href.startsWith("#")) {
    link.removeAttribute("target");
    link.removeAttribute("rel");
  } else {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  if (label) {
    const text = link.querySelector<HTMLElement>(".elementor-button-text");
    if (text) text.textContent = label;
  }
}

function instagramUrl(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return "https://instagram.com/" + raw.replace(/^@/, "").replace(/\/+$/, "");
}

function instagramLabel(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      const part = url.pathname.split("/").filter(Boolean)[0];
      return part ? "@" + part : "Instagram";
    } catch {
      return "Instagram";
    }
  }
  return raw.startsWith("@") ? raw : "@" + raw;
}

function setEventPlace(
  doc: Document,
  selector: string,
  value: string | null | undefined
) {
  const element = doc.querySelector<HTMLElement>(selector);
  if (!element) return;

  element.replaceChildren();
  element.appendChild(doc.createTextNode("Tempat : "));
  const address = doc.createElement("span");
  address.className = "niku-multiline";
  const strong = doc.createElement("strong");
  strong.textContent = value || "Lokasi acara";
  address.appendChild(strong);
  element.appendChild(address);
}

function setQuote(
  doc: Document,
  selector: string,
  quote: string | null | undefined,
  source: string | null | undefined
) {
  const element = doc.querySelector<HTMLElement>(selector);
  if (!element) return;

  element.replaceChildren(doc.createTextNode(quote || ""));
  if (source) {
    element.appendChild(doc.createElement("br"));
    element.appendChild(doc.createElement("br"));
    const citation = doc.createElement("span");
    citation.textContent = "(" + source + ")";
    element.appendChild(citation);
  }
}

function createInlineIcon(doc: Document, kind: IconKind) {
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("vistiq-inline-icon");
  svg.style.width = "1em";
  svg.style.height = "1em";
  svg.style.display = "inline-block";
  svg.style.verticalAlign = "-0.16em";
  svg.style.flex = "0 0 auto";
  svg.innerHTML = ICON_PATHS[kind];
  svg.querySelectorAll("path,rect,circle").forEach((shape) => {
    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke", "currentColor");
    shape.setAttribute("stroke-width", "1.8");
    shape.setAttribute("stroke-linecap", "round");
    shape.setAttribute("stroke-linejoin", "round");
  });
  return svg;
}

function replaceReferenceIcons(doc: Document) {
  doc.querySelectorAll<HTMLElement>("i").forEach((icon) => {
    const classes = icon.getAttribute("class") || "";
    let kind: IconKind | null = null;

    if (classes.includes("fa-envelope")) kind = "envelope";
    else if (classes.includes("fa-map-marker")) kind = "map";
    else if (classes.includes("fa-instagram")) kind = "instagram";
    else if (classes.includes("fa-whatsapp")) kind = "whatsapp";
    else if (classes.includes("fa-gift")) kind = "gift";
    else if (classes.includes("fa-copy")) kind = "copy";
    else if (
      classes.includes("fa-compact-disc") ||
      classes.includes("fa-volume") ||
      classes.includes("fa-music")
    )
      kind = "music";

    if (kind) icon.replaceWith(createInlineIcon(doc, kind));
  });
}

function setButtonIconLabel(
  doc: Document,
  selector: string,
  label: string,
  href?: string | null
) {
  const anchor = doc.querySelector<HTMLAnchorElement>(selector);
  if (!anchor) return;
  const labelElement = anchor.querySelector<HTMLElement>(
    ".elementor-button-text, .idb-social-icons__text"
  );
  if (labelElement) labelElement.textContent = label;
  if (href) {
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
}

function setSocialLink(
  doc: Document,
  selector: string,
  value: string | null | undefined,
  label: string
) {
  const anchor = doc.querySelector<HTMLAnchorElement>(selector);
  if (!anchor) return;
  const href = instagramUrl(value);
  const host = anchor.closest<HTMLElement>(".elementor-element");

  if (!href) {
    hideElement(host);
    anchor.removeAttribute("href");
    return;
  }

  showElement(host);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.setAttribute("aria-label", label);

  const icon = anchor.querySelector("svg");
  if (icon && anchor.querySelector(".elementor-button-text")) {
    const text = anchor.querySelector<HTMLElement>(".elementor-button-text");
    if (text) text.textContent = label;
  }
}

function setCoverPhoto(doc: Document, invitation: InvitationData) {
  const cover = doc.getElementById("sec");
  if (!cover) return;

  const source =
    sourceWithoutHash(invitation.coverImage) ||
    sourceWithoutHash(invitation.groom.photo) ||
    sourceWithoutHash(invitation.bride.photo);
  const old = doc.querySelector<HTMLElement>(".vistiq-cover-photo-wrap");
  old?.remove();
  if (!source) return;

  const wrap = doc.createElement("div");
  wrap.className = "vistiq-cover-photo-wrap";
  wrap.style.position = "absolute";
  wrap.style.inset = "17% 9% auto";
  wrap.style.height = "29vh";
  wrap.style.maxHeight = "270px";
  wrap.style.borderRadius = "18px";
  wrap.style.overflow = "hidden";
  wrap.style.opacity = "0.22";
  wrap.style.mixBlendMode = "multiply";
  wrap.style.pointerEvents = "none";
  wrap.style.zIndex = "0";

  const image = doc.createElement("img");
  image.src = source;
  image.alt = "Foto pasangan";
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "cover";
  image.style.objectPosition = "center";
  wrap.appendChild(image);
  cover.insertBefore(wrap, cover.firstChild);
}

function updateCountdown(doc: Document, rawDate: string | null | undefined) {
  const countdown = doc.querySelector<HTMLElement>(".idb-countdown");
  if (!countdown || !rawDate) return () => {};

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return () => {};

  const parts = ["days", "hours", "minutes", "seconds"];
  const render = () => {
    const remaining = Math.max(0, parsed.getTime() - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };

    parts.forEach((part) => {
      const box = countdown.querySelector<HTMLElement>(
        '[data-part="' + part + '"]'
      );
      const number = box?.querySelector<HTMLElement>('[data-role="num"]');
      if (number) number.textContent = String(values[part as keyof typeof values]).padStart(2, "0");
    });
  };

  render();
  const timer = window.setInterval(render, 1000);
  return () => window.clearInterval(timer);
}

function formatRsvpDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "Baru saja";
  }
}

function rsvpStatusLabel(attendance: Attendance) {
  if (attendance === "Hadir") return "Hadir";
  if (attendance === "Tidak Hadir") return "Tidak hadir";
  return "Masih ragu";
}

function createRsvpEntry(doc: Document, entry: RsvpWish) {
  const item = doc.createElement("li");
  item.className = "rsvp-item";
  item.style.listStyle = "none";

  const avatar = doc.createElement("span");
  avatar.className = "rsvp-avatar";
  avatar.textContent = entry.name.trim().charAt(0).toUpperCase() || "?";

  const content = doc.createElement("div");
  content.className = "rsvp-item__content";

  const top = doc.createElement("div");
  top.className = "rsvp-item__top";
  const name = doc.createElement("strong");
  name.textContent = entry.name;
  const status = doc.createElement("span");
  status.className = "rsvp-item__status";
  status.textContent = rsvpStatusLabel(entry.attendance);
  top.append(name, status);

  const meta = doc.createElement("small");
  meta.className = "rsvp-item__meta";
  meta.textContent = formatRsvpDate(entry.created_at);

  const message = doc.createElement("p");
  message.className = "rsvp-item__message";
  message.textContent = entry.message;

  content.append(top, meta, message);
  item.append(avatar, content);
  return item;
}

function renderRsvpEntries(doc: Document, entries: RsvpWish[]) {
  const list = doc.querySelector<HTMLElement>(".rsvp-list");
  if (!list) return;
  list.replaceChildren();
  entries.forEach((entry) => list.appendChild(createRsvpEntry(doc, entry)));
}

function updateRsvpStats(
  doc: Document,
  counts: { hadir: number; tidakHadir: number; raguRagu: number }
) {
  const hadir = doc.querySelector<HTMLElement>('[data-rsvp-stat="hadir"]');
  const tidak = doc.querySelector<HTMLElement>('[data-rsvp-stat="tidak"]');
  if (hadir) hadir.textContent = String(counts.hadir);
  if (tidak) tidak.textContent = String(counts.tidakHadir);
}

function prepareAudio(doc: Document, musicUrl: string | null) {
  const widgets = Array.from(
    doc.querySelectorAll<HTMLElement>(".idb-audio-box, .elementor-element-73ffc401")
  );
  const audio = doc.querySelector<HTMLAudioElement>(".idb-audio-el");
  const source = sourceWithoutHash(musicUrl);

  if (!audio || !source) {
    widgets.forEach(hideElement);
    return () => {};
  }

  widgets.forEach(showElement);
  audio.src = source;
  audio.loop = true;
  audio.preload = "auto";

  const controls = Array.from(
    doc.querySelectorAll<HTMLElement>(".idb-audio-box, .idb-mute-sound, .idb-unmute-sound")
  );
  const sync = () => {
    controls.forEach((control) => {
      control.setAttribute("aria-label", audio.paused ? "Putar musik" : "Jeda musik");
      control.dataset.playing = String(!audio.paused);
    });
  };
  const toggle = (event: Event) => {
    event.preventDefault();
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
    window.setTimeout(sync, 50);
  };

  controls.forEach((control) => control.addEventListener("click", toggle));
  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);
  sync();

  return () => {
    controls.forEach((control) => control.removeEventListener("click", toggle));
    audio.removeEventListener("play", sync);
    audio.removeEventListener("pause", sync);
    audio.pause();
  };
}

function prepareGallery(doc: Document) {
  const items = Array.from(
    doc.querySelectorAll<HTMLAnchorElement>("#galeri .e-gallery-item")
  );
  let lightbox: HTMLElement | null = null;

  const close = () => {
    lightbox?.remove();
    lightbox = null;
  };

  const handlers = items.map((item) => {
    const handler = (event: Event) => {
      const href = item.getAttribute("href");
      if (!href || href === "#") return;
      event.preventDefault();

      close();
      lightbox = doc.createElement("div");
      lightbox.className = "vistiq-gallery-lightbox";
      lightbox.style.position = "fixed";
      lightbox.style.inset = "0";
      lightbox.style.zIndex = "999999";
      lightbox.style.display = "grid";
      lightbox.style.placeItems = "center";
      lightbox.style.padding = "24px";
      lightbox.style.background = "rgba(24, 14, 10, 0.86)";
      lightbox.style.cursor = "zoom-out";

      const image = doc.createElement("img");
      image.src = href;
      image.alt = item.getAttribute("aria-label") || "Foto galeri";
      image.style.maxWidth = "min(94vw, 900px)";
      image.style.maxHeight = "90vh";
      image.style.objectFit = "contain";
      image.style.borderRadius = "10px";
      image.style.boxShadow = "0 18px 60px rgba(0,0,0,.35)";
      lightbox.appendChild(image);
      lightbox.addEventListener("click", close);
      doc.body.appendChild(lightbox);
    };
    item.addEventListener("click", handler);
    return { item, handler };
  });

  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };
  doc.addEventListener("keydown", keydown);

  return () => {
    handlers.forEach(({ item, handler }) => item.removeEventListener("click", handler));
    doc.removeEventListener("keydown", keydown);
    close();
  };
}

function prepareRsvp(
  doc: Document,
  submit: RsvpSubmit,
  isSubmitting: () => boolean
) {
  const form = doc.querySelector<HTMLElement>(".rsvp-card");
  const nameInput = doc.querySelector<HTMLInputElement>('[data-rsvp="name"]');
  const whatsappInput = doc.querySelector<HTMLInputElement>('[data-rsvp="hp"]');
  const messageInput = doc.querySelector<HTMLTextAreaElement>('[data-rsvp="message"]');
  const sendButton = doc.querySelector<HTMLElement>('[data-rsvp="send"]');
  const live = doc.querySelector<HTMLElement>(".rsvp-live");
  const nameError = doc.querySelector<HTMLElement>(".rsvp-error--name");
  const messageError = doc.querySelector<HTMLElement>(".rsvp-error--message");
  const pills = Array.from(
    doc.querySelectorAll<HTMLElement>("[data-rsvp-pill]")
  );

  if (!form || !nameInput || !messageInput || !sendButton) return () => {};

  let selected: Attendance | null = null;
  doc.querySelectorAll<HTMLElement>(".rsvp-error").forEach((element) => {
    element.style.display = "none";
  });

  const setError = (element: HTMLElement | null, message: string) => {
    if (!element) return;
    element.textContent = message;
    element.style.display = message ? "block" : "none";
  };

  const update = () => {
    const ready =
      nameInput.value.trim().length > 0 &&
      messageInput.value.trim().length > 0 &&
      selected !== null;
    sendButton.toggleAttribute("disabled", !ready || isSubmitting());
    sendButton.setAttribute("aria-disabled", String(!ready || isSubmitting()));
  };

  const selectPill = (event: Event) => {
    event.preventDefault();
    const pill = event.currentTarget as HTMLElement;
    const value = pill.dataset.rsvpPill;
    if (value === "hadir") selected = "Hadir";
    else if (value === "tidak") selected = "Tidak Hadir";
    pills.forEach((item) => {
      item.dataset.active = String(item === pill);
      item.setAttribute("aria-pressed", String(item === pill));
    });
    update();
  };

  const inputEvents = [nameInput, messageInput, whatsappInput].filter(
    Boolean
  ) as HTMLElement[];
  const onInput = () => {
    setError(nameError, "");
    setError(messageError, "");
    update();
  };

  const send = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting()) return;

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name) setError(nameError, "Nama wajib diisi.");
    if (!message) setError(messageError, "Ucapan wajib diisi.");
    if (!selected) {
      if (live) live.textContent = "Silakan pilih konfirmasi kehadiran.";
    }
    if (!name || !message || !selected) {
      update();
      return;
    }

    if (live) live.textContent = "Mengirim ucapan…";
    const result = await submit({
      name,
      whatsapp: whatsappInput?.value.trim() || "",
      attendance: selected,
      message,
    });

    if (result.error) {
      if (live) live.textContent = result.error;
      update();
      return;
    }

    nameInput.value = "";
    if (whatsappInput) whatsappInput.value = "";
    messageInput.value = "";
    selected = null;
    pills.forEach((item) => {
      item.dataset.active = "false";
      item.setAttribute("aria-pressed", "false");
    });
    if (live) live.textContent = "Terima kasih, ucapan Anda sudah terkirim.";
    update();
  };

  pills.forEach((pill) => {
    pill.setAttribute("role", "button");
    pill.setAttribute("tabindex", "0");
    pill.addEventListener("click", selectPill);
    pill.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Enter" || (event as KeyboardEvent).key === " ") {
        selectPill(event);
      }
    });
  });
  inputEvents.forEach((element) => element.addEventListener("input", onInput));
  sendButton.addEventListener("click", send);
  update();

  return () => {
    pills.forEach((pill) => {
      pill.removeEventListener("click", selectPill);
    });
    inputEvents.forEach((element) => element.removeEventListener("input", onInput));
    sendButton.removeEventListener("click", send);
  };
}

function prepareGift(doc: Document, invitation: InvitationData) {
  const section = doc.getElementById("amplop");
  const buttonWidget = doc.getElementById("klik");
  const button =
    buttonWidget?.querySelector<HTMLElement>(".elementor-button") || buttonWidget;
  if (!section || !button) return () => {};

  const cards = Array.from(
    section.querySelectorAll<HTMLElement>(".idb-copy-rek, .idb-kirim-hadiah")
  );
  const accounts = invitation.gifts.filter(
    (gift) => gift.accountNumber || gift.accountName || gift.bankName
  );

  if (!accounts.length) {
    hideElement(buttonWidget);
    hideElement(section.closest<HTMLElement>(".amplop-section"));
    return () => {};
  }

  let visible = false;
  let lastActivation = 0;
  section.style.setProperty("display", "none", "important");
  section.setAttribute("aria-hidden", "true");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "amplop");
  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");

  const setVisibility = (value: boolean) => {
    visible = value;
    section.style.setProperty("display", value ? "flex" : "none", "important");
    section.setAttribute("aria-hidden", String(!value));
    button.setAttribute("aria-expanded", String(value));
    button.dataset.vistiqGiftVisible = String(value);
    cards.forEach((card) => {
      if (value) {
        card.classList.remove("elementor-invisible");
        card.style.setProperty("visibility", "visible", "important");
        card.style.setProperty("opacity", "1", "important");
        card.style.setProperty("transform", "none", "important");
      }
    });
  };

  const activate = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - lastActivation < 350) return;
    lastActivation = now;
    setVisibility(!visible);
  };

  const copyButtons = Array.from(
    section.querySelectorAll<HTMLElement>(".idb-copy-rek__btn")
  );
  const copyHandlers = copyButtons.map((copyButton, index) => {
    const handler = async (event: Event) => {
      event.preventDefault();
      const account = accounts[index];
      const number = account?.accountNumber || "";
      if (!number) return;
      try {
        await navigator.clipboard.writeText(number);
      } catch {
        const temporary = doc.createElement("textarea");
        temporary.value = number;
        doc.body.appendChild(temporary);
        temporary.select();
        doc.execCommand("copy");
        temporary.remove();
      }
      const original = copyButton.textContent;
      copyButton.textContent = "Tersalin";
      window.setTimeout(() => {
        copyButton.textContent = original || "Salin";
      }, 1400);
    };
    copyButton.addEventListener("click", handler);
    return { copyButton, handler };
  });

  button.addEventListener("click", activate);
  button.addEventListener("pointerup", activate);
  button.addEventListener("touchend", activate, { passive: false });
  button.addEventListener("keydown", (event) => {
    if ((event as KeyboardEvent).key === "Enter" || (event as KeyboardEvent).key === " ") {
      activate(event);
    }
  });

  const markers = Array.from(
    section.querySelectorAll<HTMLElement>(".no-rekening-marker")
  );
  markers.forEach((marker, index) => {
    const account = accounts[index];
    const card = marker.closest<HTMLElement>(".idb-copy-rek");
    if (!account) {
      hideElement(card);
      return;
    }
    marker.textContent = account.accountNumber || "Nomor rekening";
    card?.setAttribute("data-copy", account.accountNumber || "");
    const accountName = card?.querySelector<HTMLElement>(".idb-copy-rek__name");
    if (accountName) accountName.textContent = account.accountName || "";
    const bankText = card?.querySelector<HTMLElement>(".idb-copy-rek__bankname");
    if (bankText) bankText.textContent = account.bankName || "Bank";
  });

  const shippingValue = section.querySelector<HTMLElement>(
    ".idb-kirim-hadiah__value"
  );
  if (shippingValue) {
    shippingValue.textContent =
      accounts[0]?.accountName || displayName(invitation.groom);
  }

  setVisibility(false);

  return () => {
    button.removeEventListener("click", activate);
    button.removeEventListener("pointerup", activate);
    button.removeEventListener("touchend", activate);
    copyHandlers.forEach(({ copyButton, handler }) =>
      copyButton.removeEventListener("click", handler)
    );
  };
}

function prepareReference(
  doc: Document,
  invitation: InvitationData,
  guestName: string,
  onOpen: () => void,
  submit: RsvpSubmit,
  isSubmitting: () => boolean
) {
  const cleanups: Array<() => void> = [];
  const body = doc.body;
  const cover = doc.getElementById("sec");
  const coverColumn = doc.getElementById("kolom");
  const root = doc.querySelector<HTMLElement>(".elementor-8619");
  const name = coupleName(invitation);
  const firstEvent = invitation.events[0];
  const secondEvent = invitation.events[1] || invitation.events[0];
  const firstStory = invitation.story[0];

  if (body) {
    body.setAttribute("data-idb-cover-closed", "1");
    body.style.overflowY = "auto";
    body.style.overflowX = "hidden";
  }
  if (root) root.style.minHeight = "100vh";
  if (cover) {
    cover.style.setProperty("opacity", "1", "important");
    cover.style.setProperty("visibility", "visible", "important");
    cover.style.pointerEvents = "auto";
    cover.style.zIndex = "10000";
  }
  if (coverColumn) {
    coverColumn.style.transform = "translateY(0)";
    coverColumn.style.transition = "1.5s ease-in-out";
  }

  setCoverPhoto(doc, invitation);
  setText(doc, "#sec .elementor-element-405fbc8c .elementor-widget-container", name);
  setText(
    doc,
    "#sec .elementor-element-2fb79074 .elementor-widget-container",
    "Kepada Bapak/Ibu/Saudara/i"
  );
  setText(
    doc,
    "#sec .elementor-element-171b1b07 .elementor-widget-container",
    guestName || "Nama Tamu"
  );

  setText(doc, "#home .elementor-element-29f43eb8 .elementor-heading-title", name);
  setText(
    doc,
    "#home .elementor-element-37111d94 .elementor-widget-container",
    firstEvent?.date || ""
  );
  setLink(doc, "#home .elementor-element-6bc8e42c a", "#date", "Save The Date");

  setText(
    doc,
    "#catin .elementor-element-606a95a .elementor-heading-title",
    invitation.opening.greeting || "Assalamu'alaikum Wr. Wb"
  );
  setText(
    doc,
    "#catin .elementor-element-54c38e2d .elementor-heading-title",
    invitation.opening.description ||
      "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami."
  );
  setText(
    doc,
    "#catin .elementor-element-3a9b726f .elementor-heading-title",
    displayName(invitation.groom)
  );
  setText(
    doc,
    "#catin .elementor-element-7f33e308 .elementor-heading-title",
    displayName(invitation.bride)
  );
  setText(
    doc,
    "#catin .elementor-element-7a3ef824 .elementor-widget-container",
    invitation.groom.parents ? "Putra dari " + invitation.groom.parents : ""
  );
  setText(
    doc,
    "#catin .elementor-element-67c00b43 .elementor-widget-container",
    invitation.bride.parents ? "Putri dari " + invitation.bride.parents : ""
  );
  setImage(
    doc,
    "#catin .elementor-element-2de7c263 img",
    invitation.groom.photo,
    "Foto " + displayName(invitation.groom)
  );
  setImage(
    doc,
    "#catin .elementor-element-22dcdb2c img",
    invitation.bride.photo,
    "Foto " + displayName(invitation.bride)
  );
  setSocialLink(
    doc,
    "#catin .elementor-element-f3eabda a",
    invitation.groom.instagram,
    "Instagram " + displayName(invitation.groom)
  );
  setSocialLink(
    doc,
    "#catin .elementor-element-7fa44e71 a",
    invitation.bride.instagram,
    "Instagram " + displayName(invitation.bride)
  );

  const quote =
    invitation.opening.quote ||
    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu.";
  setQuote(
    doc,
    "#home .elementor-element-32cad1d9 .elementor-heading-title",
    quote,
    invitation.opening.quoteSource
  );

  const storySection = doc.querySelector<HTMLElement>(".elementor-element-689aed41");
  if (!invitation.story.length) {
    hideElement(storySection);
  } else {
    showElement(storySection);
    setText(
      doc,
      ".elementor-element-689aed41 .elementor-element-23d59e32 .elementor-heading-title",
      "Kisah " + name
    );
    setImage(
      doc,
      ".elementor-element-689aed41 .elementor-element-6b26b49d img",
      invitation.gallery[0] ||
        invitation.coverImage ||
        invitation.groom.photo ||
        invitation.bride.photo,
      "Foto perjalanan " + name
    );

    const storyItems = Array.from(
      doc.querySelectorAll<HTMLElement>(".elementor-element-689aed41 .idb-timeline__item")
    );
    storyItems.forEach((item, index) => {
      const story = invitation.story[index];
      if (!story) {
        hideElement(item);
        return;
      }
      showElement(item);
      const title = item.querySelector<HTMLElement>(".idb-timeline__title");
      const description = item.querySelector<HTMLElement>(".idb-timeline__desc");
      if (title) title.textContent = story.year + " · " + story.title;
      if (description) description.textContent = story.description;
    });
  }

  const countdownClean = updateCountdown(doc, firstEvent?.rawDate);
  cleanups.push(countdownClean);

  const stream = doc.querySelector<HTMLElement>(".stream-con");
  const streamUrl =
    instagramUrl(invitation.groom.instagram) ||
    instagramUrl(invitation.bride.instagram);
  if (!streamUrl) {
    hideElement(stream);
  } else {
    showElement(stream);
    setText(doc, ".stream-con .elementor-element-87cad4a .elementor-widget-container", firstEvent?.date || "");
    setText(doc, ".stream-con .elementor-element-5d3205b .elementor-widget-container", formatTime(firstEvent?.time));
    setButtonIconLabel(
      doc,
      ".stream-con .elementor-element-e4414b4 a",
      instagramLabel(invitation.groom.instagram || invitation.bride.instagram),
      streamUrl
    );
  }

  const eventConfigs = [
    {
      event: firstEvent,
      title: ".elementor-element-3ff61c97 .nama-acara-marker",
      date: ".elementor-element-564ff72 .elementor-widget-container",
      time: ".elementor-element-1af96ab9 .elementor-widget-container",
      place: ".elementor-element-189b1b3a .elementor-widget-container",
      map: ".elementor-element-751083f2 a",
    },
    {
      event: secondEvent,
      title: ".elementor-element-24b104c0 .nama-acara-marker",
      date: ".elementor-element-52e1e2f9 .elementor-widget-container",
      time: ".elementor-element-4b97d726 .elementor-widget-container",
      place: ".elementor-element-10c3000c .elementor-widget-container",
      map: ".elementor-element-6ad9ce31 a",
    },
  ];
  eventConfigs.forEach((config) => {
    const event = config.event;
    const card = doc.querySelector<HTMLElement>(config.title)?.closest<HTMLElement>(".acara-con");
    if (!event) {
      hideElement(card);
      return;
    }
    showElement(card);
    setText(doc, config.title, event.name);
    setText(doc, config.date, event.date);
    setText(doc, config.time, formatTime(event.time));
    setEventPlace(doc, config.place, event.location);
    setLink(doc, config.map, invitation.mapsUrl || invitation.mapsEmbedUrl, "Lihat Lokasi");
  });

  const galleryItems = Array.from(
    doc.querySelectorAll<HTMLAnchorElement>("#galeri .e-gallery-item")
  );
  const photos = invitation.gallery.map(sourceWithoutHash).filter(Boolean);
  if (!photos.length) {
    hideElement(doc.getElementById("galeri"));
  } else {
    galleryItems.forEach((item, index) => {
      const image = item.querySelector<HTMLElement>(".e-gallery-image");
      const photo = photos[index];
      if (!photo) {
        hideElement(item);
        return;
      }
      showElement(item);
      item.href = photo;
      item.removeAttribute("data-e-action-hash");
      item.setAttribute("aria-label", "Buka foto " + String(index + 1));
      if (image) {
        image.style.backgroundImage = "url(" + JSON.stringify(photo) + ")";
        image.dataset.thumbnail = photo;
      }
    });
    cleanups.push(prepareGallery(doc));
  }

  const video = doc.querySelector<HTMLIFrameElement>(".bisdev-invite-video__iframe");
  if (video) {
    const videoSource = sourceWithoutHash(invitation.videoUrl);
    if (videoSource) {
      video.src = videoSource;
      const host = video.closest<HTMLElement>(".elementor-element");
      showElement(host);
    } else {
      hideElement(video.closest<HTMLElement>(".elementor-element"));
    }
  }

  const giftSection = doc.querySelector<HTMLElement>(".amplop-section");
  if (invitation.gifts.length) cleanups.push(prepareGift(doc, invitation));
  else hideElement(giftSection);

  const footerSocial = doc.querySelector<HTMLElement>(
    ".elementor-element-1bde1b43 .idb-social-icons"
  );
  if (footerSocial) {
    footerSocial.replaceChildren();
    const whatsapp = doc.createElement("a");
    whatsapp.className = "vistiq-admin-whatsapp";
    whatsapp.href = ADMIN_WHATSAPP;
    whatsapp.target = "_blank";
    whatsapp.rel = "noreferrer";
    whatsapp.setAttribute("aria-label", "Pesan undangan melalui WhatsApp");
    whatsapp.style.display = "inline-flex";
    whatsapp.style.alignItems = "center";
    whatsapp.style.justifyContent = "center";
    whatsapp.style.gap = "8px";
    whatsapp.style.color = "inherit";
    whatsapp.style.textDecoration = "none";
    whatsapp.appendChild(createInlineIcon(doc, "whatsapp"));
    whatsapp.appendChild(doc.createTextNode("Pesan via WhatsApp"));
    footerSocial.appendChild(whatsapp);
  }
  setText(
    doc,
    ".idb-watermark-text",
    "Made with ♥ by " + (invitation.brand?.name || "Vistiq Invitation")
  );

  const rsvpClean = prepareRsvp(doc, submit, isSubmitting);
  cleanups.push(rsvpClean);
  const audioClean = prepareAudio(doc, invitation.musicUrl);
  cleanups.push(audioClean);

  const openWidget = doc.getElementById("open");
  const openTarget =
    openWidget?.querySelector<HTMLElement>(".elementor-button") || openWidget;
  const openHandler = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpen();
  };
  const openKeyHandler = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") openHandler(event);
  };
  if (openTarget) {
    openTarget.setAttribute("role", "button");
    openTarget.setAttribute("tabindex", "0");
    openTarget.setAttribute("aria-label", "Buka undangan");
    openTarget.addEventListener("click", openHandler);
    openTarget.addEventListener("keydown", openKeyHandler);
    cleanups.push(() => {
      openTarget.removeEventListener("click", openHandler);
      openTarget.removeEventListener("keydown", openKeyHandler);
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

function buildReferenceDocument(source: string) {
  const parsed = new DOMParser().parseFromString(source, "text/html");
  parsed.querySelectorAll("script, noscript").forEach((node) => node.remove());
  parsed
    .querySelectorAll<HTMLImageElement>("img[srcset], img[sizes]")
    .forEach((image) => {
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
    });
  parsed.querySelectorAll<HTMLIFrameElement>("iframe").forEach((iframe) => {
    if (iframe.classList.contains("bisdev-invite-video__iframe")) {
      iframe.src = "about:blank";
    }
  });

  const stylesheet = parsed.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "./reference.css";
  parsed.querySelectorAll('link[rel="stylesheet"]').forEach((node) => node.remove());
  parsed.head.prepend(stylesheet);
  replaceReferenceIcons(parsed);

  const override = parsed.createElement("style");
  override.textContent = [
    "html,body{min-height:100%;margin:0;overflow-x:hidden!important;}",
    "body{overflow-y:auto!important;}",
    "#sec{isolation:isolate;}",
    "#sec>.e-con-inner,#sec #kolom{position:relative;z-index:1;}",
    ".vistiq-cover-photo-wrap{z-index:0!important;}",
    ".vistiq-admin-whatsapp{font-family:inherit;}",
    ".rsvp-item{display:flex;gap:12px;align-items:flex-start;margin:0 0 14px;}",
    ".rsvp-avatar{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:50%;background:rgba(124,83,55,.18);color:#6c432b;font-weight:700;}",
    ".rsvp-item__content{min-width:0;flex:1;}",
    ".rsvp-item__top{display:flex;align-items:center;justify-content:space-between;gap:8px;}",
    ".rsvp-item__status{font-size:.75em;color:#8b603f;}",
    ".rsvp-item__meta{display:block;opacity:.65;margin-top:2px;}",
    ".rsvp-item__message{margin:.35em 0 0;white-space:pre-wrap;word-break:break-word;}",
    ".rsvp-list{padding-left:0;}",
    "[data-rsvp-pill][data-active=true]{outline:2px solid currentColor;outline-offset:2px;}",
    "[data-rsvp=send][disabled]{opacity:.55;cursor:not-allowed;}",
  ].join("");
  parsed.head.appendChild(override);
  return "<!doctype html>" + parsed.documentElement.outerHTML;
}

export default function AdatJawa({
  invitation,
}: {
  invitation: InvitationData;
}) {
  const { setOpened } = useInvitation();
  const rsvp = useRsvpWishes(invitation.id);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const openingRef = useRef(false);
  const submitRef = useRef<RsvpSubmit>(rsvp.submit);
  const submittingRef = useRef(rsvp.submitting);
  const [guestName] = useState(() => {
    if (typeof window === "undefined") return "Nama Tamu";
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("to") ||
      params.get("guest") ||
      params.get("nama") ||
      "Nama Tamu"
    );
  });
  const [referenceDocument, setReferenceDocument] = useState("");
  const [frameReady, setFrameReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  submitRef.current = rsvp.submit;
  submittingRef.current = rsvp.submitting;

  const finishOpening = useCallback(() => {
    if (openingRef.current) return;
    openingRef.current = true;

    const doc = frameRef.current?.contentDocument;
    const cover = doc?.getElementById("sec");
    const column = doc?.getElementById("kolom");
    const body = doc?.body;
    if (!doc || !cover || !column) {
      setOpened(true);
      return;
    }

    column.style.transition = "transform 1.5s ease-in-out";
    column.style.transform = "translateY(-100%)";
    cover.style.transition = "opacity 1.5s ease-in-out";
    cover.style.opacity = "0";
    cover.style.pointerEvents = "none";
    window.setTimeout(() => {
      cover.style.visibility = "hidden";
      cover.style.display = "none";
      if (body) {
        body.style.position = "";
        body.style.inset = "";
        body.style.height = "";
        body.style.overflowY = "auto";
        body.style.overflowX = "hidden";
      }
      setOpened(true);
    }, 1550);
  }, [setOpened]);

  const submitRsvp = useCallback<RsvpSubmit>(
    (input) => submitRef.current(input),
    []
  );

  useEffect(() => {
    let active = true;
    fetch(REFERENCE_SOURCE, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Reference HTML tidak ditemukan");
        return response.text();
      })
      .then((source) => {
        if (active) setReferenceDocument(buildReferenceDocument(source));
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleFrameLoad = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    cleanupRef.current?.();
    cleanupRef.current = prepareReference(
      doc,
      invitation,
      guestName,
      finishOpening,
      submitRsvp,
      () => submittingRef.current
    );
    setFrameReady(true);
  }, [finishOpening, guestName, invitation, submitRsvp]);

  useEffect(() => {
    if (!frameReady) return;
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    renderRsvpEntries(doc, rsvp.entries);
    updateRsvpStats(doc, rsvp.counts);
  }, [frameReady, rsvp.counts, rsvp.entries]);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  return (
    <main className={styles.root} data-reference-ready={String(frameReady)}>
      {loadError ? (
        <div className={styles.error}>
          Undangan sedang dimuat ulang. Silakan coba beberapa saat lagi.
        </div>
      ) : (
        <iframe
          ref={frameRef}
          className={styles.frame}
          title={"Undangan " + coupleName(invitation)}
          srcDoc={referenceDocument}
          onLoad={handleFrameLoad}
        />
      )}
    </main>
  );
}
