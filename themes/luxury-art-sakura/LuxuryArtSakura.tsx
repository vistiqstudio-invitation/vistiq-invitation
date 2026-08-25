"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.18 },
  transition: { duration: 1.15, ease },
};
const navItems = [
  ["home", "⌂"], ["couple", "♙"], ["event", "▦"], ["gallery", "▣"],
  ["story", "♡"], ["rsvp", "◉"], ["gift", "♧"],
] as const;

function ArchPhoto({ src, alt, className = "", priority = false }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  return <div className={`${styles.archPortrait} ${className}`}>
    <i>{src && <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 500px) 62vw, 260px" />}</i>
  </div>;
}

function Branch({ className = "" }: { className?: string }) {
  return <span className={`${styles.branch} ${className}`} aria-hidden="true"><i /></span>;
}

function Petals() {
  const petals = useMemo(() => Array.from({ length: 26 }, (_, index) => ({
    left: `${(index * 37 + 9) % 100}%`, delay: `${-((index * 1.17) % 11)}s`,
    duration: `${8 + (index % 7) * .65}s`, size: `${5 + index % 6}px`,
    drift: `${-30 + (index * 17) % 64}px`,
  })), []);
  return <div className={styles.petals} aria-hidden="true">{petals.map((petal, index) => <i key={index} style={{
    "--left": petal.left, "--delay": petal.delay, "--duration": petal.duration,
    "--size": petal.size, "--drift": petal.drift,
  } as CSSProperties} />)}</div>;
}

function Cover({ invitation, opening, onOpen }: { invitation: InvitationData; opening: boolean; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bpk/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0];
  const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  return <motion.section className={styles.cover} exit={{ opacity: 0 }} transition={{ duration: .55 }}>
    <div className={styles.coverPhoto}>{invitation.coverImage && <Image src={invitation.coverImage} alt="" fill priority sizes="500px" />}</div>
    <div className={styles.coverArt} />
    <Branch className={styles.coverBranch} />
    <motion.div className={styles.coverCard} initial={{ opacity: 0, y: 28, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.25, ease }}>
      <small>The Wedding of</small>
      <ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`} priority />
      <h1>{bride} &amp; {groom}</h1>
      <p>Kepada Yth.<strong>{guest}</strong><span>di Tempat</span></p>
      <button type="button" onClick={onOpen}>▣&nbsp; Buka Undangan</button>
    </motion.div>
    <AnimatePresence>{opening && <motion.div className={styles.bloom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {Array.from({ length: 6 }, (_, index) => <motion.span key={index} initial={{ x: 0, y: 0, rotate: index * 58, scale: .6, opacity: .15 }} animate={{ x: Math.cos(index) * 360, y: Math.sin(index) * 420, rotate: index * 110, scale: 1.8, opacity: 1 }} transition={{ duration: 1.15, ease }}><Branch /></motion.span>)}
    </motion.div>}</AnimatePresence>
  </motion.section>;
}

function Hero({ invitation, active }: { invitation: InvitationData; active: boolean }) {
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0];
  const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  return <section id="home" className={styles.hero}>
    <div className={styles.paperLandscape} /><Branch className={styles.heroBranchLeft} /><Branch className={styles.heroBranchRight} />
    <motion.div className={styles.heroArch} initial={{ opacity: 0, y: 34 }} animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }} transition={{ duration: 1.25, delay: .45, ease }}>
      <small>The Wedding of</small><ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`} />
      <h1>{bride} &amp; {groom}</h1><p>{invitation.events[0]?.date}</p>
    </motion.div>
  </section>;
}

