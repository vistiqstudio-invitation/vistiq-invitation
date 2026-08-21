"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const revealEase = [0.22, 1, 0.36, 1] as const;
const coverEase = [0.23, 0.56, 0.38, 0.78] as const;

type IconName = "home" | "couple" | "calendar" | "gallery" | "heart" | "chat" | "gift" | "music" | "pin" | "copy";

function Icon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" && <><path {...common} d="M3.5 11 12 4l8.5 7"/><path {...common} d="M5.5 10v9h13v-9M9.5 19v-5h5v5"/></>}
      {name === "couple" && <><circle {...common} cx="8" cy="8" r="2.4"/><circle {...common} cx="16" cy="8" r="2.4"/><path {...common} d="M3.8 19v-2.3A4.2 4.2 0 0 1 8 12.5a4 4 0 0 1 4 4V19M12 19v-2.5a4 4 0 0 1 8 0V19"/></>}
      {name === "calendar" && <><rect {...common} x="3.5" y="5" width="17" height="15" rx="2"/><path {...common} d="M7 3v4M17 3v4M3.5 9.5h17M8 13h3v3H8z"/></>}
      {name === "gallery" && <><rect {...common} x="3.5" y="4" width="17" height="16" rx="2"/><circle {...common} cx="8.5" cy="9" r="1.5"/><path {...common} d="m5.5 17 4.2-4 2.7 2.4 2.6-2.7 3.5 4.3"/></>}
      {name === "heart" && <path {...common} d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z"/>}
      {name === "chat" && <><path {...common} d="M4 5.5h16v11H9l-5 3v-14Z"/><path {...common} d="M8 10h8M8 13h5"/></>}
      {name === "gift" && <><rect {...common} x="3.5" y="9" width="17" height="11" rx="1.5"/><path {...common} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z"/></>}
      {name === "music" && <><path {...common} d="M9 18V5l10-2v13"/><circle {...common} cx="6" cy="18" r="3"/><circle {...common} cx="16" cy="16" r="3"/></>}
      {name === "pin" && <><path {...common} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"/><circle {...common} cx="12" cy="10" r="2"/></>}
      {name === "copy" && <><rect {...common} x="8" y="8" width="11" height="12" rx="2"/><path {...common} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>}
    </svg>
  );
}

function SectionAccents({ variant = "sides" }: { variant?: "sides" | "top" | "bottom" }) {
  const variantClass = variant === "top" ? styles.accentsTop : variant === "bottom" ? styles.accentsBottom : styles.accentsSides;
  return (
    <div className={`${styles.accents} ${variantClass}`} aria-hidden="true">
      <motion.i className={styles.accentLeft} animate={{ rotate: [-1.8, 1.4, -1.8], y: [0, -5, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}/>
      <motion.i className={styles.accentRight} animate={{ rotate: [1.4, -1.8, 1.4], y: [0, 6, 0] }} transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: .3 }}/>
      <motion.i className={styles.accentBloom} animate={{ scale: [1, 1.035, 1], y: [0, -3, 0] }} transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut" }}/>
    </div>
  );
}

function Scene({ dense = false, staged = false, active = true, arch = false }: { dense?: boolean; staged?: boolean; active?: boolean; arch?: boolean }) {
  return (
    <div className={`${styles.scene} ${dense ? styles.sceneDense : ""}`} aria-hidden="true">
      <motion.i className={styles.sceneArtwork} initial={staged ? { opacity: 0, scale: 1.08 } : false} animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }} transition={{ delay: staged ? 1 : 0, duration: 1.3, ease: revealEase }}/>
      <motion.i className={styles.cloudOne} animate={{ x: [0, 24, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}/>
      <motion.i className={styles.cloudTwo} animate={{ x: [0, -28, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}/>
      {arch && (
        <motion.i className={styles.gardenArch} initial={staged ? { opacity: 0, scale: .74, y: 80 } : false} animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: .74, y: 80 }} transition={{ delay: staged ? 1.9 : .1, duration: 1.1, ease: revealEase }}/>
      )}
      <motion.i className={styles.plantLeft} initial={staged ? { opacity: 0, x: -70, y: 60 } : false} animate={active ? { opacity: 1, x: 0, y: [0, -4, 0], rotate: [-1, 1, -1] } : { opacity: 0, x: -70, y: 60 }} transition={{ opacity: { delay: staged ? 2.5 : .1, duration: .8 }, x: { delay: staged ? 2.5 : .1, duration: .8, ease: revealEase }, y: { delay: staged ? 3.3 : .9, duration: 4.6, repeat: Infinity, ease: "easeInOut" }, rotate: { delay: staged ? 3.3 : .9, duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}/>
      <motion.i className={styles.plantRight} initial={staged ? { opacity: 0, x: 70, y: 70 } : false} animate={active ? { opacity: 1, x: 0, y: [0, 5, 0], rotate: [1, -1.2, 1] } : { opacity: 0, x: 70, y: 70 }} transition={{ opacity: { delay: staged ? 2.8 : .2, duration: .8 }, x: { delay: staged ? 2.8 : .2, duration: .8, ease: revealEase }, y: { delay: staged ? 3.6 : 1, duration: 5.2, repeat: Infinity, ease: "easeInOut" }, rotate: { delay: staged ? 3.6 : 1, duration: 5.2, repeat: Infinity, ease: "easeInOut" } }}/>
      <motion.i className={styles.flowerBottom} initial={staged ? { opacity: 0, y: 100, scale: .86 } : false} animate={active ? { opacity: 1, y: 0, scale: [1, 1.018, 1] } : { opacity: 0, y: 100, scale: .86 }} transition={{ opacity: { delay: staged ? 1.5 : .2, duration: 1 }, y: { delay: staged ? 1.5 : .2, duration: 1, ease: revealEase }, scale: { delay: staged ? 2.6 : 1.2, duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}/>
    </div>
  );
}

function OvalPortrait({ src, alt, priority = false }: { src: string | null; alt: string; priority?: boolean }) {
  return <div className={styles.ovalPortrait}><div className={styles.ovalInner}>{src && <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 600px) 66vw, 310px"/>}</div><Image className={styles.ovalFrameAsset} src="/themes/luxury-art-garden/oval-frame.webp" alt="" fill priority={priority} sizes="(max-width: 600px) 76vw, 350px" aria-hidden="true"/></div>;
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  return (
    <motion.section className={styles.cover} exit={{ y: "-120%" }} transition={{ duration: 1.8, ease: coverEase }}>
      <Scene dense staged arch/>
      <motion.div className={styles.coverTitle} initial={{ opacity: 0, scale: 1.65, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ delay: 2.45, duration: 1.15, ease: revealEase }}><p>The Wedding of</p><h1>{bride} <span>&amp;</span> {groom}</h1></motion.div>
      <motion.div className={styles.guestBlock} initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: .85, ease: revealEase }}><p>Kepada Yth.<br/><strong>{guest}</strong></p><motion.button type="button" whileTap={{ scale: .96 }} onClick={onOpen}>Buka Undangan</motion.button></motion.div>
    </motion.section>
  );
}

function Hero({ invitation, active }: { invitation: InvitationData; active: boolean }) {
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  return (
    <section id="home" className={styles.hero}>
      <Scene dense staged active={active}/>
      <motion.div className={styles.heroTitle} initial={{ opacity: 0, y: -25 }} animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -25 }} transition={{ delay: .8, duration: .8, ease: revealEase }}><p>The Wedding of</p><h2>{bride} <span>&amp;</span> {groom}</h2></motion.div>
      <motion.div className={styles.heroPortrait} initial={{ opacity: 0, scale: 1.55, filter: "blur(12px)" }} animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 1.55, filter: "blur(12px)" }} transition={{ delay: 1.25, duration: 1.35, ease: revealEase }}><OvalPortrait src={invitation.coverImage} alt={`${bride} dan ${groom}`} priority/></motion.div>
    </section>
  );
}

