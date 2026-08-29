"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const asset = (name: string) => `/themes/luxury-art-white-garden/${name}`;
const ease = [0.22, 1, 0.36, 1] as const;
type IconName = "mail" | "calendar" | "pin" | "gift" | "copy" | "heart" | "play" | "instagram";
function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>}
    {name === "calendar" && <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></>}
    {name === "pin" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>}
    {name === "gift" && <><path d="M3 8h18v4H3zm2 4v9h14v-9M12 8v13"/><path d="M12 8C2 8 6 0 10 4l2 4c10 0 6-8 2-4Z"/></>}
    {name === "copy" && <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/></>}
    {name === "heart" && <path fill="currentColor" stroke="none" d="M12 21 3 12C-3 5 7-2 12 5c5-7 15 0 9 7Z"/>}
    {name === "play" && <path d="m8 4 12 8-12 8Z"/>}
    {name === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/></>}
  </svg>;
}

function Artwork({ cover = false }: { cover?: boolean }) {
  const layers = [
    [cover ? "11a" : "11", "canopyLeft"], [cover ? "12a" : "12", "canopyRight"],
    ["16", "treeLeft"], ["15", "treeRight"], ["13", "oakLeft"], ["14", "oakRight"],
    ["18", "flowerLeft"], ["17", "flowerRight"], ["25", "leafLeft"], ["24", "leafRight"],
    ["22", "stemLeft"], ["23", "stemRight"], ["19", "bedLeft"], ["20", "bedRight"], ["21", "bedCenter"],
  ];
  return <div className={styles.artwork} aria-hidden="true">
    {layers.map(([file, cls]) => <Image key={cls} src={asset(`nadiah-yusuf-${file}.png`)} alt="" width={590} height={970} sizes="250px" className={styles[cls]} unoptimized />)}
    <Image src={asset("azurah-adika-12.png")} alt="" width={521} height={427} unoptimized className={styles.butterflyLeft}/>
    <Image src={asset("azurah-adika-12.png")} alt="" width={521} height={427} unoptimized className={styles.butterflyRight}/>
  </div>;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1, ease }}>{children}</motion.div>;
}
function Scene({ children, id, variant = "arch", className = "" }: { children: ReactNode; id?: string; variant?: "arch" | "columns" | "hall"; className?: string }) {
  return <section id={id} className={`${styles.scene} ${styles[variant]} ${className}`}><Artwork cover={variant === "columns"}/><div className={styles.sceneBody}>{children}</div></section>;
}
function Portrait({ src, alt, wide = false, priority = false }: { src: string | null; alt: string; wide?: boolean; priority?: boolean }) {
  return <div className={`${styles.portrait} ${wide ? styles.widePortrait : ""}`}>{src ? <Image unoptimized src={src} alt={alt} fill sizes="(max-width:500px) 70vw, 360px" priority={priority} className={styles.portraitImage}/> : <span className={styles.emptyPhoto}>Foto Mempelai</span>}</div>;
}
function safeUrl(raw: string | null | undefined) {
  if (!raw) return null;
  try { const url = new URL(raw); return ["https:", "http:"].includes(url.protocol) ? url.toString() : null; } catch { return null; }
}
function instagramUrl(raw: string | null) {
  if (!raw) return null;
  return safeUrl(raw) || `https://www.instagram.com/${encodeURIComponent(raw.replace(/^@/, ""))}/`;
}
function Countdown({ date }: { date: string | null | undefined }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const target = date ? new Date(date).getTime() : NaN;
    const update = () => setSeconds(Number.isFinite(target) ? Math.max(0, Math.floor((target - Date.now()) / 1000)) : 0);
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, [date]);
  const numbers = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <div className={styles.countdown} aria-label="Hitung mundur acara">{numbers.map((number, i) => <div key={i}><strong>{number.toString().padStart(2, "0")}</strong><span>{["Hari", "Jam", "Menit", "Detik"][i]}</span></div>)}</div>;
}
function calendarUrl(invitation: InvitationData) {
  const event = invitation.events[0];
  if (!event?.rawDate) return null;
  const date = new Date(event.rawDate);
  if (!Number.isFinite(date.getTime())) return null;
  // All-day entry: the editable date may not carry a trustworthy timezone/time.
  const start = event.rawDate.slice(0, 10).replaceAll("-", "");
  const end = new Date(`${event.rawDate.slice(0, 10)}T00:00:00Z`); end.setUTCDate(end.getUTCDate() + 1);
  return `https://www.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `Pernikahan ${invitation.bride.name} & ${invitation.groom.name}`, dates: `${start}/${end.toISOString().slice(0, 10).replaceAll("-", "")}`, details: event.time, location: event.location })}`;
}

