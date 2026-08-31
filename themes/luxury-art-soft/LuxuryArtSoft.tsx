"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { EventItem, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ASSET = "/themes/luxury-art-soft/";
const ADMIN_WHATSAPP = "6281371338032";
const revealEase = [0.22, 1, 0.36, 1] as const;

type IconName =
  | "home"
  | "couple"
  | "calendar"
  | "gallery"
  | "heart"
  | "chat"
  | "gift"
  | "music"
  | "mail"
  | "pin"
  | "copy"
  | "play";

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
      {name === "home" && (
        <>
          <path {...line} d="M3.5 11 12 4l8.5 7" />
          <path {...line} d="M5.5 10v9h13v-9M9.5 19v-5h5v5" />
        </>
      )}
      {name === "couple" && (
        <>
          <circle {...line} cx="8" cy="8" r="2.4" />
          <circle {...line} cx="16" cy="8" r="2.4" />
          <path {...line} d="M3.8 19v-2.3A4.2 4.2 0 0 1 8 12.5a4 4 0 0 1 4 4V19M12 19v-2.5a4 4 0 0 1 8 0V19" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect {...line} x="3.5" y="5" width="17" height="15" rx="2" />
          <path {...line} d="M7 3v4M17 3v4M3.5 9.5h17" />
        </>
      )}
      {name === "gallery" && (
        <>
          <rect {...line} x="3.5" y="4" width="17" height="16" rx="2" />
          <circle {...line} cx="8.5" cy="9" r="1.5" />
          <path {...line} d="m5.5 17 4.2-4 2.7 2.4 2.6-2.7 3.5 4.3" />
        </>
      )}
      {name === "heart" && (
        <path {...line} d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z" />
      )}
      {name === "chat" && (
        <>
          <path {...line} d="M4 5.5h16v11H9l-5 3v-14Z" />
          <path {...line} d="M8 10h8M8 13h5" />
        </>
      )}
      {name === "gift" && (
        <>
          <rect {...line} x="3.5" y="9" width="17" height="11" rx="1.5" />
          <path {...line} d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z" />
        </>
      )}
      {name === "music" && (
        <>
          <path {...line} d="M9 18V5l10-2v13" />
          <circle {...line} cx="6" cy="18" r="3" />
          <circle {...line} cx="16" cy="16" r="3" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect {...line} x="3" y="5.5" width="18" height="13" rx="2" />
          <path {...line} d="m4.5 7 7.5 6 7.5-6" />
        </>
      )}
      {name === "pin" && (
        <>
          <path {...line} d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z" />
          <circle {...line} cx="12" cy="10" r="2" />
        </>
      )}
      {name === "copy" && (
        <>
          <rect {...line} x="8" y="8" width="11" height="12" rx="2" />
          <path {...line} d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
        </>
      )}
      {name === "play" && <path {...line} fill="currentColor" stroke="none" d="m8 5 11 7-11 7Z" />}
    </svg>
  );
}

function firstName(name: string, nickname?: string | null) {
  return nickname?.trim() || name.trim().split(/\s+/)[0] || "Mempelai";
}

function eventDateParts(event?: EventItem) {
  if (!event) return { day: "", weekday: "", month: "", year: "" };

  const parsed = event.rawDate ? new Date(event.rawDate) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return { day: event.date, weekday: "", month: "", year: "" };
  }

  const options = { timeZone: "UTC" } as const;
  return {
    day: new Intl.DateTimeFormat("id-ID", { ...options, day: "numeric" }).format(parsed),
    weekday: new Intl.DateTimeFormat("id-ID", { ...options, weekday: "long" }).format(parsed),
    month: new Intl.DateTimeFormat("id-ID", { ...options, month: "long" }).format(parsed),
    year: new Intl.DateTimeFormat("id-ID", { ...options, year: "numeric" }).format(parsed),
  };
}

function eventTimezoneOffsetMinutes(time: string) {
  const normalized = time.toUpperCase();
  if (/\bWITA\b/.test(normalized)) return 8 * 60;
  if (/\bWIT\b/.test(normalized)) return 9 * 60;
  return 7 * 60;
}

function parseEventDate(event?: EventItem) {
  const rawDate = event?.rawDate?.trim();
  if (!rawDate) return null;

  // Invitation dates are stored without an offset. Treat them as Indonesian
  // local time (or the zone written in the event time) instead of letting
  // each visitor's browser reinterpret the date in its own timezone.
  const localParts = rawDate.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!localParts) {
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [, year, month, day, hours, minutes, seconds = "00"] = localParts;
  const localUtcMs = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );
  return new Date(localUtcMs - eventTimezoneOffsetMinutes(event?.time || "") * 60_000);
}

