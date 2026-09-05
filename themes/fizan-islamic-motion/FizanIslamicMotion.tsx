"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode, type TouchEvent, type WheelEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ASSET_ROOT = "/themes/fizan-islamic-motion";
const POSTER = ASSET_ROOT + "/poster.jpg";
const COVER_PHOTO = ASSET_ROOT + "/gallery-1.jpg";
const VIDEO_PARTS = Array.from({ length: 33 }, (_, index) =>
  `${ASSET_ROOT}/opening-fizan-parts/part-${String(index).padStart(2, "0")}`,
);
const FALLBACK_GALLERY = [
  ASSET_ROOT + "/gallery-1.jpg",
  ASSET_ROOT + "/gallery-2.jpg",
  ASSET_ROOT + "/gallery-3.jpg",
  ASSET_ROOT + "/gallery-4.jpg",
];

const ease = [0.22, 1, 0.36, 1] as const;

function firstName(person: InvitationData["bride"] | InvitationData["groom"]) {
  return person.nickname || person.name.trim().split(/\s+/)[0] || person.name;
}

function fullName(person: InvitationData["bride"] | InvitationData["groom"]) {
  return person.name.trim() || firstName(person);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function imageStyle(url?: string | null) {
  return url ? { backgroundImage: `url("${url}")` } : undefined;
}

function dateValue(event?: InvitationData["events"][number]) {
  if (!event) return null;
  const value = event.rawDate || event.date;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(event?: InvitationData["events"][number]) {
  const parsed = dateValue(event);
  if (!parsed) return event?.date || "Dengan penuh syukur";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function splitLocation(location: string) {
  const [venue, ...address] = location.split(",");
  return { venue: venue?.trim() || "Lokasi acara", address: address.join(",").trim() };
}

function mapsLink(invitation: InvitationData, location: string) {
  return invitation.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

type IconName = "calendar" | "copy" | "gift" | "heart" | "mail" | "music" | "pin" | "play" | "close";

function Icon({ name }: { name: IconName }) {
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "calendar" && <><rect {...line} x="3.5" y="5" width="17" height="15" rx="2" /><path {...line} d="M7 3v4M17 3v4M3.5 9.5h17M8 13h3v3H8z" /></>}
      {name === "copy" && <><rect {...line} x="8" y="8" width="11" height="12" rx="2" /><path {...line} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /></>}
      {name === "gift" && <><rect {...line} x="3.5" y="9" width="17" height="11" rx="1.5" /><path {...line} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z" /></>}
      {name === "heart" && <path {...line} d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z" />}
      {name === "mail" && <><rect {...line} x="3" y="5.5" width="18" height="13" rx="2.2" /><path {...line} d="m4.5 7 7.5 6 7.5-6" /></>}
      {name === "music" && <><path {...line} d="M9 18V5l10-2v13" /><circle {...line} cx="6" cy="18" r="3" /><circle {...line} cx="16" cy="16" r="3" /></>}
      {name === "pin" && <><path {...line} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z" /><circle {...line} cx="12" cy="10" r="2" /></>}
      {name === "play" && <path fill="currentColor" d="m8 5 11 7-11 7V5Z" />}
      {name === "close" && <path {...line} d="m6 6 12 12M18 6 6 18" />}
    </svg>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.72, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className={styles.sectionTitle}>
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      <i aria-hidden="true"><Icon name="heart" /></i>
    </div>
  );
}

function useChunkedOpeningVideo() {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let objectUrl: string | null = null;

    Promise.all(
      VIDEO_PARTS.map((path) =>
        fetch(path).then((response) => {
          if (!response.ok) throw new Error("video-part");
          return response.arrayBuffer();
        }),
      ),
    )
      .then((parts) => {
        if (!alive) return;
        objectUrl = URL.createObjectURL(new Blob(parts, { type: "video/mp4" }));
        setSource(objectUrl);
      })
      .catch(() => {
        if (alive) setSource(null);
      });

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return source;
}

function Cover({ invitation, onOpen, onBegin }: { invitation: InvitationData; onOpen: () => void; onBegin: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const videoSource = useChunkedOpeningVideo();
  const event = invitation.events[0];
  const coverPhoto = invitation.coverImage || COVER_PHOTO;

  useEffect(() => {
    if (!started || !videoSource) return;
    void videoRef.current?.play().catch(() => undefined);
  }, [started, videoSource]);

  function beginOpening() {
    setStarted(true);
    onBegin();
    window.setTimeout(() => void videoRef.current?.play().catch(() => undefined), 0);
  }

  function handleWheel(event: WheelEvent<HTMLElement>) {
    if (showDetails && event.deltaY > 8) onOpen();
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const startY = touchStartY.current;
    const endY = event.changedTouches[0]?.clientY ?? null;
    touchStartY.current = null;
    if (showDetails && startY !== null && endY !== null && startY - endY > 18) onOpen();
  }

  return (
    <motion.section
      className={`${styles.cover} ${started ? styles.coverStarted : ""}`}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1.15, ease }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <video ref={videoRef} className={styles.coverVideo} autoPlay={started} muted playsInline poster={coverPhoto} aria-hidden="true" src={videoSource ?? undefined} onEnded={() => setShowDetails(true)} />
      <div className={styles.coverShade} aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!started && (
          <motion.div key="cover-invite" className={styles.coverInvite} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .55 }}>
            <div className={styles.coverHeader}>
              <p>Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami :</p>
              <h1>{firstName(invitation.bride)} <span>&amp;</span> {firstName(invitation.groom)}</h1>
            </div>
            <div className={styles.coverGuest}>
              <p>Kepada Bapak/Ibu/Saudara/i</p>
              <strong>{guest}</strong>
              <p>Di Tempat</p>
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={beginOpening}>
                <Icon name="mail" /> Buka Undangan
              </motion.button>
            </div>
          </motion.div>
        )}
        {showDetails && (
          <motion.div key="opening-details" className={styles.openingDetails} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease }}>
            <p className={styles.openingKicker}>The Wedding Of</p>
            <h1>{firstName(invitation.bride)} <span>&amp;</span> {firstName(invitation.groom)}</h1>
            <p className={styles.openingDate}>{event ? formatDate(event) : "Tanggal acara"}</p>
            <motion.button type="button" className={styles.scrollCue} onClick={onOpen} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} aria-label="Scroll ke bawah untuk membuka undangan">
              <span className={styles.mouseIcon}><i /></span>
              <span>Scroll ke bawah</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Countdown({ event }: { event?: InvitationData["events"][number] }) {
  const target = useMemo(() => dateValue(event)?.getTime() ?? Number.NaN, [event]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = now === null || Number.isNaN(target) ? null : Math.max(0, target - now);
  const values: [string, string][] = distance === null
    ? [["--", "Hari"], ["--", "Jam"], ["--", "Menit"], ["--", "Detik"]]
    : [
        [String(Math.floor(distance / 86400000)).padStart(2, "0"), "Hari"],
        [String(Math.floor(distance / 3600000) % 24).padStart(2, "0"), "Jam"],
        [String(Math.floor(distance / 60000) % 60).padStart(2, "0"), "Menit"],
        [String(Math.floor(distance / 1000) % 60).padStart(2, "0"), "Detik"],
      ];

  return (
    <div className={styles.countdown}>
      {values.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </div>
  );
}

function OpeningSection({ invitation }: { invitation: InvitationData }) {
  const event = invitation.events[0];
  const quote = invitation.opening.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const source = invitation.opening.quoteSource || "QS. Ar-Rum : 21";
  const bridePhoto = invitation.bride.photo || invitation.coverImage || POSTER;
  const groomPhoto = invitation.groom.photo || invitation.coverImage || POSTER;

  return (
    <section id="buka" className={styles.openingSection}>
      <Reveal className={styles.openingIntro}>
        <p className={styles.kicker}>The Wedding Of</p>
        <h2>{firstName(invitation.bride)} <span>&amp;</span> {firstName(invitation.groom)}</h2>
        <div className={styles.portraitPair}>
          <div className={styles.portraitCard} style={imageStyle(bridePhoto)} />
          <div className={styles.portraitCard} style={imageStyle(groomPhoto)} />
        </div>
        <p className={styles.openingDescription}>
          {invitation.opening.description || "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon ridho-Nya, kami mengundang Anda untuk hadir di hari bahagia kami."}
        </p>
      </Reveal>
      <Reveal className={styles.glassCard}>
        <span className={styles.cardOrnament}>{initials(firstName(invitation.bride)).slice(0, 1)} <i>&amp;</i> {initials(firstName(invitation.groom)).slice(0, 1)}</span>
        <blockquote>“{quote}”</blockquote>
        <cite>{source}</cite>
      </Reveal>
      <Reveal className={styles.countdownCard}>
        <h3>Menuju Hari Acara</h3>
        <Countdown event={event} />
        <a href="#events" className={styles.greenButton}><Icon name="calendar" /> Lihat Detail Acara</a>
      </Reveal>
    </section>
  );
}

function PersonCard({ person, role }: { person: InvitationData["bride"] | InvitationData["groom"]; role: "bride" | "groom" }) {
  const photo = person.photo || POSTER;
  const instagram = person.instagram?.replace(/^@/, "");
  return (
    <Reveal className={styles.personCard}>
      <div className={styles.personPhoto} style={imageStyle(photo)} />
      <div className={styles.personInfo}>
        <span>{role === "bride" ? "Mempelai Wanita" : "Mempelai Pria"}</span>
        <h3>{fullName(person)}</h3>
        {person.parents && <p>{person.parents}</p>}
        {instagram && <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">@{instagram}</a>}
      </div>
    </Reveal>
  );
}

function CoupleSection({ invitation }: { invitation: InvitationData }) {
  return (
    <section className={styles.coupleSection}>
      <SectionTitle eyebrow="Every love story in this universe is beautiful" title="The Couple" />
      <div className={styles.peopleGrid}>
        <PersonCard person={invitation.bride} role="bride" />
        <PersonCard person={invitation.groom} role="groom" />
      </div>
    </section>
  );
}

function EventSection({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="events" className={styles.eventSection} style={imageStyle(invitation.gallery[0] || POSTER)}>
      <div className={styles.sectionBackdrop} aria-hidden="true" />
      <div className={styles.sectionContent}>
        <SectionTitle eyebrow="Save the date" title="Wedding Event" />
        <div className={styles.eventList}>
          {invitation.events.map((event, index) => {
            const location = splitLocation(event.location);
            return (
              <Reveal className={styles.eventCard} key={`${event.name}-${index}`}>
                <span className={styles.eventLabel}>{index === 0 ? "Akad Nikah" : "Resepsi"}</span>
                <h3>{event.name}</h3>
                <p className={styles.eventDate}>{formatDate(event)}</p>
                <p className={styles.eventTime}>{event.time}</p>
                <span className={styles.eventHeart}>♥</span>
                <p className={styles.eventVenue}>{location.venue}</p>
                {location.address && <p className={styles.eventAddress}>{location.address}</p>}
                <a href={mapsLink(invitation, event.location)} target="_blank" rel="noreferrer" className={styles.lightButton}><Icon name="pin" /> Lihat Maps</a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LiveSection({ invitation }: { invitation: InvitationData }) {
  const accounts = [invitation.bride.instagram, invitation.groom.instagram].filter(Boolean) as string[];
  return (
    <section className={styles.liveSection}>
      <Reveal className={styles.liveCard}>
        <SectionTitle eyebrow="Be there from wherever you are" title="Filter Tiktok & Live Streaming" />
        <p>Bantu kami mengabadikan moment pernikahan kami dengan Filter Wedding di Story, jangan lupa tag kami. Ikuti prosesi pernikahan kami melalui link Instagram di bawah ini.</p>
        <div className={styles.socialLinks}>
          {accounts.length ? accounts.map((account) => <a key={account} href={`https://instagram.com/${account.replace(/^@/, "")}`} target="_blank" rel="noreferrer">Instagram @{account.replace(/^@/, "")}</a>) : <span>Link Instagram akan tersedia di sini</span>}
        </div>
      </Reveal>
    </section>
  );
}

function StorySection({ invitation }: { invitation: InvitationData }) {
  const story = invitation.story.length ? invitation.story.slice(0, 3) : [
    { year: "", title: "Awal Bertemu", description: "Sebuah pertemuan sederhana menjadi awal dari cerita yang terus kami syukuri." },
    { year: "", title: "Lamaran", description: "Dengan restu keluarga, kami mengikat niat untuk melangkah lebih jauh bersama." },
    { year: "", title: "Menikah", description: "Dengan doa keluarga, kami memulai perjalanan baru sebagai pasangan seumur hidup." },
  ];
  return (
    <section className={styles.storySection}>
      <Reveal className={styles.storyCard}>
        <SectionTitle eyebrow="Our journey" title="Love Story" />
        <div className={styles.storyList}>
          {story.map((item, index) => <article key={`${item.title}-${index}`}><span>{item.year || `0${index + 1}`}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
        </div>
      </Reveal>
    </section>
  );
}

function GallerySection({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.length ? invitation.gallery : FALLBACK_GALLERY;
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className={styles.gallerySection}>
      <Reveal className={styles.galleryInner}>
        <SectionTitle eyebrow="A collection of our favorite moments" title="Wedding Gallery" />
        <div className={styles.galleryGrid}>
          {photos.slice(0, 9).map((photo, index) => <motion.button type="button" key={`${photo}-${index}`} onClick={() => setActive(index)} whileTap={{ scale: 0.97 }}><img src={photo} alt={`Galeri ${index + 1}`} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></motion.button>)}
        </div>
      </Reveal>
      <AnimatePresence>
        {active !== null && photos[active] && <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}><button type="button" onClick={() => setActive(null)} aria-label="Tutup foto"><Icon name="close" /></button><img src={photos[active]} alt="Foto galeri" /></motion.div>}
      </AnimatePresence>
    </section>
  );
}

async function copyText(value: string) {
  try { await navigator.clipboard.writeText(value); } catch { /* clipboard may be unavailable */ }
}

function GiftSection({ invitation }: { invitation: InvitationData }) {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(account: GiftAccount) {
    if (!account.accountNumber) return;
    await copyText(account.accountNumber);
    setCopied(account.accountNumber);
    window.setTimeout(() => setCopied(null), 1600);
  }
  return (
    <section className={styles.giftSection}>
      <Reveal className={styles.giftInner}>
        <SectionTitle eyebrow="A small gesture means a lot" title="Wedding Gift" />
        <p className={styles.giftIntro}>Mohon maaf apabila ada kesalahan penulisan nama/gelar. Bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:</p>
        <div className={styles.giftGrid}>
          {invitation.gifts.map((account, index) => <article className={styles.giftCard} key={`${account.owner}-${index}`}><span className={styles.giftIcon}><Icon name="gift" /></span><p><b>{account.bankName || "Bank"}</b><br />No. Rekening {account.accountNumber || "—"}<br />a.n {account.accountName || account.owner}</p>{account.accountNumber && <button type="button" onClick={() => void copy(account)}><Icon name="copy" /> {copied === account.accountNumber ? "Berhasil disalin" : "Copy"}</button>}</article>)}
        </div>
        <div className={styles.physicalGift}><span><Icon name="gift" /></span><div><h3>Kirim Kado</h3><p>{fullName(invitation.bride)}<br />{invitation.events[0]?.location || "Alamat pengiriman kado dapat ditanyakan kepada keluarga."}</p></div><button type="button" onClick={() => void copyText(invitation.events[0]?.location || "")}><Icon name="copy" /> Copy Alamat</button></div>
      </Reveal>
    </section>
  );
}

function GiftConfirm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }
  return (
    <section className={styles.confirmSection}>
      <Reveal className={styles.formCard}>
        <SectionTitle title="Gift Confirm" />
        <p>Mohon konfirmasi untuk pengiriman gift. Terima kasih.</p>
        {sent ? <div className={styles.success}>Konfirmasi gift sudah dicatat. Terima kasih.</div> : <form onSubmit={submit}><input required placeholder="Nama" /><input placeholder="Nama Bank" /><input placeholder="Nominal" /><input required placeholder="Ucapan" /><button type="submit" className={styles.greenButton}>Konfirmasi</button></form>}
      </Reveal>
    </section>
  );
}

function RsvpSection() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [amount, setAmount] = useState("1");
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim()) setSent(true);
  }
  return (
    <section className={styles.rsvpSection}>
      <Reveal className={styles.formCard}>
        <SectionTitle title="RSVP" />
        <p>Bantu kami mempersiapkan jamuan yang hangat untuk Anda semua dengan mengirimkan konfirmasi kehadiran melalui form berikut ini.</p>
        {sent ? <div className={styles.success}>Terima kasih, konfirmasi Anda sudah dicatat.</div> : <form onSubmit={submit}><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama" /><select value={attendance} onChange={(event) => setAttendance(event.target.value as Attendance)}><option>Hadir</option><option>Masih Ragu</option><option>Tidak Hadir</option></select><select value={amount} onChange={(event) => setAmount(event.target.value)}><option value="1">1 orang</option><option value="2">2 orang</option><option value="3">3 orang</option></select><button type="submit" className={styles.greenButton}>Submit</button></form>}
      </Reveal>
    </section>
  );
}

function WishesSection({ invitation }: { invitation: InvitationData }) {
  const { entries, counts, hasMore, loadMore, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) { setError("Nama dan ucapan wajib diisi."); return; }
    const result = await submit({ name, whatsapp: "", attendance: "Hadir", message });
    if (result.error) { setError(result.error); return; }
    setName("");
    setMessage("");
  }
  return (
    <section className={styles.wishesSection}>
      <Reveal className={styles.formCard}>
        <SectionTitle title="Ucapan & Doa" />
        <p>You’ve gotta dance like there’s nobody watching, love like you’ll never be hurt, and live like it’s heaven on earth.</p>
        {submitted ? <div className={styles.success}>Ucapan Anda telah terkirim. Terima kasih.</div> : <form onSubmit={send}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama" required /><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ucapan" rows={4} required /><button type="submit" className={styles.greenButton} disabled={submitting}>{submitting ? "Mengirim..." : "Kirimkan Ucapan"}</button>{error && <small className={styles.formError}>{error}</small>}</form>}
        <div className={styles.wishCounts}><span>{counts.hadir} Hadir</span><span>{counts.tidakHadir} Tidak Hadir</span><span>{counts.raguRagu} Ragu</span></div>
        {entries.length > 0 && <div className={styles.wishList}>{entries.map((entry) => <article key={entry.id}><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></article>)}{hasMore && <button type="button" onClick={loadMore}>Lihat ucapan lainnya</button>}</div>}
      </Reveal>
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <p>Suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.</p>
        <span>Kami Yang Berbahagia,</span>
        <h2>{firstName(invitation.bride)} <i>&amp;</i> {firstName(invitation.groom)}</h2>
        <img src="/vistiq-invitation-logo.png" alt="Vistiq Invitation" />
        <small>Created By Vistiq Invitation</small>
      </Reveal>
    </footer>
  );
}

export default function FizanIslamicMotion({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = opened ? oldOverflow : "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [opened]);

  async function openInvitation() {
    setOpened(true);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 30);
  }

  async function beginOpening() {
    if (invitation.musicUrl && !isPlaying) {
      try { await toggle(); } catch { /* autoplay can still be blocked */ }
    }
  }

  return (
    <main className={styles.root}>
      <div className={styles.page}>
        <div className={styles.content} aria-hidden={!opened}>
          <OpeningSection invitation={invitation} />
          <CoupleSection invitation={invitation} />
          <EventSection invitation={invitation} />
          <LiveSection invitation={invitation} />
          <StorySection invitation={invitation} />
          <GallerySection invitation={invitation} />
          {invitation.gifts.length > 0 && <GiftSection invitation={invitation} />}
          <GiftConfirm />
          <RsvpSection />
          <WishesSection invitation={invitation} />
          <Footer invitation={invitation} />
        </div>
        {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}
        {opened && invitation.musicUrl && <button type="button" className={`${styles.musicButton} ${isPlaying ? styles.musicPlaying : ""}`} onClick={() => void toggle()} aria-label={isPlaying ? "Jeda musik" : "Putar musik"}><Icon name="music" /></button>}
        <AnimatePresence>{!opened && <Cover key="fizan-cover" invitation={invitation} onOpen={() => void openInvitation()} onBegin={() => void beginOpening()} />}</AnimatePresence>
      </div>
    </main>
  );
}