function Gallery({ photos }: { photos: string[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (selected !== null) dialog.current?.showModal(); else dialog.current?.close(); }, [selected]);
  return <><div className={styles.gallery}>{photos.map((src, i) => <button type="button" key={`${src}-${i}`} onClick={() => setSelected(i)} aria-label={`Perbesar foto ${i + 1}`}><Image unoptimized src={src} alt={`Galeri pernikahan ${i + 1}`} width={500} height={750} sizes="(max-width:500px) 40vw, 210px"/></button>)}</div>
    <dialog ref={dialog} className={styles.lightbox} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} onKeyDown={e => { if (selected === null) return; if (e.key === "ArrowRight") setSelected((selected + 1) % photos.length); if (e.key === "ArrowLeft") setSelected((selected - 1 + photos.length) % photos.length); }} aria-label="Galeri foto diperbesar">
      <button autoFocus type="button" onClick={() => setSelected(null)} className={styles.close} aria-label="Tutup galeri">×</button>
      {selected !== null && <Image unoptimized src={photos[selected]} alt={`Foto ${selected + 1}`} width={1200} height={1800} sizes="90vw"/>}
      <div className={styles.lightboxControls}><button type="button" onClick={() => setSelected(i => ((i ?? 0) - 1 + photos.length) % photos.length)}>Sebelumnya</button><span>{(selected ?? 0) + 1} / {photos.length}</span><button type="button" onClick={() => setSelected(i => ((i ?? 0) + 1) % photos.length)}>Berikutnya</button></div>
    </dialog></>;
}

function Gifts({ invitation }: { invitation: InvitationData }) {
  const [panel, setPanel] = useState<"bank" | "delivery" | null>(null);
  const [notice, setNotice] = useState("");
  const contact = instagramUrl(invitation.bride.instagram) || instagramUrl(invitation.groom.instagram);
  async function copy(text: string) { try { await navigator.clipboard.writeText(text); setNotice("Nomor rekening berhasil disalin."); } catch { setNotice("Tidak dapat menyalin otomatis. Silakan salin nomor yang ditampilkan."); } }
  return <Scene id="hadiah" className={styles.giftScene}><Reveal className={styles.paper}><h2>Wedding Gift</h2><p>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
    <button type="button" className={styles.button} aria-expanded={panel === "bank"} onClick={() => setPanel(panel === "bank" ? null : "bank")}><Icon name="mail"/>Amplop Online</button>
    {panel === "bank" && <div className={styles.bankList}>{invitation.gifts.length ? invitation.gifts.map((gift, i) => <article key={i}><strong>{gift.bankName}</strong><b>{gift.accountNumber || "Nomor rekening belum diisi"}</b><p>A/n {gift.accountName || gift.owner}</p>{gift.accountNumber && <button type="button" className={styles.button} onClick={() => void copy(gift.accountNumber!)}><Icon name="copy"/>Salin No. Rekening</button>}</article>) : <p>Informasi rekening belum tersedia. Silakan hubungi mempelai.</p>}</div>}
    <button type="button" className={styles.button} aria-expanded={panel === "delivery"} onClick={() => setPanel(panel === "delivery" ? null : "delivery")}><Icon name="gift"/>Kirim Kado</button>
    {panel === "delivery" && <div className={styles.delivery}><p>Silakan konfirmasi alamat pengiriman kado kepada mempelai sebelum mengirim.</p>{contact && <a className={styles.button} href={contact} target="_blank" rel="noreferrer">Hubungi Mempelai</a>}</div>}
    {contact && <a className={styles.button} href={contact} target="_blank" rel="noreferrer"><Icon name="instagram"/>Konfirmasi Mempelai</a>}
    <p role="status" className={styles.notice}>{notice}</p>
  </Reveal></Scene>;
}