function fallbackPhotos(invitation: InvitationData) {
  const defaults = [
    `${ASSET}ai-gallery-01.jpg`,
    `${ASSET}ai-gallery-02.jpg`,
    `${ASSET}ai-gallery-03.jpg`,
    `${ASSET}ai-gallery-04.jpg`,
    `${ASSET}ai-gallery-05.jpg`,
    `${ASSET}ai-cover.jpg`,
    `${ASSET}ai-groom.jpg`,
    `${ASSET}ai-bride.jpg`,
  ];
  const customPhotos = invitation.gallery.filter(Boolean);
  return customPhotos.length ? customPhotos : defaults;
}

function googleCalendarHref(event?: EventItem) {
  const startMs = parseEventDate(event)?.getTime();
  if (!event || startMs === undefined || !Number.isFinite(startMs)) return null;

  const format = (value: number) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name || "Wedding Event",
    dates: `${format(startMs)}/${format(startMs + 2 * 60 * 60 * 1000)}`,
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function isExternalUrl(value: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const fallback = invitation.coverImage || `${ASSET}ai-cover.jpg`;
  const videoSource = invitation.videoUrl || `${ASSET}cover.mp4`;
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <motion.section
      className={styles.coverLayer}
      exit={{ opacity: 0, scale: 1.025, y: -16 }}
      transition={{ duration: 0.9, ease: revealEase }}
    >
      <div className={styles.cover}>
        <div className={styles.coverMedia}>
          {videoFailed ? (
            <Image src={fallback} alt="" fill priority sizes="(max-width: 450px) 100vw, 450px" className={styles.coverFallback} />
          ) : (
            <video
              className={styles.coverVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={fallback}
              onError={() => setVideoFailed(true)}
            >
              <source src={videoSource} type="video/mp4" />
            </video>
          )}
          <div className={styles.coverShade} />
        </div>

        <span className={styles.coverPause} aria-hidden="true">Ⅱ</span>
        <div className={styles.coverTitle}>
          <p>The Wedding Of</p>
          <h1>{bride} <em>&amp;</em> {groom}</h1>
        </div>
        <div className={styles.coverGuest}>
          <span>Kepada Bapak/Ibu/Saudara/i</span>
          <strong>{guest}</strong>
          <small>Di Tempat</small>
          <button type="button" onClick={onOpen}>
            <Icon name="mail" /> Buka Undangan
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const date = eventDateParts(invitation.events[0]);
  const dateLabel = date.weekday
    ? `${date.weekday.toUpperCase()}, ${date.day} ${date.month.toUpperCase()} ${date.year}`
    : invitation.events[0]?.date || "SAVE THE DATE";

  return (
    <section className={styles.heroPanel} data-opening-hero aria-label="Halaman pembuka undangan">
      <Image src={`${ASSET}art-soft-opening-v2.png`} alt="" fill priority sizes="(max-width: 450px) 100vw, 450px" className={styles.panelArt} />
      <div className={styles.panelShade} />
      <div className={styles.heroFrame}>
        <motion.div
          className={styles.panelCopy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: revealEase }}
        >
          <p>THE WEDDING OF</p>
          <h2>{bride}<span>&amp;</span>{groom}</h2>
          <time>{dateLabel}</time>
        </motion.div>
      </div>
    </section>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const bridePhoto = invitation.bride.photo || invitation.gallery[0] || `${ASSET}ai-bride.jpg`;
  const groomPhoto = invitation.groom.photo || invitation.gallery[1] || `${ASSET}ai-groom.jpg`;
  const description = invitation.opening.description || "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.";

  return (
    <section id="couple" className={styles.coupleSection}>
      <div className={styles.coupleTexture} aria-hidden="true" />
      <motion.header
        className={styles.coupleIntro}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: revealEase }}
      >
        <p>The</p>
        <h2>Couple</h2>
        <div className={styles.ornament}>✦ ───────── ✦</div>
        <p className={styles.coupleDescription}>
          {invitation.opening.greeting || "Assalamu'alaikum Warohmatullahi Wabarokatuh"}
          <br />
          {description}
        </p>
      </motion.header>

      <PersonCard person={invitation.bride} role="THE BRIDE" photo={bridePhoto} />
      <PersonCard person={invitation.groom} role="THE GROOM" photo={groomPhoto} reverse />
    </section>
  );
}