function Quote({ invitation }: { invitation: InvitationData }) {
  const image = invitation.gallery[0] || invitation.coverImage;
  return (
    <section className={styles.quoteSection}>
      <SectionAccents variant="top"/>
      <motion.div className={styles.quotePhoto} initial={{ opacity: 0, scale: .82 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .9, ease: revealEase }}>{image && <Image src={image} alt="Momen pernikahan" fill sizes="(max-width: 600px) 88vw, 440px"/>}</motion.div>
      <motion.blockquote initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .8, ease: revealEase }}><p>“{invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."}”</p><cite>— {invitation.opening.quoteSource || "QS. Ar-Rum 21"} —</cite></motion.blockquote>
      <div className={styles.quoteArch} aria-hidden="true"/>
    </section>
  );
}

function Person({ person, role, index }: { person: InvitationData["bride"] | InvitationData["groom"]; role: "Putri" | "Putra"; index: number }) {
  return (
    <motion.article className={styles.person} initial={{ opacity: 0, y: 65, scale: .92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .12, duration: .9, ease: revealEase }}>
      <div className={styles.personPhotoFrame}><div className={styles.personPhoto}>{person.photo && <Image src={person.photo} alt={person.name} fill sizes="(max-width: 600px) 58vw, 290px"/>}</div><motion.i className={styles.personFloraLeft} animate={{ rotate: [-2, 1.5, -2] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}/><motion.i className={styles.personFloraRight} animate={{ rotate: [1.5, -2, 1.5] }} transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}/></div>
      <div className={styles.personCopy}><h3>{person.name}</h3><p>{role} Kedua dari {person.parents}</p>{person.instagram && <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">@{person.instagram.replace("@", "")}</a>}</div>
    </motion.article>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return <section id="couple" className={styles.couple}><SectionAccents/><motion.div className={styles.coupleOpening} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .8 }}><h2>Assalamu’alaikum Wr. Wb.</h2><p>Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan.</p></motion.div><Person person={invitation.bride} role="Putri" index={0}/><div className={styles.floralDivider} aria-hidden="true"/><Person person={invitation.groom} role="Putra" index={1}/></section>;
}

