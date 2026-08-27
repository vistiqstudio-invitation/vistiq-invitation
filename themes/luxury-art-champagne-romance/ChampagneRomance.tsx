"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

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

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
}

function Photo({ src, alt, className = "", priority = false }: { src: string | null | undefined; alt: string; className?: string; priority?: boolean }) {
  return <div className={className}>{src ? <Image src={src} alt={alt} fill sizes="(max-width: 520px) 100vw, 420px" priority={priority}/> : null}</div>;
}

function ArcTitle() {
  return (
    <svg className={styles.coverArc} viewBox="0 0 190 74" aria-hidden="true">
      <defs>
        <path id="champagne-cover-arc" d="M 31 61 A 67 67 0 0 1 159 61" />
      </defs>
      <text>
        <textPath href="#champagne-cover-arc" startOffset="50%" textAnchor="middle">THE WEDDING OF</textPath>
      </text>
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
        <div className={styles.coverGuest}>
          <span>Kepada Yth.</span>
          <strong>{guest}</strong>
          <small>di Tempat</small>
        </div>
        <button type="button" onClick={onOpen}><Icon name="mail"/> Buka Undangan</button>
      </div>
      <div className={styles.coverLeafShadow}/>
    </section>
  );
  if (staticMode) return body;
  return <motion.div className={styles.coverLayer} exit={{ opacity: 0, y: -38 }} transition={{ duration: 0.85, ease }}>{body}</motion.div>;
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const p = dateParts(invitation.events[0]?.rawDate || invitation.events[0]?.date);
  const slides = useMemo(() => {
    const unique = Array.from(new Set([invitation.gallery[0], invitation.gallery[1], invitation.gallery[2], invitation.coverImage].filter(Boolean) as string[]));
    return unique.length ? unique.slice(0, 3) : [];
  }, [invitation.gallery, invitation.coverImage]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % slides.length), 4200);
    return () => window.clearInterval(id);
  }, [slides.length]);
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroSlider}>
        <AnimatePresence mode="sync">
          {slides[active] ? (
            <motion.div key={slides[active]} className={styles.heroSlide} initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.95, ease }}>
              <Image src={slides[active]} alt={`${bride} & ${groom}`} fill sizes="(max-width:520px) 100vw, 420px"/>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {slides.length > 1 ? <div className={styles.heroDots}>{slides.map((_, i) => <span key={i} className={i === active ? styles.heroDotActive : ""}/>)}</div> : null}
      </div>
      <div className={styles.heroPanel}>
        <p>THE WEDDING OF</p>
        <h2>{bride} <span>&amp;</span> {groom}</h2>
        <small>{p.weekday}, {p.date} {p.month} {p.year}</small>
        <i className={styles.heroArch}/>
      </div>
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
      <Reveal className={styles.collage}>
        <div className={styles.monogram}>{initials}</div>
        {photos.slice(0, 3).map((src, i) => <Photo key={`${src}-${i}`} src={src} alt="Wedding collage" className={styles[`collagePhoto${i + 1}`]}/>) }
      </Reveal>
      <Reveal className={styles.quoteCopy} delay={0.06}>
        <p>“{invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."}”</p>
        <strong>~ {invitation.opening.quoteSource || "QS. Ar-Rum : 21"} ~</strong>
        <div className={styles.quoteLine}/>
        <div className={styles.countdown}>{values.map((v, i) => <div key={i}><b>{String(v).padStart(2, "0")}</b><span>{["Hari", "Jam", "Menit", "Detik"][i]}</span></div>)}</div>
        <button className={styles.saveDate} type="button"><Icon name="calendar"/> Save The Date</button>
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
        <div className={styles.dotOrnament}>•••••• ◯ ••••••</div>
        <h3>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h3>
        <p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaaAllah kami akan menyelenggarakan acara pernikahan:"}</p>
      </div>
      <Reveal className={styles.personBride}>
        <div className={styles.personSageBride}/>
        <Photo src={bridePhoto} alt={invitation.bride.name} className={styles.personPhotoBride}/>
        <div className={styles.personWhiteBride}/>
        <div className={styles.verticalBride}>THE GROOM</div>
        <div className={styles.personInfoBride}>
          <h3>{invitation.bride.name}</h3>
          <p>{invitation.bride.parents}</p>
        </div>
      </Reveal>
      <Reveal className={styles.personGroom}>
        <div className={styles.personSageGroom}/>
        <Photo src={groomPhoto} alt={invitation.groom.name} className={styles.personPhotoGroom}/>
        <div className={styles.personWhiteGroom}/>
        <div className={styles.verticalGroom}>THE BRIDE</div>
        <div className={styles.personInfoGroom}>
          <h3>{invitation.groom.name}</h3>
          <p>{invitation.groom.parents}</p>
        </div>
      </Reveal>
    </section>
  );
}

