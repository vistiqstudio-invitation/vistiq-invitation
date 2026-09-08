"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { EventItem, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ASSET = "/themes/azure-bloom/";
const OPENING_MOTION_VIDEO = `${ASSET}opening-motion.mp4`;
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

function imageSource(value: string | null | undefined, fallback: string) {
  const source = value?.split("#", 1)[0]?.trim();
  return source || fallback;
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

function fallbackPhotos(invitation: InvitationData) {
  const supplied = invitation.gallery.filter(Boolean).map((photo) => imageSource(photo, ""));
  const defaults = [
    `${ASSET}gallery-01.webp`,
    `${ASSET}gallery-02.webp`,
    `${ASSET}gallery-03.webp`,
    `${ASSET}gallery-04.webp`,
    `${ASSET}gallery-05.webp`,
    `${ASSET}gallery-06.webp`,
    imageSource(invitation.bride.photo, `${ASSET}gallery-02.webp`),
    imageSource(invitation.groom.photo, `${ASSET}gallery-03.webp`),
  ];
  return (supplied.length ? supplied : defaults).filter(Boolean);
}

function Floral({ name, className, priority = false }: { name: string; className: string; priority?: boolean }) {
  return (
    <Image
      src={`${ASSET}${name}`}
      alt=""
      fill
      priority={priority}
      sizes="(max-width: 500px) 100vw, 500px"
      unoptimized
      className={`${styles.floral} ${className}`}
    />
  );
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const cover = imageSource(invitation.coverImage, "/photos/luxury-art-love-paradise/couple-cover.webp");

  return (
    <motion.section
      className={styles.coverLayer}
      exit={{ opacity: 0, scale: 1.025, y: -18 }}
      transition={{ duration: 0.95, ease: revealEase }}
    >
      <div className={styles.cover}>
        <Image src={cover} alt="" fill priority sizes="(max-width: 500px) 100vw, 500px" unoptimized className={styles.coverPhoto} />
        <div className={styles.coverWash} />
        <Floral name="floral-left.png" className={styles.coverFloralLeft} priority />
        <Floral name="floral-right.webp" className={styles.coverFloralRight} priority />
        <Floral name="floral-bottom.webp" className={styles.coverFloralBottom} priority />

        <div className={styles.coverCopy}>
          <Image src={`${ASSET}bismillah.svg`} alt="Bismillah" width={130} height={43} unoptimized className={styles.bismillah} />
          <p>The Wedding of</p>
          <h1>
            <span>{bride}</span>
            <em>&amp;</em>
            <span>{groom}</span>
          </h1>
          <div className={styles.coverRule}><i /><b>✦</b><i /></div>
        </div>

        <div className={styles.coverGuest}>
          <span>Kepada Yth.</span>
          <strong>{guest}</strong>
          <small>di tempat</small>
          <button type="button" onClick={onOpen}>
            <Icon name="mail" /> Buka Undangan
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function CssOpeningMotion() {
  return (
    <div className={styles.cssMotion} aria-hidden="true">
      <span className={styles.motionOrb} />
      <Floral name="floral-bottom.webp" className={styles.motionFloralBottom} priority />
      <Floral name="floral-left.png" className={styles.motionFloralLeft} priority />
      <Floral name="floral-right.webp" className={styles.motionFloralRight} priority />
      <Floral name="floral-top.webp" className={styles.motionFloralTop} priority />
      <div className={`${styles.motionPetal} ${styles.motionPetalOne}`} />
      <div className={`${styles.motionPetal} ${styles.motionPetalTwo}`} />
      <div className={`${styles.motionPetal} ${styles.motionPetalThree}`} />
    </div>
  );
}

function OpeningMotion({ poster, onComplete }: { poster: string; onComplete: () => void }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (videoReady || !videoFailed) return;
    const timer = window.setTimeout(onComplete, 4800);
    return () => window.clearTimeout(timer);
  }, [onComplete, videoFailed, videoReady]);

  return (
    <motion.div
      className={styles.motionLayer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      role="status"
      aria-live="polite"
    >
      <div className={styles.motionPanel}>
        {!videoFailed ? (
          <video
            className={`${styles.motionVideo} ${videoReady ? styles.motionVideoVisible : styles.motionVideoHidden}`}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={poster}
            onLoadedData={() => setVideoReady(true)}
            onEnded={onComplete}
            onError={() => setVideoFailed(true)}
          >
            <source src={OPENING_MOTION_VIDEO} type="video/mp4" />
          </video>
        ) : null}
        {!videoReady || videoFailed ? (
          <CssOpeningMotion />
        ) : null}
        <div className={styles.motionVignette} />
        <div className={styles.motionCaption}>
          <span className={styles.motionMark}>A <i>&amp;</i> R</span>
          <span>Menyiapkan undangan</span>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <motion.header
      className={`${styles.sectionHeading} ${light ? styles.sectionHeadingLight : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: revealEase }}
    >
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <div className={styles.headingRule}><i /><b>✦</b><i /></div>
    </motion.header>
  );
}

function Hero({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const date = eventDateParts(invitation.events[0]);
  const dateLabel = date.weekday
    ? `${date.weekday}, ${date.day} ${date.month} ${date.year}`
    : invitation.events[0]?.date || "Save the date";
  const photo = imageSource(invitation.gallery[0], imageSource(invitation.bride.photo, "/photos/luxury-art-love-paradise/hero.webp"));

  return (
    <section id="home" className={styles.hero} aria-label="Halaman pembuka undangan">
      <div className={styles.heroPaper} />
      <Floral name="floral-top.webp" className={styles.heroFloralTop} priority />
      <Floral name="floral-right.webp" className={styles.heroFloralRight} priority />
      <Floral name="floral-bottom.webp" className={styles.heroFloralBottom} priority />
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: revealEase, delay: 0.15 }}
      >
        <p className={styles.heroEyebrow}>THE WEDDING OF</p>
        <div className={styles.heroNames}>
          <strong>{bride}</strong>
          <em>&amp;</em>
          <strong>{groom}</strong>
        </div>
        <div className={styles.heroRule}><i /><b>✦</b><i /></div>
        <div className={styles.heroPhoto}>
          <Image src={photo} alt={`${bride} dan ${groom}`} fill sizes="190px" unoptimized />
          <span aria-hidden="true" />
        </div>
        <time>{dateLabel}</time>
        <span className={styles.scrollHint}>Scroll to explore <b>↓</b></span>
      </motion.div>
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
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: revealEase }}
    >
      <div className={styles.personPhoto}>
        <Image src={photo} alt={person.name} fill sizes="(max-width: 500px) 56vw, 270px" unoptimized />
        <div className={styles.personPhotoFrame} />
        <Floral name={reverse ? "floral-corner.webp" : "floral-branch.webp"} className={styles.personFloral} />
      </div>
      <div className={styles.personCopy}>
        <span>{role}</span>
        <h3>{person.name}</h3>
        {person.parents ? <p>{person.parents}</p> : null}
        {person.instagram ? (
          <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
            <span className={styles.socialMark}>◎</span> Instagram
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const bridePhoto = imageSource(invitation.bride.photo, fallbackPhotos(invitation)[0]);
  const groomPhoto = imageSource(invitation.groom.photo, fallbackPhotos(invitation)[1] || fallbackPhotos(invitation)[0]);
  const description = invitation.opening.description || "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.";

  return (
    <section id="mempelai" className={styles.coupleSection}>
      <Floral name="floral-left.png" className={styles.sectionFloralLeft} />
      <Floral name="floral-right.webp" className={styles.sectionFloralRight} />
      <SectionTitle eyebrow="Mempelai" title="The Couple" />
      <motion.p
        className={styles.coupleIntro}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        {invitation.opening.greeting || "Assalamu’alaikum Warahmatullahi Wabarakatuh"}
        <br />
        {description}
      </motion.p>
      <div className={styles.peopleGrid}>
        <PersonCard person={invitation.bride} role="THE BRIDE" photo={bridePhoto} />
        <div className={styles.andSeal} aria-hidden="true">&amp;</div>
        <PersonCard person={invitation.groom} role="THE GROOM" photo={groomPhoto} reverse />
      </div>
    </section>
  );
}

function Countdown({ invitation }: { invitation: InvitationData }) {
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
  const saveDate = googleCalendarHref(event);
  const quote = invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.";
  const source = invitation.opening.quoteSource || "QS. Ar-Rum : 21";
  const background = imageSource(invitation.gallery[2], "/photos/luxury-art-love-paradise/gallery-03.webp");

  return (
    <section id="countdown" className={styles.countdownSection}>
      <Image src={background} alt="" fill sizes="(max-width: 500px) 100vw, 500px" unoptimized className={styles.countdownPhoto} />
      <div className={styles.countdownShade} />
      <Floral name="floral-bottom.webp" className={styles.countdownFloral} />
      <motion.div
        className={styles.countdownContent}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: revealEase }}
      >
        <span className={styles.quoteSymbol}>“</span>
        <blockquote>{quote}</blockquote>
        <cite>— {source}</cite>
        <div className={styles.countdownGrid}>
          {values.map((value, index) => (
            <span key={index}>
              <strong>{value}</strong>
              <small>{["Hari", "Jam", "Menit", "Detik"][index]}</small>
            </span>
          ))}
        </div>
        {saveDate ? (
          <a className={styles.saveDate} href={saveDate} target="_blank" rel="noreferrer">
            <Icon name="calendar" /> Simpan ke Kalender
          </a>
        ) : null}
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: revealEase }}
    >
      <span className={styles.eventNumber}>0{reverse ? 2 : 1}</span>
      <div className={styles.eventCardInner}>
        <p className={styles.eventType}>{event.name}</p>
        <h3>{date.weekday ? `${date.weekday}, ${date.day} ${date.month} ${date.year}` : event.date}</h3>
        {event.time ? <strong>{event.time}</strong> : null}
        <div className={styles.eventDivider}><i /><b>✦</b><i /></div>
        {event.location ? <p className={styles.eventLocation}>{event.location}</p> : null}
        {mapHref ? <a href={mapHref} target="_blank" rel="noreferrer"><Icon name="pin" /> Lihat Lokasi</a> : null}
      </div>
    </motion.article>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  const events = invitation.events.slice(0, 2);

  return (
    <section id="date" className={styles.eventsSection}>
      <Floral name="floral-branch.webp" className={styles.eventsFloralLeft} />
      <Floral name="floral-corner.webp" className={styles.eventsFloralRight} />
      <SectionTitle eyebrow="Save The Date" title="Wedding Event" light />
      <div className={styles.eventsGrid}>
        {(events.length ? events : [{ name: "Wedding Event", date: "", rawDate: null, time: "", location: "" }]).map((event, index) => (
          <EventCard key={`${event.name}-${event.date}-${index}`} event={event} reverse={index === 1} mapsUrl={invitation.mapsUrl} />
        ))}
      </div>
    </section>
  );
}

function LiveStreaming({ invitation }: { invitation: InvitationData }) {
  const videoUrl = isExternalUrl(invitation.videoUrl) ? invitation.videoUrl : null;
  const background = imageSource(invitation.gallery[3], "/photos/luxury-art-love-paradise/gallery-04.webp");

  return (
    <section id="live" className={styles.liveSection}>
      <Image src={background} alt="" fill sizes="(max-width: 500px) 100vw, 500px" unoptimized className={styles.livePhoto} />
      <div className={styles.liveShade} />
      <motion.div
        className={styles.liveContent}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: revealEase }}
      >
        <span className={styles.liveEyebrow}>Our Special Moment</span>
        <h2>Live Streaming</h2>
        <p>Saksikan momen akad dan resepsi kami dari mana pun Anda berada.</p>
        {videoUrl ? (
          <a href={videoUrl} target="_blank" rel="noreferrer"><Icon name="play" /> Saksikan Sekarang</a>
        ) : (
          <span className={styles.livePending}>Link streaming akan ditampilkan di sini</span>
        )}
      </motion.div>
    </section>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const photos = fallbackPhotos(invitation).slice(0, 8);
  const lead = photos[0] || "/photos/luxury-art-love-paradise/hero.webp";

  return (
    <section id="galeri" className={styles.gallerySection}>
      <div className={styles.galleryLead}>
        <Image src={lead} alt="" fill sizes="(max-width: 500px) 100vw, 500px" unoptimized />
        <div className={styles.galleryLeadShade} />
        <motion.div
          className={styles.galleryLeadCopy}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: revealEase }}
        >
          <span>Our</span>
          <strong>Gallery</strong>
        </motion.div>
      </div>
      <div className={styles.galleryShelf}>
        {photos.map((photo, index) => (
          <motion.button
            type="button"
            key={`${photo}-${index}`}
            className={index === 0 || index === 5 ? styles.galleryWide : ""}
            onClick={() => setActive(index)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.045, duration: 0.55, ease: revealEase }}
          >
            <Image src={photo} alt={`Galeri foto ${index + 1}`} fill sizes="(max-width: 500px) 28vw, 140px" unoptimized />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null ? (
          <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <button type="button" aria-label="Tutup galeri">×</button>
            <div onClick={(event) => event.stopPropagation()}>
              <Image src={photos[active]} alt="Foto galeri" fill sizes="90vw" unoptimized />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

const defaultStories = [
  { year: "2019", title: "Awal Cerita", description: "Satu pertemuan sederhana mempertemukan dua langkah yang sebelumnya berjalan sendiri-sendiri." },
  { year: "2021", title: "Saling Mengenal", description: "Kami belajar mendengar, bertumbuh, dan menemukan rumah di dalam percakapan-percakapan kecil." },
  { year: "2025", title: "Lamaran", description: "Dengan restu kedua keluarga, kami mantap memilih satu sama lain untuk perjalanan yang lebih panjang." },
  { year: "2026", title: "Menuju Hari Bahagia", description: "Kini kami siap mengikat janji dan memulai babak baru dengan penuh syukur." },
];

function Story({ invitation }: { invitation: InvitationData }) {
  const stories = invitation.story.length ? invitation.story.slice(0, 5) : defaultStories;
  const photos = fallbackPhotos(invitation);

  return (
    <section id="story" className={styles.storySection}>
      <Floral name="floral-left.png" className={styles.storyFloralLeft} />
      <Floral name="floral-bottom.webp" className={styles.storyFloralBottom} />
      <SectionTitle eyebrow="A little piece of" title="Our Story" />
      <div className={styles.storyTimeline}>
        <span className={styles.timelineLine} aria-hidden="true" />
        {stories.map((story, index) => (
          <motion.article
            key={`${story.year}-${story.title}`}
            className={index % 2 ? styles.storyItemReverse : ""}
            initial={{ opacity: 0, x: index % 2 ? 18 : -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.06, duration: 0.65, ease: revealEase }}
          >
            <i>♥</i>
            <div className={styles.storyCard}>
              <div className={styles.storyPhoto}>
                <Image src={photos[index % photos.length]} alt={`Momen ${story.title}`} fill sizes="(max-width: 500px) 31vw, 150px" unoptimized />
              </div>
              <div className={styles.storyCopy}>
                <small>{story.year}</small>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
              </div>
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
      <Floral name="floral-right.webp" className={styles.giftFloralRight} />
      <div className={styles.giftPanel}>
        <SectionTitle eyebrow="A little token" title="Wedding Gift" />
        <p className={styles.giftIntro}>Tanpa mengurangi rasa hormat, bagi rekan-rekan dan sahabat yang hendak memberikan tanda kasih untuk kami, dapat melalui nomor rekening berikut.</p>
        <div className={styles.accounts}>
          {invitation.gifts.length ? invitation.gifts.map((account, index) => (
            <article key={`${account.owner}-${index}`}>
              <small>{account.bankName || "Bank"}</small>
              <strong>{account.accountNumber || "Nomor rekening belum diisi"}</strong>
              <span>{account.accountName || account.owner}</span>
              {account.accountNumber ? (
                <button type="button" onClick={() => void copyAccount(account.accountNumber, index)}>
                  <Icon name="copy" /> {copied === index ? "Tersalin" : "Copy Rekening"}
                </button>
              ) : null}
            </article>
          )) : <p className={styles.emptyGift}>Informasi rekening akan ditampilkan di sini.</p>}
        </div>
        <div className={styles.giftConfirm}>
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
    <section id="ucapan" className={styles.rsvpSection}>
      <div className={styles.rsvpCard}>
        <div className={styles.rsvpColumn}>
          <SectionTitle eyebrow="Please join us" title="RSVP" />
          <p className={styles.formIntro}>Bantu kami mempersiapkan hari bahagia dengan mengirimkan konfirmasi kehadiran melalui form berikut.</p>
          <form onSubmit={sendRsvp}>
            <label>Nama *<input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} placeholder="Nama" required /></label>
            <label>Konfirmasi Kehadiran *<select value={attendance} onChange={(event) => setAttendance(event.target.value as Attendance)}><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label>
            <label>Jumlah Tamu *<select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}><option value="1">1 Orang</option><option value="2">2 Orang</option></select></label>
            <button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim RSVP"}</button>
          </form>
          <div className={styles.rsvpStats}><span><b>{counts.hadir}</b> Hadir</span><span><b>{counts.tidakHadir}</b> Tidak Hadir</span><span><b>{counts.raguRagu}</b> Ragu</span></div>
        </div>

        <div className={styles.wishesColumn}>
          <SectionTitle eyebrow="Leave a note" title="Ucapan & Doa" />
          <p className={styles.formIntro}>Kirimkan doa terbaik untuk kami di awal perjalanan baru ini.</p>
          <form onSubmit={sendWish}>
            <input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Nama" aria-label="Nama" required />
            <select value={wishAttendance} onChange={(event) => setWishAttendance(event.target.value as Attendance)} aria-label="Konfirmasi kehadiran"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select>
            <textarea value={wishMessage} onChange={(event) => setWishMessage(event.target.value)} placeholder="Ucapan dan doa" aria-label="Ucapan dan doa" rows={3} required />
            <button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Ucapan"}</button>
          </form>
          {error ? <small className={styles.formError}>{error}</small> : null}
          {submitted ? <small className={styles.formSuccess}>Ucapan Anda sudah terkirim.</small> : null}
          <div className={styles.wishList}>
            {entries.map((entry) => <article key={entry.id}><i>{entry.name.slice(0, 1).toUpperCase()}</i><div><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></div></article>)}
            {!entries.length ? <p className={styles.emptyWishes}>Jadilah yang pertama mengirim doa terbaik.</p> : null}
          </div>
          {hasMore ? <button type="button" className={styles.moreWishes} onClick={loadMore}>Lihat ucapan lainnya</button> : null}
        </div>
      </div>
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = firstName(invitation.bride.name, invitation.bride.nickname);
  const groom = firstName(invitation.groom.name, invitation.groom.nickname);
  const photo = imageSource(invitation.gallery[4], imageSource(invitation.coverImage, "/photos/luxury-art-love-paradise/gallery-05.webp"));

  return (
    <footer className={styles.footer}>
      <Image src={photo} alt={`${bride} dan ${groom}`} fill sizes="(max-width: 500px) 100vw, 500px" unoptimized className={styles.footerPhoto} />
      <div className={styles.footerShade} />
      <Floral name="floral-bottom.webp" className={styles.footerFloral} />
      <motion.div
        className={styles.footerCopy}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: revealEase }}
      >
        <p>Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
        <strong>Wassalamu’alaikum Wr. Wb.</strong>
        <small>Kami yang berbahagia</small>
        <h2>{bride} <em>&amp;</em> {groom}</h2>
        <span className={styles.footerBrand}>Azure Bloom · Vistiq Invitation</span>
      </motion.div>
    </footer>
  );
}

const nav: [string, IconName, string][] = [
  ["home", "home", "Home"],
  ["mempelai", "couple", "Mempelai"],
  ["date", "calendar", "Acara"],
  ["galeri", "gallery", "Galeri"],
  ["story", "heart", "Cerita"],
  ["ucapan", "chat", "Ucapan"],
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

export default function AzureBloom({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const [contentReady, setContentReady] = useState(() => opened);
  const [motionPlaying, setMotionPlaying] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const musicAttempted = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    if (!opened || motionPlaying) {
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
  }, [motionPlaying, opened]);

  useEffect(() => {
    if (!opened) return;
    const hero = document.querySelector<HTMLElement>('[data-azure-hero="true"]');
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowNavigation(!entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [opened]);

  const finishOpening = useCallback(() => {
    setMotionPlaying(false);
    setOpened(true);
    setContentReady(true);
    if (invitation.musicUrl && !musicAttempted.current) {
      musicAttempted.current = true;
      void toggle().catch(() => undefined);
    }
  }, [invitation.musicUrl, setOpened, toggle]);

  const openInvitation = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setMotionPlaying(true);
  };

  const poster = imageSource(invitation.coverImage, "/photos/luxury-art-love-paradise/couple-cover.webp");

  return (
    <main className={styles.root}>
      <div className={styles.invitation}>
        {invitation.musicUrl ? <audio ref={audioRef} src={invitation.musicUrl} loop preload="none" /> : null}
        <div className={`${styles.content} ${contentReady ? styles.contentVisible : styles.contentHidden}`} aria-hidden={!contentReady}>
          <div data-azure-hero="true"><Hero invitation={invitation} /></div>
          <Couple invitation={invitation} />
          <Countdown invitation={invitation} />
          <Events invitation={invitation} />
          <LiveStreaming invitation={invitation} />
          <Gallery invitation={invitation} />
          <Story invitation={invitation} />
          <Gift invitation={invitation} />
          <RsvpAndWishes invitation={invitation} />
          <Footer invitation={invitation} />
        </div>
        <AnimatePresence onExitComplete={() => setContentReady(true)}>
          {!opened && !motionPlaying ? <Cover invitation={invitation} onOpen={openInvitation} /> : null}
        </AnimatePresence>
        <AnimatePresence>
          {motionPlaying ? <OpeningMotion poster={poster} onComplete={finishOpening} /> : null}
        </AnimatePresence>
        {contentReady && showNavigation ? <><FloatingControls isPlaying={isPlaying} toggle={toggle} /><BottomNav /></> : null}
      </div>
    </main>
  );
}