function Countdown({ date }: { date: string }) {
  const target = useMemo(() => new Date(date).getTime(), [date]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const distance = Math.max(0, target - now);
  const values = [[Math.floor(distance / 86400000), "Hari"], [Math.floor(distance / 3600000) % 24, "Jam"], [Math.floor(distance / 60000) % 60, "Menit"], [Math.floor(distance / 1000) % 60, "Detik"]] as const;
  return <section id="countdown" className={styles.countdown}><SectionAccents variant="top"/><div className={styles.countdownArch} aria-hidden="true"/><motion.div className={styles.countdownContent} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .8 }}><p>Kami akan menikah,<br/>dan kami ingin Anda menjadi bagian dari hari istimewa kami!</p><div className={styles.countdownGrid}>{values.map(([value, label]) => <span key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></span>)}</div><a href="#event">♡ Save The Date</a></motion.div></section>;
}

function Events({ invitation }: { invitation: InvitationData }) {
  return <section id="event" className={styles.events}>{invitation.events.map((event, index) => <motion.article key={`${event.name}-${event.date}`} initial={{ opacity: 0, y: 55 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .9, ease: revealEase }}><SectionAccents variant={index % 2 ? "bottom" : "sides"}/><div className={styles.eventContent}><h2>{event.name}</h2><p>{event.date}</p><strong>{event.time}</strong><span>♥</span><b>{event.location}</b>{invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer"><Icon name="pin"/> Lihat Maps</a>}</div></motion.article>)}</section>;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const fallback = invitation.gallery[0] || invitation.coverImage;
  return (
    <section id="gallery" className={styles.gallery}><SectionAccents variant="top"/><motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Our Gallery</motion.h2><motion.div className={styles.galleryVideo} initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .4 }}>{invitation.videoUrl ? <iframe src={invitation.videoUrl} title="Video pernikahan" allow="autoplay; fullscreen"/> : <>{fallback && <Image src={fallback} alt="Video pernikahan" fill sizes="(max-width: 600px) 88vw, 440px"/>}<i>▶</i></>}</motion.div><div className={styles.galleryGrid}>{invitation.gallery.slice(0, 6).map((photo, index) => <motion.button type="button" key={photo} onClick={() => setActive(index)} initial={{ opacity: 0, scale: .86 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .3 }} transition={{ delay: index * .06 }}><Image src={photo} alt={`Galeri ${index + 1}`} fill sizes="(max-width: 600px) 29vw, 145px"/></motion.button>)}</div><AnimatePresence>{active !== null && <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}><button type="button" aria-label="Tutup">×</button><div><Image src={invitation.gallery[active]} alt="Foto galeri" fill sizes="90vw"/></div></motion.div>}</AnimatePresence></section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  const image = invitation.gallery[1] || invitation.coverImage;
  return <section id="story" className={styles.story}><SectionAccents variant="bottom"/><div className={styles.storyPhoto}>{image && <Image src={image} alt="Love story" fill sizes="(max-width: 600px) 100vw, 500px"/>}</div><h2>Love Story</h2><div className={styles.storyTimeline}>{invitation.story.map((item, index) => <motion.article key={`${item.year}-${item.title}`} initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .45 }} transition={{ delay: index * .08, duration: .65 }}><i/><div><h3>{item.title}</h3><small>{item.year}</small><p>{item.description}</p></div></motion.article>)}</div></section>;
}

