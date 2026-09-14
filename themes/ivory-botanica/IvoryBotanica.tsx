"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

type Person = InvitationData["groom"];
type IconName = "arrow" | "calendar" | "copy" | "gift" | "heart" | "home" | "mail" | "map" | "music" | "pin";

const ASSET_ROOT = "/themes/ivory-botanica";

function shortName(person: Person) {
  return person.nickname?.trim() || person.name.trim().split(/\s+/)[0] || "Mempelai";
}

function firstLetter(person: Person) {
  return shortName(person).charAt(0).toUpperCase() || "M";
}

function cleanInstagram(value: string) {
  return value.replace(/^@/, "");
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (name === "arrow") {
    return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (name === "calendar") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 3.5v3M17 3.5v3M3.5 9h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M7.5 13h2M14.5 13h2M7.5 16.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  }
  if (name === "copy") {
    return <svg {...common}><rect x="8" y="8" width="11" height="12" rx="1.8" stroke="currentColor" strokeWidth="1.5" /><path d="M16 8V6.5A1.5 1.5 0 0 0 14.5 5h-8A1.5 1.5 0 0 0 5 6.5v9A1.5 1.5 0 0 0 6.5 17H8" stroke="currentColor" strokeWidth="1.5" /></svg>;
  }
  if (name === "gift") {
    return <svg {...common}><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7H8.5A2.5 2.5 0 1 1 11 4.5V7ZM12 7h3.5A2.5 2.5 0 1 0 13 4.5V7Z" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path d="M20.8 8.9c0 5.2-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.9A4.3 4.3 0 0 1 12 6.8a4.3 4.3 0 0 1 8.8 2.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
  }
  if (name === "home") {
    return <svg {...common}><path d="m4 10 8-6 8 6v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9.5 20.5v-6h5v6" stroke="currentColor" strokeWidth="1.5" /></svg>;
  }
  if (name === "mail") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (name === "map" || name === "pin") {
    return <svg {...common}><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
  }
  return <svg {...common}><path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Botanical({ src = "bouquet.png", placement }: { src?: string; placement: string }) {
  return (
    <motion.div
      className={`${styles.botanical} ${styles[placement]}`}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.15, ease: "easeOut" }}
    >
      <Image src={`${ASSET_ROOT}/${src}`} alt="" fill sizes="260px" />
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <motion.header
      className={`${styles.sectionHeading} ${dark ? styles.headingDark : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <span className={styles.headingEyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      <div className={styles.headingRule}><i /><span>✦</span><i /></div>
    </motion.header>
  );
}

function Loading() {
  return (
    <motion.div className={styles.loading} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <div className={styles.loadingMark}><span>R</span><i>&amp;</i><span>N</span></div>
      <div className={styles.loadingLine} />
      <p>IVORY BOTANICA</p>
    </motion.div>
  );
}

function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const groom = shortName(invitation.groom);
  const bride = shortName(invitation.bride);

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.7 }}
      aria-label="Sampul undangan pernikahan"
    >
      <div className={styles.coverWash} />
      <div className={styles.coverGrid} />
      <Botanical placement="coverBotanicalLeft" />
      <Botanical placement="coverBotanicalRight" src="flower-04.webp" />
      <Botanical placement="coverBotanicalBottom" src="flower-02.webp" />

      <div className={styles.coverFrame}>
        <div className={styles.coverTopline}>
          <span>VISTIQ INVITATION</span>
          <span>EST. 2026</span>
        </div>
        <div className={styles.coverCenter}>
          <p className={styles.coverKicker}>THE WEDDING OF</p>
          <div className={styles.coverSeal}>
            <span>{firstLetter(invitation.groom)}</span>
            <i>&amp;</i>
            <span>{firstLetter(invitation.bride)}</span>
          </div>
          <div className={styles.coverNames}>
            <span>{groom}</span>
            <em>&amp;</em>
            <span>{bride}</span>
          </div>
          <div className={styles.coverRule}><i /><span>✦</span><i /></div>
          <p className={styles.coverDate}>{invitation.events[0]?.date || "Dengan penuh cinta"}</p>
        </div>
        <div className={styles.coverGuest}>
          <span className={styles.coverGuestLabel}>DEARLY INVITED FOR</span>
          <strong>{guest}</strong>
          <button type="button" onClick={() => setOpened(true)}>
            BUKA UNDANGAN <Icon name="arrow" size={17} />
          </button>
        </div>
        <p className={styles.coverFootnote}>A quiet garden · a lifelong promise</p>
      </div>
    </motion.section>
  );
}

function Opening({ invitation }: { invitation: InvitationData }) {
  const greeting = invitation.opening.greeting || "Dengan memohon rahmat dan ridho Allah SWT";
  const description = invitation.opening.description || `Kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari hari bahagia ${shortName(invitation.groom)} dan ${shortName(invitation.bride)}.`;
  const quote = invitation.opening.quote || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup supaya kamu mendapat ketenangan hati padanya.";
  const quoteSource = invitation.opening.quoteSource || "QS. Ar-Rum : 21";

  return (
    <section className={`${styles.section} ${styles.openingSection}`}>
      <Botanical placement="sectionBotanicalRight" src="flower-01.webp" />
      <SectionHeading eyebrow="A note from the heart" title={invitation.opening.title || "A beautiful beginning"} />
      <div className={styles.openingGrid}>
        <motion.div
          className={styles.openingSealLarge}
          initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <span>{firstLetter(invitation.groom)}</span>
          <i>&amp;</i>
          <span>{firstLetter(invitation.bride)}</span>
          <small>R · N</small>
        </motion.div>
        <motion.article
          className={styles.openingCopy}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.12 }}
        >
          <p className={styles.openingGreeting}>{greeting}</p>
          <p>{description}</p>
          <blockquote>
            <span>“</span>
            <p>{quote}</p>
            <cite>{quoteSource}</cite>
          </blockquote>
        </motion.article>
      </div>
    </section>
  );
}

function PersonCard({ person, role, feminine = false }: { person: Person; role: string; feminine?: boolean }) {
  const instagram = person.instagram ? cleanInstagram(person.instagram) : null;

  return (
    <motion.article
      className={`${styles.personCard} ${feminine ? styles.personCardFeminine : ""}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <span className={styles.personRole}>{role}</span>
      <div className={styles.personMonogram}>{firstLetter(person)}</div>
      <h3>{person.name}</h3>
      {person.parents && <p>{feminine ? "Putri" : "Putra"} dari<br />{person.parents}</p>}
      {instagram && <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">@{instagram}</a>}
    </motion.article>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <section className={styles.darkBand} id="couple">
      <Botanical placement="darkBotanicalLeft" src="flower-05.webp" />
      <Botanical placement="darkBotanicalRight" src="flower-06.webp" />
      <div className={styles.section}>
        <SectionHeading eyebrow="The people behind the promise" title="Two souls, one garden" dark />
        <div className={styles.personGrid}>
          <PersonCard person={invitation.groom} role="THE GROOM" />
          <div className={styles.coupleConnector} aria-hidden="true"><Icon name="heart" size={22} /></div>
          <PersonCard person={invitation.bride} role="THE BRIDE" feminine />
        </div>
      </div>
    </section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <section className={styles.section} id="story">
      <SectionHeading eyebrow="A collection of little moments" title="Our story, in bloom" />
      <div className={styles.storyGrid}>
        {invitation.story.map((item, index) => (
          <motion.article
            key={`${item.year}-${item.title}`}
            className={styles.storyCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.24) }}
          >
            <div className={styles.storyMeta}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.year}</b></div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Countdown({ date }: { date: string | null }) {
  const target = useMemo(() => (date ? new Date(date).getTime() : Number.NaN), [date]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!date || Number.isNaN(target)) return null;

  const remaining = Math.max(0, (now === null ? 0 : target - now));
  const values: Array<[string, number]> = [
    ["Hari", Math.floor(remaining / 86400000)],
    ["Jam", Math.floor(remaining / 3600000) % 24],
    ["Menit", Math.floor(remaining / 60000) % 60],
    ["Detik", Math.floor(remaining / 1000) % 60],
  ];

  return (
    <section className={styles.countdownBand} aria-label="Hitung mundur menuju hari pernikahan">
      <div className={styles.section}>
        <p className={styles.countdownEyebrow}>COUNTING DOWN TO OUR DAY</p>
        <h2>Until we say <em>yes</em></h2>
        <div className={styles.countdownGrid}>
          {values.map(([label, value]) => (
            <div className={styles.countdownItem} key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <section className={`${styles.section} ${styles.eventSection}`} id="event">
      <Botanical placement="sectionBotanicalLeft" src="flower-03.webp" />
      <SectionHeading eyebrow="Save the date" title="Gather with us" />
      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <motion.article
            className={styles.eventCard}
            key={`${event.name}-${index}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: index * 0.08 }}
          >
            <span className={styles.eventNumber}>0{index + 1}</span>
            <div className={styles.eventIcon}><Icon name={index === 0 ? "heart" : "calendar"} size={22} /></div>
            <p className={styles.eventType}>THE CELEBRATION</p>
            <h3>{event.name}</h3>
            <div className={styles.eventDetails}>
              <span><Icon name="calendar" size={15} />{event.date}</span>
              <span><Icon name="music" size={15} />{event.time}</span>
              <span><Icon name="pin" size={15} />{event.location}</span>
            </div>
            {invitation.mapsUrl && <a className={styles.textLink} href={invitation.mapsUrl} target="_blank" rel="noreferrer">Lihat lokasi <Icon name="arrow" size={15} /></a>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Video({ invitation }: { invitation: InvitationData }) {
  if (!invitation.videoUrl) return null;

  return (
    <section className={`${styles.section} ${styles.mediaSection}`}>
      <SectionHeading eyebrow="A moving memory" title="A little film of us" />
      <div className={styles.videoFrame}><iframe src={invitation.videoUrl} title="Video kedua mempelai" allowFullScreen /></div>
    </section>
  );
}

function Maps({ invitation }: { invitation: InvitationData }) {
  if (!invitation.mapsEmbedUrl && !invitation.mapsUrl) return null;

  return (
    <section className={`${styles.section} ${styles.mapSection}`}>
      <SectionHeading eyebrow="Find us here" title="The place we begin" />
      <div className={styles.mapFrame}>
        {invitation.mapsEmbedUrl && <iframe src={invitation.mapsEmbedUrl} title="Peta lokasi acara" loading="lazy" />}
        <div className={styles.mapOverlay}>
          <span><Icon name="pin" size={14} /> CELEBRATION LOCATION</span>
          <strong>{invitation.events[0]?.location || "Jakarta"}</strong>
          {invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">Buka di Maps <Icon name="arrow" size={15} /></a>}
        </div>
      </div>
    </section>
  );
}

function GiftCard({ account, copied, onCopy }: { account: GiftAccount; copied: boolean; onCopy: () => void }) {
  return (
    <motion.article className={styles.giftCard} whileHover={{ y: -4 }}>
      <div className={styles.giftIcon}><Icon name="gift" size={22} /></div>
      <span className={styles.giftOwner}>{account.owner}</span>
      <h3>{account.bankName || "Rekening"}</h3>
      <strong>{account.accountNumber || "—"}</strong>
      {account.accountName && <p>a.n. {account.accountName}</p>}
      {account.accountNumber && <button type="button" onClick={onCopy}><Icon name="copy" size={15} />{copied ? "Tersalin" : "Salin rekening"}</button>}
    </motion.article>
  );
}

function Gifts({ invitation }: { invitation: InvitationData }) {
  const [copied, setCopied] = useState<number | null>(null);

  const copyAccount = async (accountNumber: string, index: number) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) await navigator.clipboard.writeText(accountNumber);
      setCopied(index);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  if (invitation.gifts.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.giftSection}`} id="gift">
      <SectionHeading eyebrow="A thoughtful gesture" title="With love, no obligation" />
      <p className={styles.centerIntro}>Doa restu Anda adalah hadiah terindah. Jika ingin berbagi tanda kasih, dapat melalui rekening berikut.</p>
      <div className={styles.giftGrid}>
        {invitation.gifts.map((account, index) => (
          <GiftCard
            key={`${account.owner}-${index}`}
            account={account}
            copied={copied === index}
            onCopy={() => account.accountNumber && copyAccount(account.accountNumber, index)}
          />
        ))}
      </div>
    </section>
  );
}

function Guestbook({ invitation }: { invitation: InvitationData }) {
  const { counts, entries, totalCount, hasMore, loadMore, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }
    const result = await submit({ name: name.trim(), whatsapp: whatsapp.trim(), attendance, message: message.trim() });
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    setWhatsapp("");
    setMessage("");
  };

  const stats: Array<[string, number]> = [["Hadir", counts.hadir], ["Tidak hadir", counts.tidakHadir], ["Masih ragu", counts.raguRagu]];

  return (
    <section className={styles.rsvpBand} id="rsvp">
      <Botanical placement="rsvpBotanicalRight" src="flower-02.webp" />
      <div className={styles.section}>
        <SectionHeading eyebrow="Let us know you are coming" title="Leave a note for us" dark />
        <div className={styles.rsvpGrid}>
          <div className={styles.attendancePanel}>
            <span className={styles.attendanceLabel}>A SMALL HEADCOUNT</span>
            <h3>Your presence makes the day whole.</h3>
            <div className={styles.statList}>
              {stats.map(([label, value]) => <div className={styles.stat} key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
            <p>Terima kasih sudah meluangkan waktu untuk memberi kabar dan doa.</p>
          </div>
          {submitted ? (
            <div className={styles.confirmed}>
              <div className={styles.confirmedMark}><Icon name="heart" size={23} /></div>
              <span>THANK YOU</span>
              <h3>Ucapanmu sudah kami terima.</h3>
              <p>Sampai bertemu di hari bahagia kami.</p>
            </div>
          ) : (
            <form className={styles.rsvpForm} onSubmit={send}>
              <label>Nama<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" required /></label>
              <label>WhatsApp <span>(opsional)</span><input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="08..." /></label>
              <label>Konfirmasi kehadiran<select value={attendance} onChange={(event) => setAttendance(event.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label>
              <label>Ucapan dan doa<textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tulis pesan untuk Rizky & Nabila" required /></label>
              {error && <p className={styles.formError} role="alert">{error}</p>}
              <button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim ucapan"} <Icon name="arrow" size={16} /></button>
            </form>
          )}
        </div>

        <div className={styles.wishes}>
          <div className={styles.wishesHeader}><span>FROM OUR GUESTBOOK</span><strong>{totalCount} ucapan</strong></div>
          {entries.length === 0 ? <p className={styles.emptyWishes}>Jadilah yang pertama meninggalkan ucapan.</p> : (
            <div className={styles.wishesList}>
              {entries.map((entry) => <article key={entry.id}><div className={styles.wishMark}>“</div><p>{entry.message}</p><footer><strong>{entry.name}</strong><span>{entry.attendance}</span></footer></article>)}
            </div>
          )}
          {hasMore && <button className={styles.moreWishes} type="button" onClick={loadMore}>Tampilkan lebih banyak</button>}
        </div>
      </div>
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Botanical placement="footerBotanicalLeft" src="flower-01.webp" />
      <span className={styles.footerEyebrow}>THE BEGINNING OF FOREVER</span>
      <h2>{shortName(invitation.groom)} <em>&amp;</em> {shortName(invitation.bride)}</h2>
      <p>With all our love, Rizky &amp; Nabila</p>
      <small>© {new Date().getFullYear()} {invitation.brand?.name || "Vistiq Invitation"}</small>
    </footer>
  );
}

function Music({ url }: { url: string | null }) {
  const { audioRef, isPlaying, toggle } = useMusicPlayer(url);
  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="none" />
      <button className={`${styles.musicButton} ${isPlaying ? styles.musicPlaying : ""}`} type="button" onClick={toggle} aria-label={isPlaying ? "Jeda musik" : "Putar musik"}>
        <Icon name="music" size={18} />
      </button>
    </>
  );
}

const NAV_ITEMS: Array<{ id: string; label: string; icon: IconName }> = [
  { id: "home", label: "Home", icon: "home" },
  { id: "couple", label: "Couple", icon: "heart" },
  { id: "event", label: "Event", icon: "calendar" },
  { id: "gift", label: "Gift", icon: "gift" },
  { id: "rsvp", label: "RSVP", icon: "mail" },
];

function Navigation() {
  return (
    <nav className={styles.navigation} aria-label="Navigasi undangan">
      {NAV_ITEMS.map((item) => (
        <button type="button" key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}>
          <Icon name={item.icon} size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function IvoryBotanica({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 620);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.root}>
      <AnimatePresence mode="wait" initial={false}>
        {!ready ? (
          <Loading key="loading" />
        ) : !opened ? (
          <Cover key="cover" invitation={invitation} />
        ) : (
          <motion.main
            key="invitation"
            className={styles.page}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <section id="home"><Opening invitation={invitation} /></section>
            <Couple invitation={invitation} />
            {invitation.story.length > 0 && <Story invitation={invitation} />}
            <Countdown date={invitation.events[0]?.rawDate || null} />
            <Events invitation={invitation} />
            <Video invitation={invitation} />
            <Maps invitation={invitation} />
            <Gifts invitation={invitation} />
            <Guestbook invitation={invitation} />
            <Footer invitation={invitation} />
          </motion.main>
        )}
      </AnimatePresence>
      {ready && opened && <><Music url={invitation.musicUrl} /><Navigation /></>}
    </div>
  );
}
