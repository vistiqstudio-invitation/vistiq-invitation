"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
type Direction = "up" | "down" | "left" | "right" | "scale";
type IconName = "home" | "couple" | "calendar" | "gallery" | "heart" | "chat" | "gift" | "music" | "mail" | "pin" | "copy";

function Icon({ name }: { name: IconName }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" && <><path {...p} d="M3.5 11 12 4l8.5 7"/><path {...p} d="M5.5 10v9h13v-9M9.5 19v-5h5v5"/></>}
      {name === "couple" && <><circle {...p} cx="8" cy="8" r="2.25"/><circle {...p} cx="16" cy="8" r="2.25"/><path {...p} d="M4 19v-2.2A4.1 4.1 0 0 1 8 12.6a4 4 0 0 1 4 4V19M12 19v-2.4a4 4 0 0 1 8 0V19"/></>}
      {name === "calendar" && <><rect {...p} x="3.5" y="5" width="17" height="15" rx="2"/><path {...p} d="M7 3v4M17 3v4M3.5 9.5h17"/></>}
      {name === "gallery" && <><rect {...p} x="3.5" y="4" width="17" height="16" rx="2"/><circle {...p} cx="8" cy="9" r="1.35"/><path {...p} d="m5.5 17 4-4 3 2.5 2.5-2.7 3.5 4.2"/></>}
      {name === "heart" && <path {...p} d="M20.5 7c0 4.8-8.5 11-8.5 11S3.5 11.8 3.5 7A4 4 0 0 1 7.5 3c1.9 0 3.2 1.1 4.5 3 1.3-1.9 2.6-3 4.5-3a4 4 0 0 1 4 4Z"/>}
      {name === "chat" && <><path {...p} d="M4 5.5h16v11H9l-5 3v-14Z"/><path {...p} d="M8 10h8M8 13h5"/></>}
      {name === "gift" && <><rect {...p} x="3.5" y="9" width="17" height="11" rx="1.4"/><path {...p} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z"/></>}
      {name === "music" && <><path {...p} d="M9 18V5l10-2v13"/><circle {...p} cx="6" cy="18" r="3"/><circle {...p} cx="16" cy="16" r="3"/></>}
      {name === "mail" && <><rect {...p} x="3" y="5.5" width="18" height="13" rx="2"/><path {...p} d="m4.5 7 7.5 6 7.5-6"/></>}
      {name === "pin" && <><path {...p} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"/><circle {...p} cx="12" cy="10" r="2"/></>}
      {name === "copy" && <><rect {...p} x="8" y="8" width="11" height="12" rx="2"/><path {...p} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>}
    </svg>
  );
}

function firstName(name: string, nickname?: string | null) {
  return nickname?.trim() || name.trim().split(" ")[0];
}

function dateParts(raw?: string | null) {
  const parsed = raw ? new Date(raw) : new Date();
  const d = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return {
    weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(d),
    date: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(d),
    year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(d),
  };
}

function revealInitial(direction: Direction) {
  if (direction === "left") return { opacity: 0, x: -34, y: 0, scale: 1, filter: "blur(5px)" };
  if (direction === "right") return { opacity: 0, x: 34, y: 0, scale: 1, filter: "blur(5px)" };
  if (direction === "down") return { opacity: 0, x: 0, y: -28, scale: 1, filter: "blur(5px)" };
  if (direction === "scale") return { opacity: 0, x: 0, y: 0, scale: 0.92, filter: "blur(5px)" };
  return { opacity: 0, x: 0, y: 30, scale: 1, filter: "blur(5px)" };
}

function Reveal({ children, className = "", delay = 0, direction = "up", amount = 0.2 }: { children: ReactNode; className?: string; delay?: number; direction?: Direction; amount?: number }) {
  return (
    <motion.div
      className={className}
      initial={revealInitial(direction)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount, margin: "0px 0px -7% 0px" }}
      transition={{ duration: 0.78, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Photo({ src, alt, className = "", priority = false }: { src: string | null | undefined; alt: string; className?: string; priority?: boolean }) {
  return <div className={className}>{src ? <Image src={src} alt={alt} fill sizes="(max-width: 520px) 100vw, 420px" priority={priority}/> : null}</div>;
}

function MotionPhoto({ src, alt, className = "", delay = 0, direction = "scale", amount = 0.18 }: { src: string | null | undefined; alt: string; className?: string; delay?: number; direction?: Direction; amount?: number }) {
  return (
    <motion.div
      className={className}
      initial={revealInitial(direction)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount, margin: "0px 0px -7% 0px" }}
      transition={{ duration: 0.82, delay, ease }}
    >
      {src ? <Image src={src} alt={alt} fill sizes="(max-width: 520px) 100vw, 420px"/> : null}
    </motion.div>
  );
}

function ArcTitle() {
  return (
    <svg className={styles.coverArc} viewBox="0 0 190 74" aria-hidden="true">
      <defs><path id="champagne-cover-arc" d="M 31 61 A 67 67 0 0 1 159 61" /></defs>
      <text><textPath href="#champagne-cover-arc" startOffset="50%" textAnchor="middle">THE WEDDING OF</textPath></text>
    </svg>
  );
}

function Cover({ invitation, onOpen, staticMode = false }: { invitation: InvitationData; onOpen: () => void; staticMode?: boolean }) {
  const query = useSearchParams();
  const guest = query.get("to") || "Bpk/Ibu/Saudara/i";
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const cover = invitation.coverImage || invitation.gallery[0] || invitation.bride.photo;
  const body = (
    <section className={`${styles.cover} ${staticMode ? styles.coverStatic : ""}`}>
      <Photo src={cover} alt={`${bride} & ${groom}`} className={styles.coverPhoto} priority/>
      <div className={styles.coverGradient}/>
      <div className={styles.coverTopDetail}><i/><span/><i/></div>
      <div className={styles.coverCopy}>
        <ArcTitle/>
        <h1>{bride} <em>&amp;</em> {groom}</h1>
        <div className={styles.coverGuest}><span>Kepada Yth.</span><strong>{guest}</strong><small>di Tempat</small></div>
        <button type="button" onClick={onOpen}><Icon name="mail"/> Buka Undangan</button>
      </div>
      <div className={styles.coverLeafShadow}/>
    </section>
  );
  if (staticMode) return body;
  return <motion.div className={styles.coverLayer} exit={{ opacity: 0, y: -42, scale: 1.015 }} transition={{ duration: 0.82, ease }}>{body}</motion.div>;
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const p = dateParts(invitation.events[0]?.rawDate || invitation.events[0]?.date);
  const slides = useMemo(() => Array.from(new Set([invitation.gallery[0], invitation.gallery[1], invitation.gallery[2], invitation.coverImage].filter(Boolean) as string[])).slice(0, 3), [invitation.gallery, invitation.coverImage]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % slides.length), 4200);
    return () => window.clearInterval(id);
  }, [slides.length]);
  return (
    <section id="home" className={styles.hero}>
      <motion.div className={styles.heroSlider} initial={{ opacity: 0, scale: 1.045 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.05, ease }}>
        <AnimatePresence mode="sync">
          {slides[active] ? <motion.div key={slides[active]} className={styles.heroSlide} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.05, ease }}><Image src={slides[active]} alt={`${bride} & ${groom}`} fill sizes="(max-width:520px) 100vw, 420px"/></motion.div> : null}
        </AnimatePresence>
        {slides.length > 1 ? <motion.div className={styles.heroDots} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6, ease }}>{slides.map((_, i) => <span key={i} className={i === active ? styles.heroDotActive : ""}/>)}</motion.div> : null}
      </motion.div>
      <motion.div className={styles.heroPanel} initial={{ opacity: 0, y: 54 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.9, ease }}>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.65, ease }}>THE WEDDING OF</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.48, duration: 0.72, ease }}>{bride} <span>&amp;</span> {groom}</motion.h2>
        <motion.small initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, duration: 0.65, ease }}>{p.weekday}, {p.date} {p.month} {p.year}</motion.small>
        <motion.i className={styles.heroArch} initial={{ opacity: 0, scale: 0.75, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.62, duration: 0.75, ease }}/>
      </motion.div>
    </section>
  );
}