function RSVP({ invitation }: { invitation: InvitationData }) {
  const { submit, submitting, submitted, entries } = useRsvpWishes(invitation.id);
  const [name, setName] = useState(""); const [attendance, setAttendance] = useState<Attendance>("Hadir"); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function send(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); if (!name.trim() || !message.trim()) { setError("Nama dan ucapan wajib diisi."); return; } const result = await submit({ name, whatsapp: "", attendance, message }); if (result.error) { setError(result.error); return; } setName(""); setMessage(""); }
  return (
    <section id="rsvp" className={styles.rsvp}><SectionAccents variant="top"/><h2>Ucapan &amp; RSVP</h2><p>Berikan ucapan terbaik untuk Kedua Mempelai &amp; Konfirmasi Kehadiran</p>{submitted ? <div className={styles.thanks}>Terima kasih, konfirmasi Anda telah terkirim.</div> : <form onSubmit={send}><input aria-label="Nama" placeholder="Nama Kamu" value={name} onChange={event => setName(event.target.value)}/><textarea aria-label="Ucapan" placeholder="Berikan Ucapan & Do’a" value={message} onChange={event => setMessage(event.target.value)} rows={4}/><label>Konfirmasi Kehadiran :</label><div className={styles.attendance}>{(["Hadir", "Tidak Hadir"] as Attendance[]).map(option => <button type="button" key={option} className={attendance === option ? styles.attendanceActive : ""} onClick={() => setAttendance(option)}>♡ {option}</button>)}</div><button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Send"}</button>{error && <small>{error}</small>}</form>}{entries.length > 0 && <div className={styles.wishes}>{entries.slice(0, 2).map(entry => <article key={entry.id}><span>{entry.name.slice(0, 1).toUpperCase()}</span><div><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></div></article>)}</div>}</section>
  );
}

