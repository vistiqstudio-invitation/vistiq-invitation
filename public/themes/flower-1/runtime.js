(() => {
  "use strict";
  const channel = "vistiq-flower-one-v1";
  const q = (s, scope = document) => scope.querySelector(s);
  const all = (s, scope = document) => [...scope.querySelectorAll(s)];
  const block = (id) => q(`[data-id="${id}"]`);
  const set = (s, value, scope = document) => all(s, scope).forEach((node) => { node.textContent = value || ""; });
  const heading = (id, value) => set(`[data-id="${id}"] .elementor-heading-title`, value);
  const send = (type, payload = {}) => parent.postMessage({ channel, type, ...payload }, location.origin);
  const audio = q("#flower-audio");
  const music = q("#flower-music");
  const open = q(".modalx button");
  const main = q("#cover");
  const coverLayer = document.createElement("div");
  coverLayer.className = "elementor elementor-97395 flower-cover-layer";
  coverLayer.append(block("633321e"));
  document.body.append(coverLayer);
  main.inert = true;
  open.disabled = true;
  let opened = false;
  let until = 0;
  let activeForm;
  let ready = false;
  const request = setInterval(() => { if (!ready) send("ready"); }, 350);
  const safeUrl = (value, local = false) => {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin);
      if (!/^https?:$/.test(url.protocol)) return "";
      return local || /^https?:\/\//i.test(value) ? url.href : "";
    } catch { return ""; }
  };
  const updateClock = () => {
    let t = Math.max(0, Math.floor((until - Date.now()) / 1000)) || 0;
    for (const [field, scale] of [["days",86400],["hours",3600],["minutes",60],["seconds",1]]) {
      q(`[data-${field}]`).textContent = String(Math.floor(t / scale));
      t %= scale;
    }
  };
  const mapEvent = (event, fallback, ids) => {
    const [name, detail, place, link] = ids;
    for (const id of ids) block(id).hidden = !event;
    if (!event) return;
    heading(name, event.name);
    const values = all(".elementor-icon-list-text", block(detail));
    values[0].textContent = event.date || "";
    values[1].textContent = event.time ? `Pukul: ${event.time}` : "";
    const location = q(".elementor-heading-title", block(place));
    location.replaceChildren("Bertempat di", document.createElement("br"), event.location || "");
    block(place).hidden = !event.location;
    const anchor = q("a", block(link));
    const url = safeUrl(event.mapsUrl || fallback);
    anchor.hidden = !url;
    if (url) anchor.href = url;
    else anchor.removeAttribute("href");
  };
  const init = (data, guest) => {
    if (!data) return;
    const names = [data.groom.nickname || data.groom.name, data.bride.nickname || data.bride.name].filter(Boolean).join(" & ");
    for (const id of ["255ab3b4","6557ab6a","49c30813"]) heading(id, names);
    set(".wdp-mempelai", names);
    const guestName = (guest || "").trim().slice(0, 120) || "Tamu Undangan";
    heading("5fac4413", guestName);
    set(".wdp-name", guestName);
    heading("c214139", data.bride.name); heading("74914676", data.bride.parents);
    heading("13c632da", data.groom.name); heading("4761a269", data.groom.parents);
    const opening = data.opening || {};
    if (opening.title) heading("3aa1de1b", opening.title);
    if (opening.greeting) heading("187d4735", opening.greeting);
    if (opening.description) heading("c65c6f4", opening.description);
    if (opening.quote || opening.quoteSource) {
      const node = q(".elementor-heading-title", block("4e467933"));
      node.replaceChildren(opening.quote || "", document.createElement("br"), opening.quoteSource || "");
    }
    if (data.closingGreeting) heading("512ed516", data.closingGreeting);
    heading("68e3516", data.brand?.name || "Vistiq Invitation");
    const primary = data.coverEvent || data.events[0];
    heading("4a60ef06", primary?.date);
    const raw = primary?.rawDate || "";
    const time = primary?.time || "";
    const offset = /WITA/i.test(time) ? "+08:00" : /WIT\b/i.test(time) ? "+09:00" : "+07:00";
    until = Date.parse(/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(raw) ? raw + offset : raw);
    updateClock();
    const events = data.events || [];
    const eventGroups = [["8dbf859","3ecc0e3","cab7986","521b9c6"], ["c6b311a","0eb614f","db66c97","a3d504a"]];
    for (const [index, ids] of eventGroups.entries()) mapEvent(events[index], data.mapsUrl, ids);
    const eventParent = block("8dbf859").closest('[data-id="97cb557"]');
    eventParent.querySelectorAll(".flower-extra-event").forEach((node) => node.remove());
    events.slice(2).forEach((event) => {
      const extra = document.createElement("div"); extra.className = "flower-extra-event";
      const title = document.createElement("h2"); title.textContent = event.name;
      const detail = document.createElement("p"); detail.textContent = [event.date, event.time, event.location].filter(Boolean).join(" · ");
      extra.append(title, detail);
      const url = safeUrl(event.mapsUrl || data.mapsUrl);
      if (url) { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Google maps"; extra.append(a); }
      eventParent.append(extra);
    });
    const story = q("#flower-story");
    story.replaceChildren();
    block("607bd0c").hidden = !data.story?.length;
    for (const entry of data.story || []) {
      const item = q("#flower-story-item").content.cloneNode(true);
      set(".weddingpress-timeline-title span", entry.title, item);
      set(".weddingpress-timeline-meta li", entry.year, item);
      set("p", entry.description, item);
      story.append(item);
    }
    const gifts = (data.gifts || []).filter((g) => g.accountNumber);
    block("b66a2e0").hidden = !gifts.length;
    const groups = [["4212471","7598864","5934667","e02ddd9","1aab25c"],["37dd4ad","f388030","cce200f","169ba85","5f3d2bc"]];
    groups.forEach(([bank, holder, number, copy, section], i) => {
      const gift = gifts[i];
      block(section).hidden = !gift;
      if (!gift) return;
      const bankName = gift.bankName || "";
      const logo = ({ BCA: "/banks/BCA.png", BRI: "./1200px-Logo_BRI.png", MANDIRI: "/banks/Mandiri.png" })[bankName.toUpperCase().replace(/^BANK\s+/, "")];
      const bankNode = q(".flower-bank", block(bank));
      if (logo) { const img = document.createElement("img"); img.src = logo; img.alt = bankName; bankNode.replaceChildren(img); }
      else bankNode.textContent = bankName;
      heading(holder, gift.accountName || gift.owner);
      heading(number, gift.accountNumber);
      const btn = q("button", block(copy));
      btn.onclick = async () => {
        try { await navigator.clipboard.writeText(gift.accountNumber); btn.textContent = "Tersalin"; }
        catch { btn.textContent = "Salin manual"; }
      };
    });
    const musicUrl = safeUrl(data.musicUrl, true);
    if (musicUrl && audio.src !== musicUrl) audio.src = musicUrl;
    if (!musicUrl) audio.removeAttribute("src");
    music.hidden = !opened || !musicUrl;
    for (const form of all(".flower-form")) {
      if (guest && !form.elements.name.value) form.elements.name.value = guestName;
      if (!data.id) q(".flower-status", form).textContent = "RSVP tersedia pada undangan klien.";
    }
    open.disabled = false;
    ready = true;
    clearInterval(request);
  };
  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) if (isIntersecting) {
      const anim = (matchMedia("(max-width:767px)").matches && target.dataset.revealMobile) || target.dataset.reveal;
      target.classList.add("flower-revealed", anim);
      observer.unobserve(target);
    }
  }, { threshold: .12 }) : null;
  open.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    document.body.classList.add("flower-open");
    coverLayer.inert = true;
    main.inert = false;
    window.scrollTo(0, 0);
    if (audio.hasAttribute("src")) { music.hidden = false; audio.play().catch(() => {}); }
    all("[data-reveal]", main).forEach((node) => observer?.observe(node));
    send("opened");
    const finishOpening = () => { coverLayer.hidden = true; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishOpening();
    } else {
      coverLayer.addEventListener("transitionend", (event) => {
        if (event.target === coverLayer && event.propertyName === "transform") finishOpening();
      });
      coverLayer.classList.add("flower-closing");
      setTimeout(finishOpening, 850);
    }
  });
  music.addEventListener("click", () => { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); });
  audio.addEventListener("play", () => { music.textContent = "Ⅱ"; music.setAttribute("aria-label", "Jeda musik"); });
  audio.addEventListener("pause", () => { music.textContent = "♫"; music.setAttribute("aria-label", "Putar musik"); });
  q("#flower-more").addEventListener("click", () => send("loadMore"));
  for (const form of all(".flower-form")) form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (activeForm) return;
    activeForm = form;
    q('button[type="submit"]', form).disabled = true;
    q(".flower-status", form).textContent = "Mengirim…";
    send("submit", { input: Object.fromEntries(new FormData(form)) });
  });
  window.addEventListener("message", ({ origin, source, data }) => {
    if (origin !== location.origin || source !== parent || data?.channel !== channel) return;
    if (data.type === "init") init(data.invitation, data.guest);
    if (data.type === "wishes") {
      const list = q("#flower-wishes");
      list.replaceChildren();
      for (const item of data.state.entries || []) {
        const row = document.createElement("article");
        const name = document.createElement("strong");
        const message = document.createElement("p");
        name.textContent = item.name;
        message.textContent = item.message;
        row.append(name, message);
        list.append(row);
      }
      q("#flower-more").hidden = !data.state.hasMore;
    }
    if (data.type === "result" && activeForm) {
      q(".flower-status", activeForm).textContent = data.error || "Terima kasih! Konfirmasi dan ucapan sudah terkirim.";
      q('button[type="submit"]', activeForm).disabled = false;
      if (!data.error) activeForm.reset();
      activeForm = null;
    }
  });
  setInterval(updateClock, 1000);
  send("ready");
})();