function QuoteCountdown({ invitation }: { invitation: InvitationData }) {
  const event = invitation.events[0];
  const target = useMemo(() => new Date(event?.rawDate || event?.date || Date.now()).getTime(), [event?.rawDate, event?.date]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
  const photos = [invitation.gallery[1], invitation.gallery[2], invitation.gallery[3]].filter(Boolean) as string[];
  const initials = `${firstName(invitation.bride.name, invitation.bride.nickname)[0] || "A"}${firstName(invitation.groom.name, invitation.groom.nickname)[0] || "H"}`;
  return (
    <section className={styles.quoteSection}>
      <div className={styles.quoteCurve}/>
      <Reveal className={styles.collage} direction="scale" amount={0.24}>
        <Reveal className={styles.monogram} direction="left" delay={0.08}><span>{initials}</span></Reveal>
        {photos.slice(0, 3).map((src, i) => <MotionPhoto key={`${src}-${i}`} src={src} alt="Wedding collage" className={styles[`collagePhoto${i + 1}`]} delay={0.1 + i * 0.09} direction={i === 1 ? "left" : "right"}/>) }
      </Reveal>
      <Reveal className={styles.quoteCopy} delay={0.04}>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.12, duration: 0.65, ease }}>“{invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."}”</motion.p>
        <motion.strong initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.18, duration: 0.6, ease }}>~ {invitation.opening.quoteSource || "QS. Ar-Rum : 21"} ~</motion.strong>
        <motion.div className={styles.quoteLine} initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.22, duration: 0.7, ease }}/>
        <div className={styles.countdown}>{values.map((v, i) => <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.24 + i * 0.07, duration: 0.6, ease }}><b>{String(v).padStart(2, "0")}</b><span>{["Hari", "Jam", "Menit", "Detik"][i]}</span></motion.div>)}</div>
        <motion.button className={styles.saveDate} type="button" initial={{ opacity: 0, y: 14, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.48, duration: 0.65, ease }}><Icon name="calendar"/> Save The Date</motion.button>
      </Reveal>
    </section>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const bridePhoto = invitation.bride.photo || invitation.gallery[2];
  const groomPhoto = invitation.groom.photo || invitation.gallery[3];
  return (
    <section id="couple" className={styles.coupleSection}>
      <div className={styles.greeting}>
        <Reveal direction="scale" delay={0.02}><div className={styles.dotOrnament}>•••••• ◯ ••••••</div></Reveal>
        <Reveal delay={0.08}><h3>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h3></Reveal>
        <Reveal delay={0.14}><p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara pernikahan:"}</p></Reveal>
      </div>
      <Reveal className={styles.personBride} direction="left" amount={0.14}>
        <motion.div className={styles.personSageBride} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease }}/>
        <MotionPhoto src={bridePhoto} alt={invitation.bride.name} className={styles.personPhotoBride} direction="left" delay={0.08}/>
        <motion.div className={styles.personWhiteBride} initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.12, duration: 0.72, ease }}/>
        <Reveal className={styles.verticalBride} direction="down" delay={0.2}>THE GROOM</Reveal>
        <Reveal className={styles.personInfoBride} delay={0.24}><h3>{invitation.bride.name}</h3><p>{invitation.bride.parents}</p></Reveal>
      </Reveal>
      <Reveal className={styles.personGroom} direction="right" amount={0.14}>
        <motion.div className={styles.personSageGroom} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease }}/>
        <MotionPhoto src={groomPhoto} alt={invitation.groom.name} className={styles.personPhotoGroom} direction="right" delay={0.08}/>
        <motion.div className={styles.personWhiteGroom} initial={{ opacity: 0, x: -26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.12, duration: 0.72, ease }}/>
        <Reveal className={styles.verticalGroom} direction="down" delay={0.2}>THE BRIDE</Reveal>
        <Reveal className={styles.personInfoGroom} delay={0.24}><h3>{invitation.groom.name}</h3><p>{invitation.groom.parents}</p></Reveal>
      </Reveal>
    </section>
  );
}