function Wishes({ invitation }: { invitation: InvitationData }) {
  const { entries, counts, totalCount, hasMore, loadMore, submit, submitting } = useRsvpWishes(invitation.id || null);
  const [notice, setNotice] = useState("");
  const [demoEntries, setDemoEntries] = useState<{ name: string; message: string; attendance: Attendance }[]>([]);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const input = { name: String(data.get("name") || "").trim(), message: String(data.get("message") || "").trim(), attendance: String(data.get("attendance")) as Attendance, whatsapp: "" };
    if (!input.name || !input.message) { setNotice("Nama dan ucapan wajib diisi."); return; }
    if (!invitation.id) { setDemoEntries(old => [input, ...old]); setNotice("Ucapan contoh ditampilkan di perangkat ini saja."); form.reset(); return; }
    const result = await submit(input); setNotice(result.error || "Terima kasih atas ucapan Anda."); if (!result.error) form.reset();
  }
  const shown = invitation.id ? entries : demoEntries;
  const values = invitation.id ? [counts.hadir, counts.tidakHadir, counts.raguRagu] : ["Hadir", "Tidak Hadir", "Masih Ragu"].map(value => demoEntries.filter(e => e.attendance === value).length);
  return <Scene id="ucapan" className={styles.wishesScene}><Reveal><h2>Ucapan &amp; Do’a</h2><p>Berikan ucapan harapan dan<br/>do’a kepada kedua mempelai</p><div className={styles.wishesBox}><strong>{invitation.id ? totalCount : demoEntries.length} Ucapan</strong><div className={styles.attendance}>{values.map((n, i) => <div key={i}><b>{n}</b><span>{["Hadir", "Tidak Hadir", "Masih Ragu"][i]}</span></div>)}</div>
    <form onSubmit={onSubmit}><label>Nama<input name="name" required maxLength={100} autoComplete="name"/></label><label>Kehadiran<select name="attendance" defaultValue="Hadir"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label><label>Ucapan &amp; Doa<textarea name="message" required maxLength={1000} rows={3}/></label><button className={styles.button} disabled={submitting}>{submitting ? "Mengirim…" : "Kirim Ucapan"}</button></form><p role="status">{notice}</p><div className={styles.entries}>{shown.map((entry, i) => <article key={i}><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></article>)}</div>{hasMore && <button type="button" className={styles.button} onClick={loadMore}>Lihat Ucapan Lainnya</button>}</div></Reveal></Scene>;
}