function PersonCard({
  person,
  role,
  photo,
  reverse = false,
}: {
  person: InvitationData["bride"] | InvitationData["groom"];
  role: string;
  photo: string;
  reverse?: boolean;
}) {
  return (
    <motion.article
      className={`${styles.personCard} ${reverse ? styles.personCardReverse : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: revealEase }}
    >
      <div className={styles.personFrame}>
        <div className={styles.personPhoto}>
          <Image src={photo} alt={person.name} fill sizes="(max-width: 450px) 78vw, 345px" />
        </div>
        <div className={styles.frameShine} aria-hidden="true" />
      </div>
      <div className={styles.personInfo}>
        <span>{role}</span>
        <h3>{person.name}</h3>
        {person.parents ? <p>{person.parents}</p> : null}
        {person.instagram ? (
          <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
            <span className={styles.socialIcon}>◎</span> Instagram
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function QuoteCountdown({ invitation }: { invitation: InvitationData }) {
  const event = invitation.events[0];
  const target = parseEventDate(event)?.getTime() ?? null;
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = now === null || target === null || !Number.isFinite(target)
    ? null
    : Math.max(0, target - now);
  const values = distance === null
    ? ["--", "--", "--", "--"]
    : [
        Math.floor(distance / 86400000),
        Math.floor(distance / 3600000) % 24,
        Math.floor(distance / 60000) % 60,
        Math.floor(distance / 1000) % 60,
      ].map((value) => String(value).padStart(2, "0"));
  const quote = invitation.opening.quote || "Love is that condition in which the happiness of another person is essential to your own.";
  const source = invitation.opening.quoteSource || "Robert A. Heinlein";
  const background = invitation.gallery[2] || `${ASSET}ai-gallery-03.jpg`;
  const saveDate = googleCalendarHref(event);

  return (
    <section id="countdown" className={styles.quoteSection}>
      <Image src={background} alt="" fill sizes="(max-width: 450px) 100vw, 450px" className={styles.quoteBackground} />
      <div className={styles.quoteShade} />
      <motion.div
        className={styles.quoteContent}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: revealEase }}
      >
        <blockquote>“{quote}”</blockquote>
        <cite>— {source}</cite>
        <div className={styles.countdownGrid}>
          {values.map((value, index) => (
            <span key={index}>
              <strong>{value}</strong>
              <small>{["Day", "Hrs", "Min", "Sec"][index]}</small>
            </span>
          ))}
        </div>
        {saveDate ? (
          <a className={styles.saveDate} href={saveDate} target="_blank" rel="noreferrer">
            <Icon name="calendar" /> SAVE THE DATE
          </a>
        ) : null}
      </motion.div>
    </section>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  const events = invitation.events.slice(0, 2);
  return (
    <section id="event" className={styles.eventsSection}>
      <div className={styles.eventsHeading}><span>Wedding</span><em>Event</em></div>
      {events.map((event, index) => <EventCard key={`${event.name}-${event.date}`} event={event} reverse={index === 1} mapsUrl={invitation.mapsUrl} />)}
      {!events.length ? <EventCard event={{ name: "Wedding Event", date: "", rawDate: null, time: "", location: "" }} mapsUrl={null} /> : null}
    </section>
  );
}

function WeddingVideo({ invitation }: { invitation: InvitationData }) {
  const videoUrl = isExternalUrl(invitation.videoUrl) ? invitation.videoUrl : null;

  return (
    <section id="video" className={styles.videoSection}>
      <Image src={`${ASSET}ai-gallery-03.jpg`} alt="" fill sizes="(max-width: 450px) 100vw, 450px" className={styles.videoBackground} />
      <div className={styles.videoShade} />
      <motion.div
        className={styles.videoContent}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: revealEase }}
      >
        <div className={styles.videoHeading}><span>Wedding</span><em>Video</em></div>
        <p>Saksikan video pre-wedding kami dan simpan cerita kecil menuju hari bahagia.</p>
        {videoUrl ? (
          <a href={videoUrl} target="_blank" rel="noreferrer"><Icon name="play" /> Watch Video</a>
        ) : (
          <span className={styles.videoPending}>Video pre-wedding</span>
        )}
      </motion.div>
    </section>
  );
}

function EventCard({ event, reverse = false, mapsUrl }: { event: EventItem; reverse?: boolean; mapsUrl: string | null }) {
  const date = eventDateParts(event);
  const mapHref = mapsUrl || (event.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : null);
  return (
    <motion.article
      className={`${styles.eventCard} ${reverse ? styles.eventCardReverse : ""}`}
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.17 }}
      transition={{ duration: 0.8, ease: revealEase }}
    >
      <div className={styles.eventFrame}>
        <div className={styles.eventContent}>
          <h2>{event.name}</h2>
          {date.weekday ? <p>{date.weekday.toUpperCase()}, {date.day} {date.month.toUpperCase()} {date.year}</p> : <p>{event.date}</p>}
          {event.time ? <strong>{event.time}</strong> : null}
          <span className={styles.eventDivider}>♥</span>
          {event.location ? <b>{event.location}</b> : null}
          {mapHref ? <a href={mapHref} target="_blank" rel="noreferrer"><Icon name="pin" /> Google Map</a> : null}
        </div>
      </div>
    </motion.article>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const photos = fallbackPhotos(invitation).slice(0, 8);
  return (
    <section id="gallery" className={styles.gallerySection}>
      <motion.div
        className={styles.galleryLead}
        initial={{ opacity: 0, scale: 1.03 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: revealEase }}
      >
        <Image src={`${ASSET}ai-gallery-01.jpg`} alt="" fill sizes="(max-width: 450px) 100vw, 450px" />
        <div><span>Wedding</span><strong>Gallery</strong></div>
      </motion.div>
      <div className={styles.galleryShelf}>
        {photos.map((photo, index) => (
          <motion.button
            type="button"
            key={`${photo}-${index}`}
            className={index >= 6 ? styles.galleryWide : ""}
            onClick={() => setActive(index)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.05, duration: 0.55, ease: revealEase }}
          >
            <Image src={photo} alt={`Gallery ${index + 1}`} fill sizes="(max-width: 450px) 28vw, 140px" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null ? (
          <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <button type="button" aria-label="Tutup">×</button>
            <div><Image src={photos[active]} alt="Foto galeri" fill sizes="90vw" /></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

const defaultStories = [
  { year: "2018", title: "Awal Bertemu", description: "Pertemuan sederhana yang menjadi awal dari cerita indah kami." },
  { year: "2020", title: "Menjalin Kasih", description: "Kami belajar tumbuh, saling mendukung, dan mengenal keluarga masing-masing." },
  { year: "2025", title: "Lamaran", description: "Dengan restu kedua keluarga, kami mantap melangkah menuju jenjang pernikahan." },
  { year: "2026", title: "Hari Bahagia", description: "Dengan penuh syukur, kami memulai babak baru dalam perjalanan bersama." },
];

function Story({ invitation }: { invitation: InvitationData }) {
  const stories = invitation.story.length ? invitation.story.slice(0, 5) : defaultStories;
  const photos = fallbackPhotos(invitation).slice(2, 2 + stories.length);
  return (
    <section id="story" className={styles.storySection}>
      <div className={styles.storyHeader}><span>Love</span><h2>Story</h2></div>
      <div className={styles.storyTimeline}>
        <span className={styles.timelineLine} aria-hidden="true" />
        {stories.map((story, index) => (
          <motion.article key={`${story.year}-${story.title}`} initial={{ opacity: 0, x: index % 2 ? 18 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.06, duration: 0.65, ease: revealEase }}>
            <i>♥</i>
            <div className={styles.storyCard}>
              <div className={styles.storyCardPhoto}>
                <Image src={photos[index] || photos[index % photos.length] || `${ASSET}ai-gallery-03.jpg`} alt={`Momen ${story.title}`} fill sizes="(max-width: 450px) 66vw, 300px" />
              </div>
              <div className={styles.storyCardCopy}><small>{story.year}</small><h3>{story.title}</h3><p>{story.description}</p></div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const [copied, setCopied] = useState<number | null>(null);
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const message = encodeURIComponent(`Halo Admin Vistiq, saya ingin mengonfirmasi gift untuk undangan ${groom} & ${bride}.`);
  const copyAccount = async (accountNumber: string | null, index: number) => {
    if (!accountNumber) return;
    await navigator.clipboard?.writeText(accountNumber);
    setCopied(index);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="gift" className={styles.giftSection}>
      <div className={styles.giftPanel}>
        <div className={styles.giftCard}>
          <div className={styles.scriptHeading}><span>Wedding</span><em>Gift</em></div>
          <p>Tanpa mengurangi rasa hormat, bagi rekan-rekan dan sahabat yang hendak memberikan tanda kasih untuk kami, dapat melalui nomor rekening di bawah ini.</p>
          <div className={styles.accounts}>
            {invitation.gifts.length ? invitation.gifts.map((account, index) => (
              <article key={`${account.owner}-${index}`}>
                <small>{account.bankName || "Bank"}</small>
                <strong>{account.accountNumber || "Nomor rekening belum diisi"}</strong>
                <span>{account.accountName || account.owner}</span>
                {account.accountNumber ? <button type="button" onClick={() => void copyAccount(account.accountNumber, index)}><Icon name="copy" /> {copied === index ? "Tersalin" : "Copy Rekening"}</button> : null}
              </article>
            )) : <p className={styles.emptyGift}>Informasi rekening akan ditampilkan di sini.</p>}
          </div>
        </div>
        <div className={styles.confirmCard}>
          <div className={styles.scriptHeading}><span>Gift</span><em>Confirm</em></div>
          <p>Mohon konfirmasi untuk pengiriman gift. Terima kasih atas perhatian dan tanda kasih Anda.</p>
          <a href={`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`} target="_blank" rel="noreferrer"><Icon name="chat" /> Konfirmasi via WhatsApp</a>
        </div>
      </div>
    </section>
  );
}

function RsvpAndWishes({ invitation }: { invitation: InvitationData }) {
  const { entries, submit, submitting, submitted, counts, hasMore, loadMore } = useRsvpWishes(invitation.id);
  const [rsvpName, setRsvpName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [guestCount, setGuestCount] = useState("1");
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishAttendance, setWishAttendance] = useState<Attendance>("Hadir");
  const [error, setError] = useState("");

  const sendRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!rsvpName.trim()) { setError("Nama wajib diisi."); return; }
    const result = await submit({ name: rsvpName.trim(), whatsapp: "", attendance, message: `Konfirmasi kehadiran: ${guestCount} orang.` });
    if (result.error) { setError(result.error); return; }
    setRsvpName("");
  };

  const sendWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!wishName.trim() || !wishMessage.trim()) { setError("Nama dan ucapan wajib diisi."); return; }
    const result = await submit({ name: wishName.trim(), whatsapp: "", attendance: wishAttendance, message: wishMessage.trim() });
    if (result.error) { setError(result.error); return; }
    setWishName("");
    setWishMessage("");
    setWishAttendance("Hadir");
  };

  return (
    <>
      <section id="rsvp" className={styles.rsvpSection}>
        <div className={styles.rsvpCard}>
          <h2>RSVP</h2>
          <p>Bantu kami mempersiapkan jamuan yang hangat untuk Anda semua dengan mengirimkan konfirmasi kehadiran melalui form berikut ini.</p>
          <form onSubmit={sendRsvp}>
            <label>Nama *<input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} placeholder="Nama" required /></label>
            <label>Konfirmasi Kehadiran *<select value={attendance} onChange={(event) => setAttendance(event.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label>
            <label>Jumlah *<select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}><option value="1">1 Orang</option><option value="2">2 Orang</option></select></label>
            <button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Submit"}</button>
          </form>
          <div className={styles.rsvpStats}><span><b>{counts.hadir}</b> Hadir</span><span><b>{counts.tidakHadir}</b> Tidak Hadir</span><span><b>{counts.raguRagu}</b> Ragu</span></div>
          {error ? <small className={styles.formError}>{error}</small> : null}
        </div>
      </section>

      <section id="wishes" className={styles.wishesSection}>
        <div className={styles.wishesCard}>
          <div className={styles.scriptHeading}><span>Ucapan</span><em>Doa</em></div>
          <p>Berikan harapan dan doa tulus Anda di sini karena kami sangat bersemangat untuk memulai perjalanan baru bersama.</p>
          <form onSubmit={sendWish}>
            <input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Nama" aria-label="Nama" required />
            <select value={wishAttendance} onChange={(event) => setWishAttendance(event.target.value as Attendance)} aria-label="Konfirmasi kehadiran">
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
            <textarea value={wishMessage} onChange={(event) => setWishMessage(event.target.value)} placeholder="Ucapan dan doa" aria-label="Ucapan dan doa" rows={3} required />
            <button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Ucapan"}</button>
          </form>
          {submitted ? <small className={styles.formSuccess}>Ucapan Anda sudah terkirim.</small> : null}
          <div className={styles.wishList}>
            {entries.map((entry) => <article key={entry.id}><i>{entry.name.slice(0, 1).toUpperCase()}</i><div><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></div></article>)}
            {!entries.length ? <p className={styles.emptyWishes}>Comments are closed — jadilah yang pertama mengirim doa terbaik.</p> : null}
          </div>
          {hasMore ? <button type="button" className={styles.moreWishes} onClick={loadMore}>Lihat ucapan lainnya</button> : null}
        </div>
      </section>
    </>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = invitation.gallery[4] || invitation.coverImage || `${ASSET}ai-footer.jpg`;
  return (
    <footer className={styles.footerSection}>
      <Image src={photo} alt={`${bride} dan ${groom}`} fill sizes="(max-width: 450px) 100vw, 450px" className={styles.footerPhoto} />
      <div className={styles.footerShade} />
      <motion.div className={styles.footerCopy} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.85, ease: revealEase }}>
        <p>Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
        <strong>Wassalamu’alaikum Wr. Wb.</strong>
        <small>Kami yang berbahagia</small>
        <h2>{bride} <em>&amp;</em> {groom}</h2>
      </motion.div>
    </footer>
  );
}

function BrandFooter({ invitation }: { invitation: InvitationData }) {
  const brandName = invitation.brand?.name || "Vistiq Invitation";
  return (
    <section className={styles.brandFooter} aria-label="Brand undangan">
      <div>
        <small>EXCLUSIVE WEB INVITATION</small>
        <strong>{brandName}</strong>
        <p>Dibuat dengan penuh cinta untuk hari yang istimewa.</p>
        {!invitation.brand ? (
          <div className={styles.brandFooterLinks}>
            <a href="https://instagram.com/vistiqinvitation" target="_blank" rel="noreferrer">Instagram</a>
            <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const nav: [string, IconName, string][] = [
  ["home", "home", "Home"],
  ["couple", "couple", "Mempelai"],
  ["event", "calendar", "Acara"],
  ["gallery", "gallery", "Galeri"],
  ["story", "heart", "Cerita"],
  ["rsvp", "chat", "RSVP"],
  ["gift", "gift", "Hadiah"],
];

function FloatingControls({ isPlaying, toggle }: { isPlaying: boolean; toggle: () => void }) {
  return (
    <div className={styles.floatingControls}>
      <button type="button" aria-label={isPlaying ? "Jeda musik" : "Putar musik"} onClick={() => void toggle()} className={isPlaying ? styles.musicActive : ""}>
        <Icon name="music" />
      </button>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Navigasi undangan">
      {nav.map(([id, icon, label]) => <a href={`#${id}`} key={id} aria-label={label}><Icon name={icon} /></a>)}
    </nav>
  );
}

export default function LuxuryArtSoft({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const [contentReady, setContentReady] = useState(() => opened);
  const [showNavigation, setShowNavigation] = useState(false);
  const fallbackMusic = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    if (!opened) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const hero = document.querySelector<HTMLElement>('[data-opening-hero]');
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowNavigation(!entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [opened]);

  const openInvitation = async () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setOpened(true);
    setContentReady(true);
    if (invitation.musicUrl && !fallbackMusic.current) {
      fallbackMusic.current = true;
      try { await toggle(); } catch { /* the music button remains available */ }
    }
  };

  return (
    <main className={styles.root}>
      <div className={styles.invitation}>
        {invitation.musicUrl ? <audio ref={audioRef} src={invitation.musicUrl} loop preload="none" /> : null}
        <div id="home" className={`${styles.content} ${contentReady ? styles.contentVisible : styles.contentHidden}`} aria-hidden={!contentReady}>
          <Hero invitation={invitation} />
          <Couple invitation={invitation} />
          <QuoteCountdown invitation={invitation} />
          <Events invitation={invitation} />
          <WeddingVideo invitation={invitation} />
          <Gallery invitation={invitation} />
          <Story invitation={invitation} />
          <Gift invitation={invitation} />
          <RsvpAndWishes invitation={invitation} />
          <Footer invitation={invitation} />
          <BrandFooter invitation={invitation} />
        </div>
        <AnimatePresence onExitComplete={() => setContentReady(true)}>{!opened ? <Cover invitation={invitation} onOpen={() => void openInvitation()} /> : null}</AnimatePresence>
        {contentReady && showNavigation ? <><FloatingControls isPlaying={isPlaying} toggle={toggle} /><BottomNav /></> : null}
      </div>
    </main>
  );
}