function EventCard({ event, photo, side, reverse = false }: { event: InvitationData["events"][number]; photo: string | null | undefined; side: string; reverse?: boolean }) {
  const p = dateParts(event.rawDate || event.date);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  return (
    <motion.div className={`${styles.eventCard} ${reverse ? styles.eventReverse : ""}`} initial={{ opacity: 0, y: 38, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.16, margin: "0px 0px -6% 0px" }} transition={{ duration: 0.82, ease }}>
      <MotionPhoto src={photo} alt={event.name} className={styles.eventPhoto} direction="scale" delay={0.06}/>
      <motion.div className={styles.eventLower} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.12, duration: 0.72, ease }}>
        <motion.div className={styles.eventSide} initial={{ opacity: 0, x: reverse ? 22 : -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: 0.18, duration: 0.62, ease }}>{side}</motion.div>
        <motion.div className={styles.eventDetails} initial={{ opacity: 0, x: reverse ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ delay: 0.2, duration: 0.68, ease }}>
          <div className={styles.eventDate}><motion.strong initial={{ opacity: 0, scale: 0.82 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.28, duration: 0.55, ease }}>{p.date}</motion.strong><span>{p.weekday.toUpperCase()}<br/>{p.month.toUpperCase()}<br/>{p.year}</span></div>
          <hr/><p>◷ &nbsp; {event.time} - Selesai</p><h4>Lokasi Acara</h4><b>{event.location}</b>
          <motion.a href={maps} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.36, duration: 0.55, ease }}><Icon name="pin"/> Google Maps</motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="event" className={styles.eventsSection}>
      <Reveal className={styles.eventHeading} direction="scale"><b>Wedding</b><em>Event</em></Reveal>
      {invitation.events.slice(0, 2).map((event, i) => <EventCard key={`${event.name}-${i}`} event={event} photo={invitation.gallery[4 + i] || invitation.gallery[i] || invitation.coverImage} side={i === 0 ? "AKAD NIKAH" : "RESEPSI"} reverse={i === 1}/>) }
    </section>
  );
}