function Gifts({ invitation }: { invitation: InvitationData }) {
  const [show, setShow] = useState(false); const [copied, setCopied] = useState<number | null>(null);
  async function copy(account: GiftAccount, index: number) { if (!account.accountNumber) return; await navigator.clipboard.writeText(account.accountNumber); setCopied(index); window.setTimeout(() => setCopied(null), 1600); }
  return <section id="gift" className={styles.gifts}><SectionAccents/><h2>Wedding Gift</h2><p>Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p><button className={styles.giftToggle} type="button" onClick={() => setShow(value => !value)}><Icon name="gift"/> Amplop Digital</button><AnimatePresence>{show && <motion.div className={styles.giftAccounts} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{invitation.gifts.map((account, index) => <article key={`${account.owner}-${index}`}><small>{account.bankName}</small><strong>{account.accountNumber}</strong><span>{account.accountName}</span><button type="button" onClick={() => copy(account, index)}><Icon name="copy"/> {copied === index ? "Tersalin" : "Salin"}</button></article>)}</motion.div>}</AnimatePresence></section>;
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = invitation.bride.nickname || invitation.bride.name; const groom = invitation.groom.nickname || invitation.groom.name;
  return <footer className={styles.footer}><Scene dense/><motion.div className={styles.footerCopy} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }}><p>Atas kehadiran dan do’a restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.</p><h3>Wassalamu’alaikum Wr. Wb.</h3><small>Kami yang berbahagia</small><h2>{bride} <span>&amp;</span> {groom}</h2></motion.div><motion.div className={styles.footerPortrait} initial={{ opacity: 0, scale: .75 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .35 }} transition={{ duration: 1, ease: revealEase }}><OvalPortrait src={invitation.coverImage} alt={`${bride} dan ${groom}`}/></motion.div></footer>;
}

const nav: [string, IconName, string][] = [["home", "home", "Home"], ["couple", "couple", "Mempelai"], ["event", "calendar", "Acara"], ["gallery", "gallery", "Galeri"], ["story", "heart", "Cerita"], ["rsvp", "chat", "Ucapan"], ["gift", "gift", "Hadiah"]];
function FloatingNav() { return <nav className={styles.nav}>{nav.map(([id, icon, label]) => <button type="button" key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} aria-label={label}><Icon name={icon}/></button>)}</nav>; }
function FloatingActions({ isPlaying, toggle, onGift }: { isPlaying: boolean; toggle: () => void; onGift: () => void }) { return <div className={styles.floatingActions}><button type="button" onClick={onGift} aria-label="Buka hadiah"><Icon name="gift"/></button><button type="button" onClick={toggle} aria-label={isPlaying ? "Jeda musik" : "Putar musik"}><Icon name="music"/><i className={isPlaying ? styles.playing : ""}/></button></div>; }

export default function LuxuryArtGarden({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const date = invitation.events[0]?.rawDate;
  useEffect(() => { const previousOverflow = document.body.style.overflow; const previousTouch = document.body.style.touchAction; if (!opened) { document.body.style.overflow = "hidden"; document.body.style.touchAction = "none"; window.scrollTo(0, 0); } return () => { document.body.style.overflow = previousOverflow; document.body.style.touchAction = previousTouch; }; }, [opened]);
  async function openInvitation() { setOpened(true); if (invitation.musicUrl && !isPlaying) { try { await toggle(); } catch { /* music remains available from its control */ } } }
  return (
    <main className={styles.root}>
      <aside className={styles.desktopPhoto} aria-hidden="true">{invitation.coverImage && <Image src={invitation.coverImage} alt="" fill priority sizes="calc(100vw - 500px)"/>}</aside>
      <div className={styles.invitationShell}>
        <div className={styles.invitationContent} aria-hidden={!opened}><Hero invitation={invitation} active={opened}/><Quote invitation={invitation}/><Couple invitation={invitation}/>{date && <Countdown date={date}/>}<Events invitation={invitation}/>{invitation.gallery.length > 0 && <Gallery invitation={invitation}/>} {invitation.story.length > 0 && <Story invitation={invitation}/>}<RSVP invitation={invitation}/>{invitation.gifts.length > 0 && <Gifts invitation={invitation}/>}<Footer invitation={invitation}/></div>
        {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop/>}
        <AnimatePresence>{!opened && <Cover key="cover" invitation={invitation} onOpen={openInvitation}/>}</AnimatePresence>
        <AnimatePresence>{opened && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25, duration: .55 }}><FloatingActions isPlaying={isPlaying} toggle={() => void toggle()} onGift={() => document.getElementById("gift")?.scrollIntoView({ behavior: "smooth" })}/><FloatingNav/></motion.div>}</AnimatePresence>
      </div>
    </main>
  );
}