function Opening({ invitation }: { invitation: InvitationData }) {
  return <section className={styles.opening}>
    <div className={styles.quotePanel}><Branch className={styles.quoteBranch} /><motion.blockquote {...reveal}>
      <p>“{invitation.opening.quote || "Dan diantara tanda-tanda kekuasaan-Nya ialah diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati."}”</p>
      <strong>({invitation.opening.quoteSource || "QS. Ar-Rum: 21"})</strong>
    </motion.blockquote></div>
    <div className={styles.greetingPanel}><motion.div {...reveal}><h2>{invitation.opening.greeting || "Assalamu’alaikum Wr. Wb."}</h2><p>{invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan."}</p></motion.div></div>
  </section>;
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const people = [{ data: invitation.bride, role: "Putri" }, { data: invitation.groom, role: "Putra" }];
  return <section id="couple" className={styles.couple}><div className={styles.coupleLandscape} /><Branch className={styles.coupleBranch} />
    {people.map(({ data, role }, index) => <motion.article key={role} {...reveal}>
      <ArchPhoto src={data.photo} alt={data.name} /><h3>{data.name}</h3><p>{role} pertama dari {data.parents}</p>
      {data.instagram && <a href={`https://instagram.com/${data.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" aria-label={`Instagram ${data.name}`}>◎</a>}
      {index === 0 && <b>&amp;</b>}
    </motion.article>)}
  </section>;
}

function Countdown({ date, label }: { date: string; label: string }) {
  const target = useMemo(() => new Date(date).getTime(), [date]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const tick = () => setNow(Date.now()); tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer); }, []);
  const distance = now === null ? null : Math.max(0, target - now);
  const values = distance === null ? ["--", "--", "--", "--"] : [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60].map(value => String(value).padStart(2, "0"));
  return <section className={styles.countdown}><Branch className={styles.countdownBranch} /><motion.div className={styles.countdownCard} {...reveal}>
    <span>▦</span><p>Kami akan menikah,<br />dan kami ingin Anda menjadi bagian<br />dari hari istimewa kami!</p>
    <div>{values.map((value, index) => <b key={index}>{value}<small>{["Hari", "Jam", "Menit", "Detik"][index]}</small></b>)}</div>
    <em>{label}</em><a href="#event">▣ Save The Date</a>
  </motion.div></section>;
}

function Events({ invitation }: { invitation: InvitationData }) {
  return <section id="event" className={styles.events}>{invitation.events.map((event, index) => <motion.article key={`${event.name}-${index}`} {...reveal}>
    <div className={styles.eventLandscape} /><Branch className={styles.eventBranch} />
    <div className={styles.eventCopy}><span>♧</span><small>{index === 0 ? "Our Sacred Moment" : "Celebrate With Us"}</small><h2>{event.name}</h2><h3>{event.date}</h3><p>{event.time}</p><i>◇</i><strong>{event.location}</strong>{invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">⌕ Lihat Maps</a>}</div>
  </motion.article>)}</section>;
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const items = invitation.gallery.slice(0, 6);
  return <section id="gallery" className={styles.gallery}><Branch className={styles.galleryBranch} /><motion.header {...reveal}><i>Our</i><h2>Gallery</h2><p>Every picture holds a little piece of our forever.</p></motion.header>
    <div className={styles.galleryGrid}>{items.map((src, index) => <motion.button key={src} type="button" onClick={() => setActive(index)} {...reveal}><Image src={src} alt={`Galeri pernikahan ${index + 1}`} fill sizes="220px" /></motion.button>)}</div>
    <AnimatePresence>{active !== null && <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}><button type="button">×</button><Image src={items[active]} alt="Foto galeri" fill sizes="92vw" /></motion.div>}</AnimatePresence>
  </section>;
}

function Story({ invitation }: { invitation: InvitationData }) {
  const image = invitation.gallery[5] || invitation.gallery[1] || invitation.coverImage;
  return <section id="story" className={styles.story}><div className={styles.storyLandscape} /><Branch className={styles.storyBranch} /><ArchPhoto src={image} alt="Love story" className={styles.storyPortrait} /><h2>Love Story</h2>
    <div className={styles.timeline}>{invitation.story.map((item, index) => <motion.article key={`${item.year}-${item.title}`} {...reveal}><i>{index + 1}</i><time>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p></motion.article>)}</div>
  </section>;
}

function RSVP({ invitation }: { invitation: InvitationData }) {
  const { submit, submitting, submitted, entries } = useRsvpWishes(invitation.id);
  const [name, setName] = useState(""); const [message, setMessage] = useState(""); const [attendance, setAttendance] = useState<Attendance>("Hadir");
  async function send(event: React.FormEvent) { event.preventDefault(); if (!name.trim() || !message.trim()) return; const result = await submit({ name, whatsapp: "", attendance, message }); if (!result.error) { setName(""); setMessage(""); } }
  return <section id="rsvp" className={styles.rsvp}><Branch className={styles.rsvpBranch} /><motion.header {...reveal}><i>Tinggalkan</i><h2>Do’a &amp; Ucapan</h2><p>Berikan ucapan terbaik untuk kedua mempelai dan konfirmasi kehadiran.</p></motion.header>
    {submitted ? <b className={styles.thanks}>Terima kasih, konfirmasi Anda telah terkirim.</b> : <form onSubmit={send}><input aria-label="Nama" placeholder="Nama Kamu" value={name} onChange={event => setName(event.target.value)} /><textarea aria-label="Ucapan" placeholder="Berikan Ucapan & Do’a" value={message} onChange={event => setMessage(event.target.value)} /><small>Konfirmasi Kehadiran</small><div>{(["Hadir", "Tidak Hadir"] as Attendance[]).map(value => <button type="button" key={value} className={value === attendance ? styles.selected : ""} onClick={() => setAttendance(value)}>♡ {value}</button>)}</div><button disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Ucapan"}</button></form>}
    <div className={styles.wishes}>{entries.slice(0, 3).map(entry => <article key={entry.id}><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></article>)}</div>
  </section>;
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const [open, setOpen] = useState(false); const [copied, setCopied] = useState<number | null>(null);
  async function copy(account: GiftAccount, index: number) { if (!account.accountNumber) return; await navigator.clipboard.writeText(account.accountNumber); setCopied(index); window.setTimeout(() => setCopied(null), 1400); }
  return <section id="gift" className={styles.gift}><Branch className={styles.giftBranch} /><motion.div className={styles.giftCard} {...reveal}><b>Wedding Gift</b><div><p>Mungkin karena jarak, waktu ataupun keadaan yang menghalangi untuk ikut hadir dalam momen bahagia kami. Silakan mengirimkan kado atau hadiah melalui amplop digital.</p><button type="button" onClick={() => setOpen(value => !value)}>▦ Amplop Digital</button></div></motion.div>
    <AnimatePresence>{open && <motion.div className={styles.accounts} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{invitation.gifts.map((account, index) => <article key={index}><small>{account.bankName}</small><strong>{account.accountNumber}</strong><span>{account.accountName}</span><button type="button" onClick={() => copy(account, index)}>{copied === index ? "Tersalin" : "Salin"}</button></article>)}</motion.div>}</AnimatePresence>
  </section>;
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0]; const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  return <footer className={styles.footer}><div className={styles.footerLandscape} /><Branch className={styles.footerBranch} /><ArchPhoto src={invitation.coverImage} alt={`${bride} dan ${groom}`} /><p>Atas kehadiran dan do’a restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p><h3>Wassalamu’alaikum Wr. Wb.</h3><small>Kami yang berbahagia</small><h2>{bride} &amp; {groom}</h2></footer>;
}

function Navigation() {
  return <nav className={styles.nav}>{navItems.map(([id, icon]) => <button key={id} type="button" aria-label={`Ke bagian ${id}`} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>{icon}</button>)}</nav>;
}

export default function LuxuryArtSakura({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation(); const [opening, setOpening] = useState(false);
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const date = invitation.events[0]?.rawDate;
  useEffect(() => { document.body.style.overflow = opened ? "" : "hidden"; return () => { document.body.style.overflow = ""; }; }, [opened]);
  async function openInvitation() { if (opening) return; setOpening(true); if (invitation.musicUrl && !isPlaying) await toggle().catch(() => undefined); window.setTimeout(() => setOpened(true), 1050); }
  return <main className={styles.root}><aside className={styles.desktopScene}>{invitation.coverImage && <Image src={invitation.coverImage} alt="" fill priority sizes="calc(100vw - 450px)" />}<div><small>Luxury Art</small><h2>Sakura Romance</h2><p>A refined Japanese watercolor wedding experience.</p></div></aside>
    <div className={styles.shell}><Hero invitation={invitation} active={opened} /><Opening invitation={invitation} /><Couple invitation={invitation} />{date && <Countdown date={date} label={invitation.events[0]?.date || ""} />}<Events invitation={invitation} />{invitation.gallery.length > 0 && <Gallery invitation={invitation} />}<Story invitation={invitation} /><RSVP invitation={invitation} /><Gift invitation={invitation} /><Footer invitation={invitation} />
      <Petals />{invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}<AnimatePresence>{!opened && <Cover invitation={invitation} opening={opening} onOpen={openInvitation} />}</AnimatePresence>{opened && <><button className={styles.music} type="button" onClick={() => void toggle()} aria-label="Putar atau jeda musik">{isPlaying ? "♫" : "♪"}</button><Navigation /></>}</div>
  </main>;
}