function youtubeEmbed(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch { return null; }
  return null;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const video = youtubeEmbed(invitation.videoUrl);
  const photos = invitation.gallery.slice(0, 8);
  return (
    <section id="gallery" className={styles.gallerySection}>
      <Reveal className={styles.galleryHeading} direction="scale"><em>Our</em><b>Gallery</b></Reveal>
      {video ? <Reveal className={styles.videoBox} direction="scale" delay={0.08}><iframe src={video} title="Wedding video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></Reveal> : null}
      <div className={styles.galleryGrid}>{photos.map((src, i) => <MotionPhoto key={`${src}-${i}`} src={src} alt={`Gallery ${i + 1}`} className={`${styles.galleryItem} ${i === 4 ? styles.galleryWide : ""}`} direction={i % 2 === 0 ? "left" : "right"} delay={(i % 4) * 0.055} amount={0.12}/>)}</div>
    </section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.gallery[6] || invitation.gallery[0] || invitation.coverImage;
  const stories = invitation.story.slice(0, 5);
  return (
    <section id="story" className={styles.storySection}>
      <MotionPhoto src={photo} alt="Love story" className={styles.storyPhoto} direction="scale"/>
      <Reveal className={styles.storyLabel} direction="scale" delay={0.1}>LOVE STORY</Reveal>
      <motion.div className={styles.storyBody} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ delay: 0.12, duration: 0.76, ease }}>
        <Reveal className={styles.storySide} direction="left" delay={0.16}>TRUE STORY</Reveal>
        <div className={styles.storyTimeline}>
          <motion.div className={styles.storyLine} initial={{ scaleY: 0, transformOrigin: "top" }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.22, duration: 1.1, ease }}/>
          {stories.map((item, i) => <Reveal key={`${item.year}-${i}`} className={styles.storyItem} delay={0.24 + i * 0.075} direction="right"><motion.span className={styles.storyNode} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.28 + i * 0.075, duration: 0.45, ease }}>♥</motion.span><div><h4>{item.title}</h4><small>{item.year}</small><p>{item.description}</p></div></Reveal>)}
        </div>
      </motion.div>
    </section>
  );
}

function formatWishDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
}

function Wishes({ invitation }: { invitation: InvitationData }) {
  const { entries, submit, submitting, submitted, hasMore, loadMore } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [page, setPage] = useState(1);
  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(entries.length / perPage));
  const visible = entries.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const nextPage = () => {
    if (page < totalPages) setPage((v) => v + 1);
    else if (hasMore) { loadMore(); window.setTimeout(() => setPage((v) => v + 1), 0); }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const result = await submit({ name: name.trim(), whatsapp: "", attendance, message: message.trim() });
    if (!result.error) { setName(""); setMessage(""); setPage(1); }
  };
  const field = (delay: number) => ({ initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { delay, duration: 0.52, ease } });
  return (
    <section id="wishes" className={styles.wishesSection}>
      <div className={styles.wishesCurve}/>
      <Reveal className={styles.wishesHeading} direction="scale"><b>RSVP &amp; Ucapan</b><em>Wishes</em></Reveal>
      <Reveal className={styles.wishesCard} direction="scale" delay={0.08} amount={0.12}>
        <motion.p {...field(0.12)}>Berikan ucapan terbaik untuk kedua mempelai</motion.p>
        <form onSubmit={onSubmit}>
          <motion.input {...field(0.16)} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kamu"/>
          <motion.textarea {...field(0.2)} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Berikan Ucapan & Do'a" rows={3}/>
          <motion.label {...field(0.24)}>Konfirmasi Kehadiran ?</motion.label>
          <motion.div className={styles.attendance} {...field(0.28)}><button type="button" className={attendance === "Hadir" ? styles.selected : ""} onClick={() => setAttendance("Hadir")}>◉ Hadir</button><button type="button" className={attendance === "Tidak Hadir" ? styles.selected : ""} onClick={() => setAttendance("Tidak Hadir")}>⊗ Tidak Hadir</button></motion.div>
          <motion.button className={styles.sendButton} disabled={submitting} type="submit" {...field(0.32)}>{submitting ? "Mengirim..." : "Send"}</motion.button>
          {submitted ? <small className={styles.sent}>Ucapan Anda sudah terkirim.</small> : null}
        </form>
        <div className={styles.wishList}>
          {visible.map((entry, i) => <Reveal className={styles.wishItem} key={entry.id} delay={0.06 + i * 0.06} direction="right"><i>{entry.name.slice(0, 1).toUpperCase()}</i><div><b>{entry.name}</b><small>{formatWishDate(entry.created_at)} · {entry.attendance}</small><p>{entry.message}</p></div></Reveal>)}
          {!entries.length ? <Reveal direction="up" delay={0.16}><p className={styles.emptyWishes}>Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik.</p></Reveal> : null}
        </div>
        {entries.length ? <Reveal className={styles.pagination} direction="scale" delay={0.18}><button type="button" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>←</button><span>{page}/{Math.max(totalPages, page)}</span><button type="button" disabled={page >= totalPages && !hasMore} onClick={nextPage}>→</button></Reveal> : null}
      </Reveal>
    </section>
  );
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const gift = invitation.gifts[0];
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!gift?.accountNumber) return;
    await navigator.clipboard?.writeText(gift.accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <section id="gift" className={styles.giftSection}>
      <Reveal className={styles.giftCard} direction="scale" amount={0.16}>
        <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -12 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: 0.65, ease }}><Icon name="gift"/></motion.div>
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18, duration: 0.6, ease }}>Kirim Hadiah</motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.24, duration: 0.6, ease }}>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</motion.p>
        {gift ? <><motion.button type="button" onClick={copy} initial={{ opacity: 0, y: 12, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6, ease }}><Icon name="gift"/> {copied ? "Nomor Tersalin" : "Amplop Digital"}</motion.button><motion.small initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.36, duration: 0.55, ease }}>{gift.bankName || "Bank"} · {gift.accountNumber || "-"}<br/>{gift.accountName || gift.owner}</motion.small></> : null}
      </Reveal>
      <Reveal className={styles.closingIntro} direction="right" delay={0.08}><p>Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do’a restu kepada kami.</p><span>Wassalamu’alaikum Wr. Wb.</span></Reveal>
    </section>
  );
}