function EventCard({ event, photo, side, reverse = false }: { event: InvitationData["events"][number]; photo: string | null | undefined; side: string; reverse?: boolean }) {
  const p = dateParts(event.rawDate || event.date);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  return (
    <Reveal className={`${styles.eventCard} ${reverse ? styles.eventReverse : ""}`}>
      <Photo src={photo} alt={event.name} className={styles.eventPhoto}/>
      <div className={styles.eventLower}>
        <div className={styles.eventSide}>{side}</div>
        <div className={styles.eventDetails}>
          <div className={styles.eventDate}><strong>{p.date}</strong><span>{p.weekday.toUpperCase()}<br/>{p.month.toUpperCase()}<br/>{p.year}</span></div>
          <hr/>
          <p>◷ &nbsp; {event.time} - Selesai</p>
          <h4>Lokasi Acara</h4>
          <b>{event.location}</b>
          <a href={maps} target="_blank" rel="noreferrer"><Icon name="pin"/> Google Maps</a>
        </div>
      </div>
    </Reveal>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="event" className={styles.eventsSection}>
      <div className={styles.eventHeading}><b>Wedding</b><em>Event</em></div>
      {invitation.events.slice(0, 2).map((event, i) => (
        <EventCard key={`${event.name}-${i}`} event={event} photo={invitation.gallery[4 + i] || invitation.gallery[i] || invitation.coverImage} side={i === 0 ? "AKAD NIKAH" : "RESEPSI"} reverse={i === 1}/>
      ))}
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
  } catch {
    return null;
  }
  return null;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const video = youtubeEmbed(invitation.videoUrl);
  const photos = invitation.gallery.slice(0, 8);
  return (
    <section id="gallery" className={styles.gallerySection}>
      <div className={styles.galleryHeading}><em>Our</em><b>Gallery</b></div>
      {video ? <div className={styles.videoBox}><iframe src={video} title="Wedding video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div> : null}
      <div className={styles.galleryGrid}>{photos.map((src, i) => <Photo key={`${src}-${i}`} src={src} alt={`Gallery ${i + 1}`} className={`${styles.galleryItem} ${i === 4 ? styles.galleryWide : ""}`}/>)}</div>
    </section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.gallery[6] || invitation.gallery[0] || invitation.coverImage;
  const stories = invitation.story.slice(0, 5);
  return (
    <section id="story" className={styles.storySection}>
      <Photo src={photo} alt="Love story" className={styles.storyPhoto}/>
      <div className={styles.storyLabel}>LOVE STORY</div>
      <div className={styles.storyBody}>
        <div className={styles.storySide}>TRUE STORY</div>
        <div className={styles.storyTimeline}>
          <div className={styles.storyLine}/>
          {stories.map((item, i) => (
            <Reveal key={`${item.year}-${i}`} className={styles.storyItem} delay={i * 0.035}>
              <span className={styles.storyNode}>♥</span>
              <div><h4>{item.title}</h4><small>{item.year}</small><p>{item.description}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
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
  return (
    <section id="wishes" className={styles.wishesSection}>
      <div className={styles.wishesCurve}/>
      <div className={styles.wishesHeading}><b>RSVP &amp; Ucapan</b><em>Wishes</em></div>
      <Reveal className={styles.wishesCard}>
        <p>Berikan ucapan terbaik untuk kedua mempelai</p>
        <form onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kamu"/>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Berikan Ucapan & Do'a" rows={3}/>
          <label>Konfirmasi Kehadiran ?</label>
          <div className={styles.attendance}>
            <button type="button" className={attendance === "Hadir" ? styles.selected : ""} onClick={() => setAttendance("Hadir")}>◉ Hadir</button>
            <button type="button" className={attendance === "Tidak Hadir" ? styles.selected : ""} onClick={() => setAttendance("Tidak Hadir")}>⊗ Tidak Hadir</button>
          </div>
          <button className={styles.sendButton} disabled={submitting} type="submit">{submitting ? "Mengirim..." : "Send"}</button>
          {submitted ? <small className={styles.sent}>Ucapan Anda sudah terkirim.</small> : null}
        </form>
        <div className={styles.wishList}>
          {visible.map((entry) => (
            <div className={styles.wishItem} key={entry.id}>
              <i>{entry.name.slice(0, 1).toUpperCase()}</i>
              <div><b>{entry.name}</b><small>{formatWishDate(entry.created_at)} · {entry.attendance}</small><p>{entry.message}</p></div>
            </div>
          ))}
          {!entries.length ? <p className={styles.emptyWishes}>Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik.</p> : null}
        </div>
        {entries.length ? <div className={styles.pagination}><button type="button" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>←</button><span>{page}/{Math.max(totalPages, page)}</span><button type="button" disabled={page >= totalPages && !hasMore} onClick={nextPage}>→</button></div> : null}
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
      <Reveal className={styles.giftCard}>
        <Icon name="gift"/>
        <h2>Kirim Hadiah</h2>
        <p>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
        {gift ? <><button type="button" onClick={copy}><Icon name="gift"/> {copied ? "Nomor Tersalin" : "Amplop Digital"}</button><small>{gift.bankName || "Bank"} · {gift.accountNumber || "-"}<br/>{gift.accountName || gift.owner}</small></> : null}
      </Reveal>
      <div className={styles.closingIntro}>
        <p>Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do’a restu kepada kami.</p>
        <span>Wassalamu’alaikum Wr. Wb.</span>
      </div>
    </section>
  );
}

function Closing({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = invitation.gallery[7] || invitation.gallery[5] || invitation.gallery[0] || invitation.coverImage;
  return (
    <section className={styles.closing}>
      <Photo src={photo} alt={`${bride} & ${groom}`} className={styles.closingPhoto}/>
      <div className={styles.closingShade}/>
      <div className={styles.closingNames}><span>Kami yang berbahagia,</span><h2>{bride} <em>&amp;</em> {groom}</h2></div>
    </section>
  );
}

const nav = [["home", "home"], ["couple", "couple"], ["event", "calendar"], ["gallery", "gallery"], ["story", "heart"], ["wishes", "chat"], ["gift", "mail"]] as const;

export default function ChampagneRomance({ invitation, previewMode = false }: { invitation: InvitationData; previewMode?: boolean }) {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const open = () => {
    setOpened(true);
    if (invitation.musicUrl && audioRef.current) {
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
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
        <AnimatePresence>{!opened ? <Cover invitation={invitation} onOpen={open}/> : null}</AnimatePresence>
        <div className={`${styles.content} ${opened ? styles.opened : ""}`}>
          <Hero invitation={invitation}/>
          <QuoteCountdown invitation={invitation}/>
          <Couple invitation={invitation}/>
          <Events invitation={invitation}/>
          <Gallery invitation={invitation}/>
          <Story invitation={invitation}/>
          <Wishes invitation={invitation}/>
          <Gift invitation={invitation}/>
          <Closing invitation={invitation}/>
        </div>
        {opened ? <>
          <div className={styles.floatingActions}>
            <button type="button" aria-label="Kirim hadiah" onClick={() => scrollTo("gift")}><Icon name="gift"/></button>
            <button type="button" aria-label="Musik" className={musicOn ? styles.musicOn : ""} onClick={toggleMusic}><Icon name="music"/></button>
          </div>
          <nav className={styles.bottomNav} aria-label="Navigasi undangan">
            {nav.map(([id, icon]) => <button type="button" key={id} aria-label={id} onClick={() => scrollTo(id)}><Icon name={icon}/></button>)}
          </nav>
        </> : null}
      </div>
    </main>
  );
}
