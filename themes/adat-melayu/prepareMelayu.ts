import type { EventItem, InvitationData } from "@/types/invitation";

const short = (person: InvitationData["groom"]) => person.nickname?.trim() || person.name.split(/\s+/)[0];
const safeUrl = (value: string | null | undefined) => {
  if (!value) return "";
  try { const url = new URL(value, window.location.origin); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
};
function text(doc: Document, selector: string, value: string) {
  const el = doc.querySelector(selector); if (el) el.textContent = value;
}
function widget(doc: Document, id: string, value: string) {
  text(doc, `.elementor-element-${id} .elementor-widget-container`, value);
}
function hide(el: Element | null, hidden: boolean) {
  if (el instanceof HTMLElement) el.style.setProperty("display", hidden ? "none" : "", hidden ? "important" : "");
  // Elements belong to the iframe's realm, so use tag/style capability below.
  else if (el && "style" in el) (el as HTMLElement).style.setProperty("display", hidden ? "none" : "", hidden ? "important" : "");
}
function image(doc: Document, id: string, value: string | null, alt: string) {
  const img = doc.querySelector<HTMLImageElement>(`.elementor-element-${id} img`);
  if (!img) return;
  const src = safeUrl(value); hide(img.closest(".elementor-widget-image"), !src);
  if (src) { img.src = src; img.alt = alt; img.removeAttribute("srcset"); }
}
function social(doc: Document, id: string, handle: string | null) {
  const box = doc.querySelector(`.elementor-element-${id}`);
  const a = box?.querySelector<HTMLAnchorElement>("a");
  hide(box || null, !handle);
  if (a && handle) {
    const name = handle.replace(/^https?:\/\/(www\.)?instagram.com\//, "").replace(/^@/, "").split(/[/?#]/)[0];
    a.href = `https://www.instagram.com/${encodeURIComponent(name)}/`;
  }
}
function setEvent(root: HTMLElement, event: EventItem, doc: Document, invitation: InvitationData) {
  const items = Array.from(root.querySelectorAll<HTMLElement>(".elementor-widget-text-editor .elementor-widget-container"));
  if (items[0]) items[0].textContent = event.name;
  if (items[1]) items[1].textContent = event.date;
  if (items[2]) items[2].textContent = `Pukul : ${event.time}`;
  if (items[3]) { const label = doc.createElement("strong"); label.textContent = "Tempat :"; items[3].replaceChildren(label, doc.createElement("br"), doc.createTextNode(event.location)); }
  const a = root.querySelector<HTMLAnchorElement>("a[data-idb-maps-link], .idb-social-icons a");
  if (a) { const url = safeUrl(event.mapsUrl || invitation.mapsUrl); hide(a, !url); if (url) a.href = url; }
}
function eventRoots(doc: Document, invitation: InvitationData) {
  // The reference only gives the second event .acara-con; find both by their markers.
  const markers = Array.from(doc.querySelectorAll<HTMLElement>(".nama-acara-marker"));
  const roots = markers.map(el => el.closest<HTMLElement>(".elementor-widget")?.parentElement).filter((el): el is HTMLElement => !!el);
  const template = roots[roots.length - 1];
  if (template) while (roots.length < invitation.events.length) {
    const clone = template.cloneNode(true) as HTMLElement;
    clone.removeAttribute("id"); clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    roots[roots.length - 1].after(clone); roots.push(clone);
  }
  roots.forEach((root, index) => { const event = invitation.events[index]; hide(root, !event); if (event) setEvent(root, event, doc, invitation); });
}
function icon(doc: Document, label: string, path: string) {
  const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "20"); svg.setAttribute("height", "20"); svg.setAttribute("aria-label", label);
  const p = doc.createElementNS(svg.namespaceURI, "path"); p.setAttribute("fill", "currentColor"); p.setAttribute("d", path); svg.append(p); return svg;
}
const icons = {
  copy: "M8 2h12v14h-2V4H8V2M4 6h12v16H4V6m2 2v12h8V8H6",
  gift: "M3 7h18v5h-1v10H4V12H3V7m2 2v1h6V9H5m8 0v1h6V9h-6m-7 3v8h5v-8H6m7 0v8h5v-8h-5M12 7C2-1 21-1 12 7m-2-2C6 1 5 6 10 5m4 0c5 1 4-4 0 0",
  arrow: "M13 4l8 8-8 8-2-2 5-5H3v-2h13l-5-5 2-2",
  location: "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7m0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6",
  envelope: "M2 4h20v16H2V4m2 2v1l8 5 8-5V6l-8 5-8-5m0 3v9h16V9l-8 5-8-5",
  instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7m5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6m6-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 2a8 8 0 1 1-4 15l-.4-.2-2.8.7.7-2.7-.3-.5A8 8 0 0 1 12 4m-3 3c-.5 0-1.5 1-1.5 2.5 0 3 4 7 7 7 1.5 0 2.5-1 2.5-1.5l-2.5-1.5-1 1c-1.5-.5-3.5-2.5-4-4l1-1L9 7",
};

function setupRsvp(doc: Document, invitation: InvitationData, guest: string, signal: AbortSignal) {
  const root = doc.querySelector<HTMLElement>(".rsvp-card"); if (!root) return;
  root.querySelectorAll<HTMLElement>(".rsvp-error").forEach(el => { el.textContent = ""; hide(el, true); });
  const name = root.querySelector<HTMLInputElement>('[data-rsvp="name"]');
  const message = root.querySelector<HTMLTextAreaElement>('[data-rsvp="message"]');
  const send = root.querySelector<HTMLButtonElement>('[data-rsvp="send"]');
  const list = root.querySelector<HTMLElement>(".rsvp-list");
  const live = root.querySelector<HTMLElement>(".rsvp-live, .rsvp-error-top");
  if (!name || !message || !send) return;
  name.value = guest; send.disabled = false;
  const say = (value: string) => { if (live) { live.textContent = value; hide(live, !value); } };
  let attendance = "", busy = false;
  const render = (item: { guest_name: string; message: string | null; attendance: string | null }) => {
    const row = doc.createElement("li"); row.className = "rsvp-item";
    const avatar = doc.createElement("div"); avatar.className = "rsvp-ava"; avatar.textContent = item.guest_name.charAt(0).toUpperCase();
    const body = doc.createElement("div"); body.className = "rsvp-body";
    const author = doc.createElement("div"); author.className = "rsvp-name"; author.textContent = item.guest_name;
    const status = doc.createElement("div"); status.className = "rsvp-meta"; status.textContent = item.attendance === "hadir" ? "Hadir" : item.attendance === "ragu" ? "Masih Ragu" : "Tidak Hadir";
    const copy = doc.createElement("div"); copy.className = "rsvp-msg"; copy.textContent = item.message || "";
    body.append(author, status, copy); row.append(avatar, body); list?.prepend(row);
  };
  list?.replaceChildren();
  if (invitation.id > 0) fetch(`/api/rsvp?invitationId=${invitation.id}`, { signal })
    .then(r => r.ok ? r.json() : Promise.reject(new Error("Gagal memuat ucapan.")))
    .then(data => [...(data.items || [])].reverse().forEach(render)).catch(() => undefined);
  const pills = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-rsvp-pill]"));
  pills.forEach(pill => pill.addEventListener("click", () => {
    attendance = pill.dataset.rsvpPill || "";
    pills.forEach(p => { p.dataset.active = p === pill ? "1" : "0"; p.setAttribute("aria-pressed", String(p === pill)); });
  }, { signal }));
  send.addEventListener("click", async event => {
    event.preventDefault(); if (busy) return;
    if (!name.value.trim() || !message.value.trim() || !attendance) { say("Lengkapi nama, ucapan, dan konfirmasi kehadiran."); return; }
    const item = { guest_name: name.value.trim(), message: message.value.trim(), attendance };
    if (invitation.id === 0) { render(item); message.value = ""; say("Terima kasih! Ini simulasi RSVP demo, data tidak disimpan."); return; }
    busy = true; send.disabled = true; say("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invitationId: invitation.id, guestName: item.guest_name, message: item.message, attendance, totalGuest: 1 }) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Gagal mengirim ucapan.");
      render(payload.item); message.value = ""; say("Terima kasih, RSVP berhasil dikirim.");
    } catch (err) { if (!signal.aborted) say(err instanceof Error ? err.message : "Gagal mengirim ucapan."); }
    finally { busy = false; send.disabled = false; }
  }, { signal });
}