function Closing({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = invitation.gallery[7] || invitation.gallery[5] || invitation.gallery[0] || invitation.coverImage;
  return (
    <section className={styles.closing}>
      <MotionPhoto src={photo} alt={`${bride} & ${groom}`} className={styles.closingPhoto} direction="scale" amount={0.12}/>
      <motion.div className={styles.closingShade} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ delay: 0.18, duration: 1.0, ease }}/>
      <Reveal className={styles.closingNames} direction="up" delay={0.24} amount={0.2}><span>Kami yang berbahagia,</span><h2>{bride} <em>&amp;</em> {groom}</h2></Reveal>
    </section>
  );
}

const nav = [["home", "home"], ["couple", "couple"], ["event", "calendar"], ["gallery", "gallery"], ["story", "heart"], ["wishes", "chat"], ["gift", "mail"]] as const;

export default function ChampagneRomance({ invitation, previewMode = false }: { invitation: InvitationData; previewMode?: boolean }) {
  const [opened, setOpened] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const open = () => {
    setOpened(true);
    if (invitation.musicUrl && audioRef.current) audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
  };
  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    else { el.pause(); setMusicOn(false); }
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (previewMode) return <div className={styles.previewShell}><Cover invitation={invitation} onOpen={() => {}} staticMode/></div>;
  return (
    <main className={styles.stage}>
      <div className={styles.invitation}>
        {invitation.musicUrl ? <audio ref={audioRef} src={invitation.musicUrl} loop preload="none"/> : null}
        <AnimatePresence onExitComplete={() => setContentReady(true)}>{!opened ? <Cover invitation={invitation} onOpen={open}/> : null}</AnimatePresence>
        {contentReady ? <motion.div className={`${styles.content} ${styles.opened}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease }}>
          <Hero invitation={invitation}/><QuoteCountdown invitation={invitation}/><Couple invitation={invitation}/><Events invitation={invitation}/><Gallery invitation={invitation}/><Story invitation={invitation}/><Wishes invitation={invitation}/><Gift invitation={invitation}/><Closing invitation={invitation}/>
        </motion.div> : null}
        {contentReady ? <>
          <motion.div className={styles.floatingActions} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.65, ease }}>
            <button type="button" aria-label="Kirim hadiah" onClick={() => scrollTo("gift")}><Icon name="gift"/></button>
            <button type="button" aria-label="Musik" className={musicOn ? styles.musicOn : ""} onClick={toggleMusic}><Icon name="music"/></button>
          </motion.div>
          <motion.nav className={styles.bottomNav} aria-label="Navigasi undangan" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.45, duration: 0.72, ease }}>
            {nav.map(([id, icon], i) => <motion.button type="button" key={id} aria-label={id} onClick={() => scrollTo(id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.045, duration: 0.5, ease }}><Icon name={icon}/></motion.button>)}
          </motion.nav>
        </> : null}
      </div>
    </main>
  );
}