export default function WhiteGarden({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const guest = useSearchParams().get("to") || "Nama Tamu";
  const reduced = useReducedMotion();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const [musicError, setMusicError] = useState("");
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  const names = `${bride} & ${groom}`;
  const calendar = calendarUrl(invitation);
  const stream = safeUrl(invitation.videoUrl);
  useEffect(() => { const previous = document.body.style.overflow; if (!opened) document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [opened]);
  async function playMusic() { try { await toggle(); setMusicError(""); } catch { setMusicError("Musik belum dapat diputar. Ketuk tombol musik untuk mencoba lagi."); } }
  function open() { window.scrollTo(0, 0); setOpened(true); if (invitation.musicUrl && !isPlaying) void playMusic(); }
  return <main className={styles.root} data-art14-theme>
    <AnimatePresence>{!opened && <motion.div key="opening" className={styles.opening} exit={{ y: "-105%", opacity: 0 }} transition={{ duration: reduced ? 0 : 1.5, ease }}><Scene variant="columns" className={styles.openingScene}><div className={styles.openingPaper}><p className={styles.eyebrow}>The Wedding Of</p><h1>{names}</h1><p className={styles.date}>{invitation.events[0]?.date}</p><Portrait src={invitation.coverImage} alt={names} priority/><p className={styles.recipient}>Kepada :</p><p className={styles.guest}>{guest}</p><button type="button" className={styles.button} onClick={open}><Icon name="mail"/>Buka Undangan</button></div></Scene></motion.div>}</AnimatePresence>
    {opened && <div className={styles.content}>
      <Scene id="home" className={styles.hero}><Reveal><Portrait src={invitation.heroImage || invitation.gallery[0] || invitation.coverImage} alt={names} wide priority/><h2>Save The Date</h2><Countdown date={invitation.events[0]?.rawDate}/>{calendar && <a className={styles.button} href={calendar} target="_blank" rel="noreferrer"><Icon name="calendar"/>Simpan Tanggal</a>}</Reveal></Scene>
      <Scene className={styles.quoteScene}><Reveal className={styles.quotePaper}><h3>{invitation.bride.name}<br/>&amp;<br/>{invitation.groom.name}</h3><p>{invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."}</p><p>{invitation.opening.quoteSource || "Surah Ar - Rum 21"}</p></Reveal></Scene>
      <Scene id="mempelai" variant="columns" className={styles.coupleScene}><Reveal className={styles.couplePaper}><Image src={asset("bismillah-png-1-1-1-2.png")} alt="Bismillahirrahmanirrahim" width={1024} height={230} className={styles.bismillah}/><p>{invitation.opening.description || "Dengan memohon rahmat & ridho Allah SWT, kami bermaksud untuk mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami"}</p>{[invitation.bride, invitation.groom].map((person, i) => { const instagram = instagramUrl(person.instagram); return <div key={i} className={styles.person}>{i === 1 && <em className={styles.between}>dengan</em>}<Portrait src={person.photo} alt={person.name}/><h3>{person.name}</h3><p>{i === 0 ? "Putri dari" : "Putra dari"}<br/>{person.parents}</p>{instagram && <a className={styles.button} href={instagram} target="_blank" rel="noreferrer"><Icon name="instagram"/>{person.instagram?.startsWith("http") ? "Instagram" : `@${person.instagram?.replace(/^@/, "")}`}</a>}</div>; })}</Reveal></Scene>
      <Scene id="acara" className={styles.eventsScene}><Reveal className={styles.paper}>{invitation.events.map((event, i) => <article className={styles.event} key={i}><h2>{event.name}</h2><h4>{event.date}</h4><p>{event.time}</p><p>{event.location}</p>{safeUrl(invitation.mapsUrl) && <a className={styles.button} href={safeUrl(invitation.mapsUrl)!} target="_blank" rel="noreferrer"><Icon name="pin"/>Google Maps</a>}</article>)}</Reveal></Scene>
      {invitation.gallery.length > 0 && <Scene id="galeri" className={styles.galleryScene}><Reveal><h2>Galeri Foto</h2><Gallery photos={invitation.gallery}/></Reveal></Scene>}
      {invitation.story.length > 0 && <Scene id="cerita" variant="hall" className={styles.storyScene}><Reveal className={styles.paper}><h2>Love Story</h2><div className={styles.timeline}>{invitation.story.map((story, i) => <article key={i}><i><Icon name="heart"/></i><small>{story.year}</small><h3>{story.title}</h3><p>{story.description}</p></article>)}</div></Reveal></Scene>}
      <Gifts invitation={invitation}/>
      <Scene id="streaming" variant="hall" className={styles.streaming}><Reveal className={styles.paper}><h2>Live Streaming</h2><p>Temui kami secara virtual untuk menyaksikan acara pernikahan kami.</p>{stream ? <a className={styles.button} href={stream} target="_blank" rel="noreferrer"><Icon name="play"/>Live Streaming</a> : <p className={styles.streamNotice}>Tautan siaran belum tersedia.</p>}</Reveal></Scene>
      <Wishes invitation={invitation}/>
      <Scene variant="columns" className={styles.closing}><Reveal><Portrait src={invitation.closingImage || invitation.gallery.at(-1) || invitation.coverImage} alt={names}/><p>Atas kehadiran dan doa restunya,<br/>kami mengucapkan Terima Kasih.</p><h3>{names}</h3></Reveal></Scene>
      <footer className={styles.brand}>Powered by{invitation.brand?.logoUrl && <Image unoptimized src={invitation.brand.logoUrl} alt={invitation.brand.name} width={100} height={60} style={{objectFit:"contain"}}/>}<strong>{invitation.brand?.name || "Vistiq Invitation"}</strong></footer>
    </div>}
    {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop preload="none"/>}
    {opened && invitation.musicUrl && <button type="button" className={`${styles.music} ${isPlaying ? styles.spinning : ""}`} onClick={() => void playMusic()} aria-label={isPlaying ? "Jeda musik" : "Putar musik"} aria-pressed={isPlaying}><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="currentColor" stroke="white" strokeWidth="3"/><circle cx="20" cy="20" r="5" fill="white"/><circle cx="20" cy="20" r="2" fill="currentColor"/><path d="M20 9a11 11 0 0 1 11 11" fill="none" stroke="white" strokeWidth="2"/></svg></button>}
    {musicError && <p className={styles.musicError} role="status">{musicError}</p>}
  </main>;
}