export function prepareMelayu(doc: Document, invitation: InvitationData, onOpen: () => void) {
  const controller = new AbortController(), { signal } = controller;
  const win = doc.defaultView; if (!win) return () => controller.abort();
  const couple = `${short(invitation.groom)} & ${short(invitation.bride)}`;
  const guest = new URLSearchParams(window.location.search).get("to")?.trim() || "";
  doc.title = `${couple} — ${invitation.brand?.name || "Vistiq Invitation"}`;
  ["74bec9ca", "38a8c89c", "4a298a32"].forEach(id => widget(doc, id, couple));
  text(doc, ".elementor-element-6460100e .elementor-heading-title", guest || "Bapak/Ibu/Saudara/i");
  widget(doc, "1f0fa21a", invitation.groom.name); widget(doc, "47add650", invitation.bride.name);
  widget(doc, "2127c4e6", invitation.groom.parents || ""); widget(doc, "4be9c41", invitation.bride.parents || "");
  if (invitation.opening.greeting) widget(doc, "3d331129", invitation.opening.greeting);
  if (invitation.opening.description) widget(doc, "4dcfc93c", invitation.opening.description);
  if (invitation.opening.title) widget(doc, "2ccd451f", invitation.opening.title);
  if (invitation.opening.quote) widget(doc, "61d83a79", `${invitation.opening.quote}\n${invitation.opening.quoteSource || ""}`);
  if (invitation.closingGreeting) widget(doc, "4cc364c3", invitation.closingGreeting);
  const event = invitation.coverEvent || invitation.events[0];
  text(doc, ".elementor-element-ce81a72 .elementor-heading-title", event?.date || "");
  doc.querySelector<HTMLAnchorElement>(".elementor-element-29e08599 a")?.setAttribute("href", "#event");
  eventRoots(doc, invitation);
  social(doc, "6bfc9604", invitation.groom.instagram); social(doc, "5e5c31e2", invitation.bride.instagram);
  image(doc, "vistiq-cover-photo", invitation.coverImage, couple);
  image(doc, "638d895c", invitation.groom.photo, invitation.groom.name);
  image(doc, "700bdcdf", invitation.bride.photo, invitation.bride.name);
  image(doc, "3dc445d3", invitation.storyPhotos?.[0] || invitation.coverImage, couple);
  // Override only the photograph backgrounds; keep every original ornament intact.
  const background = safeUrl(invitation.backgroundPhoto || invitation.coverImage);
  // The reference's other photographic background has an explicit element selector.
  doc.querySelectorAll<HTMLElement>(".e-con").forEach(el => {
    const bg = win.getComputedStyle(el).backgroundImage;
    if (bg.includes("/photos/green-cover.webp") && el.id !== "kolom") el.style.setProperty("background-image", background ? `url(${JSON.stringify(background)})` : "none", "important");
  });
  const timeline = doc.querySelector(".idb-timeline__list"), storyTemplate = timeline?.querySelector(".idb-timeline__item");
  if (timeline && storyTemplate) {
    timeline.replaceChildren();
    invitation.story.forEach(story => {
      const row = storyTemplate.cloneNode(true) as HTMLElement;
      const title = row.querySelector(".idb-timeline__title"), desc = row.querySelector(".idb-timeline__desc");
      if (title) title.textContent = story.title || story.year; if (desc) desc.textContent = story.description; timeline.append(row);
    });
  }
  hide(doc.querySelector(".ls-section"), !invitation.story.length);
  const gallery = doc.querySelector(".e-gallery-container");
  const galleryTemplates = Array.from(gallery?.querySelectorAll(".e-gallery-item") || []);
  const template = galleryTemplates[0];
  if (gallery && template) {
    gallery.replaceChildren();
    if (invitation.gallery.length !== galleryTemplates.length || (invitation.galleryLayout && invitation.galleryLayout !== "auto")) gallery.classList.add("vistiq-grid-gallery");
    invitation.gallery.forEach((photo, index) => {
      const src = safeUrl(photo); if (!src) return;
      const a = (galleryTemplates[index] || template).cloneNode(true) as HTMLAnchorElement; a.href = src;
      const img = a.querySelector<HTMLElement>(".e-gallery-image");
      if (img) { img.style.backgroundImage = `url(${JSON.stringify(src)})`; img.setAttribute("aria-label", `Foto ${index + 1}`); }
      a.addEventListener("click", e => { e.preventDefault(); const dialog = doc.createElement("dialog"); dialog.className = "vistiq-lightbox";
        const image = doc.createElement("img"); image.src = src; image.alt = `Foto ${couple} ${index + 1}`;
        const button = doc.createElement("button"); button.type = "button"; button.textContent = "×"; button.setAttribute("aria-label", "Tutup foto");
        button.onclick = () => dialog.close(); dialog.addEventListener("close", () => dialog.remove(), { once: true }); dialog.append(image, button); doc.body.append(dialog); dialog.showModal();
      }, { signal }); gallery.append(a);
    });
  }
  hide(doc.querySelector(".elementor-element-72d5a014"), !invitation.gallery.length);
  const stream = doc.querySelector<HTMLElement>(".stream-con"); hide(stream, !invitation.liveStreamingUrl);
  if (stream && invitation.liveStreamingUrl) {
    widget(doc, "42bdc63", event?.date || ""); widget(doc, "58b7235e", event?.time || "");
    const a = stream.querySelector<HTMLAnchorElement>("a"); if (a) { a.href = safeUrl(invitation.liveStreamingUrl); text(doc, ".elementor-element-6fce6049 .idb-social-icons__text", "Live Streaming"); }
  }
  // No video/shipping fields are inherited from the source demonstration.
  hide(doc.querySelector(".elementor-element-24374f23"), !invitation.videoUrl);
  if (invitation.videoUrl) { const box = doc.querySelector(".elementor-element-24374f23 .elementor-widget-container"); const video = doc.createElement("video"); video.controls = true; video.src = safeUrl(invitation.videoUrl); video.style.width = "100%"; box?.replaceChildren(video); }
  hide(doc.querySelector(".elementor-widget-bisdev_kirim_hadiah"), true);
  const cards = Array.from(doc.querySelectorAll<HTMLElement>(".idb-copy-rek"));
  cards.forEach((card, index) => {
    const gift = invitation.gifts[index]; hide(card, !gift); if (!gift) return;
    const marker = card.querySelector(".no-rekening-marker"), name = card.querySelector(".idb-copy-rek__name"), logo = card.querySelector(".idb-copy-rek__banklogo");
    if (marker) marker.textContent = gift.accountNumber || ""; if (name) name.textContent = gift.accountName || "";
    if (logo) { const bank = (gift.bankName || "").replace(/^bank\s+/i, ""); const assets: Record<string, string> = { BCA: "BCA.png", MANDIRI: "Mandiri.png" };
      logo.replaceChildren(); if (assets[bank.toUpperCase()]) { const img = doc.createElement("img"); img.src = `/banks/${assets[bank.toUpperCase()]}`; img.alt = bank; logo.append(img); } else logo.textContent = bank;
    }
    card.querySelector("button, .idb-copy-rek__btn")?.addEventListener("click", async e => { e.preventDefault();
      try { await navigator.clipboard.writeText(gift.accountNumber || ""); } catch { const input = doc.createElement("textarea"); input.value = gift.accountNumber || ""; doc.body.append(input); input.select(); doc.execCommand("copy"); input.remove(); }
    }, { signal });
  });
  const gift = doc.getElementById("amplop");
  hide(doc.querySelector(".amplop-section"), !invitation.gifts.length);
  doc.getElementById("klik")?.addEventListener("click", e => { e.preventDefault(); if (gift) gift.style.display = gift.style.display === "block" ? "none" : "block"; }, { signal });
  widget(doc, "15c03b38", `Made with ♥ by ${invitation.brand?.name || "Vistiq Invitation"}`);
  const footer = doc.querySelector(".elementor-element-4d00c025");
  footer?.querySelectorAll<HTMLAnchorElement>("a").forEach(a => {
    if (invitation.brand) { hide(a, true); return; }
    a.href = a.getAttribute("aria-label") === "WhatsApp" ? "https://wa.me/6281371338032" : "https://www.instagram.com/vistiqinvitation/";
  });
  doc.querySelectorAll<HTMLElement>("i.fas, i.far, i.fab").forEach(el => {
    const kind = el.className.includes("fa-copy") ? "copy" : el.className.includes("fa-gift") ? "gift" : el.className.includes("fa-long-arrow") ? "arrow" : el.className.includes("map-marker") ? "location" : el.className.includes("whatsapp") ? "whatsapp" : el.className.includes("instagram") ? "instagram" : "envelope";
    el.replaceWith(icon(doc, kind, icons[kind]));
  });
  setupRsvp(doc, invitation, guest, signal);
  const audio = doc.createElement("audio"); audio.loop = true; audio.preload = "none";
  if (invitation.musicUrl) audio.src = safeUrl(invitation.musicUrl); doc.body.append(audio);
  doc.querySelectorAll(".elementor-widget-bisdev_musik").forEach(el => el.remove());
  const music = doc.createElement("button"); music.type = "button"; music.textContent = "♫"; music.setAttribute("aria-label", "Putar musik");
  Object.assign(music.style, { position: "fixed", bottom: "24px", right: "20px", borderRadius: "50%", width: "42px", height: "42px", background: "#184632", color: "#fff", border: "1px solid #c7b77b", zIndex: "9999", display: "none" });
  music.onclick = () => { if (audio.paused) audio.play().catch(() => undefined); else audio.pause(); };
  audio.onplay = () => music.setAttribute("aria-label", "Jeda musik"); audio.onpause = () => music.setAttribute("aria-label", "Putar musik"); doc.body.append(music);
  const cover = doc.getElementById("sec"), column = doc.getElementById("kolom");
  doc.body.style.overflowY = "hidden";
  if (cover) { cover.style.opacity = "1"; cover.style.visibility = "visible"; }
  if (column) column.style.transform = "translateY(0)";
  doc.getElementById("open")?.addEventListener("click", e => { e.preventDefault();
    if (column) { column.style.transition = "transform 1.5s ease-in-out"; column.style.transform = "translateY(-100%)"; }
    if (cover) { cover.style.transition = "opacity 1.5s ease-in-out"; cover.style.opacity = "0"; cover.style.pointerEvents = "none"; }
    doc.body.style.overflowY = "auto"; onOpen();
    if (invitation.musicUrl) { music.style.display = "block"; audio.play().catch(() => undefined); }
  }, { signal });
  doc.querySelectorAll<HTMLElement>(".e-con.e-parent").forEach(el => el.classList.add("e-lazyloaded"));
  // Original reveal classes, easing, duration and delay are preserved.
  const observer = new win.IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  }), { threshold: 0, rootMargin: "0px 0px -50px 0px" });
  doc.querySelectorAll<HTMLElement>(".idb-reveal,.ef,.reveal,.revealin,.revealkanan,.revealkiri,.revealatas,.revealr").forEach(el => {
    el.style.transitionProperty = "transform, opacity"; el.style.transitionDuration = `${el.dataset.revealDuration || 2000}ms`; el.style.transitionTimingFunction = "ease"; el.style.transitionDelay = `${el.dataset.revealDelay || 0}ms`;
    el.classList.remove("active"); observer.observe(el);
  });
  doc.querySelectorAll<HTMLElement>("#sec .idb-reveal,#sec .ef").forEach(el => el.classList.add("active"));
  const tick = () => {
    const raw = event?.rawDate || "";
    const target = Date.parse(raw && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw) ? raw + "+07:00" : raw);
    const remaining = Math.max(0, (Number.isFinite(target) ? target - Date.now() : 0));
    const values = { days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24, minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60 };
    Object.entries(values).forEach(([key, value]) => text(doc, `[data-part="${key}"] [data-role="num"]`, String(value).padStart(2, "0")));
  };
  tick(); const timer = window.setInterval(tick, 1000);
  const vh = () => doc.documentElement.style.setProperty("--vh", `${win.innerHeight * .01}px`); vh(); win.addEventListener("resize", vh, { signal });
  doc.documentElement.dataset.vistiqReady = "true";
  return () => { controller.abort(); observer.disconnect(); window.clearInterval(timer); audio.pause(); };
}
