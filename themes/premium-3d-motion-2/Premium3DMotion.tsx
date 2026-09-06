"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { CSSProperties, FormEvent } from "react";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const ASSET_ROOT = "/themes/premium-3d-motion-2";
const REFERENCE_COVER = ASSET_ROOT + "/naya-farhan-couple-white.jpg";
const REFERENCE_VIDEO = ASSET_ROOT + "/opening-nayla-farhan.mp4";
const REFERENCE_FALLBACK = ASSET_ROOT + "/naya-farhan-bride.jpg";
const REFERENCE_OVERLAY = ASSET_ROOT + "/Garden-02-Overlay.jpg";
const REFERENCE_GALLERY = [
  ASSET_ROOT + "/naya-farhan-gallery-courtyard.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-conservatory.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-staircase.jpg",
  ASSET_ROOT + "/naya-farhan-gallery-flower-studio.jpg",
];
const REFERENCE_SLIDES = REFERENCE_GALLERY;
const MANDIRI_ICON =
  "https://undanganqu.net/wp-content/uploads/2024/11/iconmandiri-1.png.webp";
const FOOTER_LOGO = "/vistiq-invitation-logo.png";
const MANUAL_SCROLL_EVENT = "vistiq:auto-scroll-start";
const FRAME_REVEAL_AT = 9;

const revealEase = [0.22, 1, 0.36, 1] as const;

const heroCopyVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.07,
    },
  },
};

const heroCopyItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: revealEase },
  },
};

const scrollItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(delay, 0.28), duration: 0.52, ease: revealEase },
  }),
};

const scrollImageVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: Math.min(delay, 0.3), duration: 0.64, ease: revealEase },
  }),
};

const scrollViewport = { once: true, amount: 0.06 } as const;
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "agu",
  "sep",
  "okt",
  "nov",
  "des",
];

type IconName =
  | "calendar"
  | "chat"
  | "close"
  | "copy"
  | "envelope"
  | "gift"
  | "home"
  | "instagram"
  | "music"
  | "pin"
  | "play"
  | "couple"
  | "gallery"
  | "heart";

function bg(url?: string | null): CSSProperties {
  return url ? { backgroundImage: 'url("' + url + '")' } : {};
}

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
          <path
            {...line}
            d="M3.8 19v-2.3A4.2 4.2 0 0 1 8 12.5a4 4 0 0 1 4 4V19M12 19v-2.5a4 4 0 0 1 8 0V19"
          />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect {...line} x="3.5" y="5" width="17" height="15" rx="2" />
          <path {...line} d="M7 3v4M17 3v4M3.5 9.5h17M8 13h3v3H8z" />
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
        <path
          {...line}
          d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z"
        />
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
          <path
            {...line}
            d="M2.8 6.5h18.4V10H2.8zM12 6.5V20M12 6.5C8.5 6.5 7 5.5 7 3.9 7 2.7 8 2 9.1 2 10.8 2 12 4 12 6.5Zm0 0c3.5 0 5-1 5-2.6C17 2.7 16 2 14.9 2 13.2 2 12 4 12 6.5Z"
          />
        </>
      )}
      {name === "music" && (
        <>
          <path {...line} d="M9 18V5l10-2v13" />
          <circle {...line} cx="6" cy="18" r="3" />
          <circle {...line} cx="16" cy="16" r="3" />
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
      {name === "envelope" && (
        <>
          <rect {...line} x="3" y="5.5" width="18" height="13" rx="2.2" />
          <path {...line} d="m4.5 7 7.5 6 7.5-6" />
        </>
      )}
      {name === "instagram" && (
        <>
          <rect {...line} x="4" y="4" width="16" height="16" rx="4" />
          <circle {...line} cx="12" cy="12" r="3.4" />
          <circle fill="currentColor" cx="17.2" cy="6.8" r="1" />
        </>
      )}
      {name === "play" && <path fill="currentColor" d="m8 5 11 7-11 7V5Z" />}
      {name === "close" && <path {...line} d="m6 6 12 12M18 6 6 18" />}
    </svg>
  );
}

function firstName(person: InvitationData["bride"] | InvitationData["groom"]) {
  return person.nickname || person.name.trim().split(/\s+/)[0] || person.name;
}

function handleName(person: InvitationData["bride"] | InvitationData["groom"]) {
  return person.name.trim() || firstName(person);
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function instagramUrl(value: string) {
  return "https://www.instagram.com/" + value.replace(/^@/, "");
}

function shortDate(rawDate: string | null, readableDate: string) {
  const parsed = rawDate ? new Date(rawDate) : new Date(readableDate);
  if (Number.isNaN(parsed.getTime())) return readableDate;
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear()).slice(-2);
  return day + " / " + month + " / " + year;
}

function eventDateParts(event: InvitationData["events"][number]) {
  const parsed = event.rawDate ? new Date(event.rawDate) : new Date(event.date);
  if (Number.isNaN(parsed.getTime())) {
    return { weekday: event.date.split(",")[0] || "minggu", date: event.date };
  }
  return {
    weekday: parsed.toLocaleDateString("id-ID", { weekday: "long" }),
    date:
      String(parsed.getDate()).padStart(2, "0") +
      " / " +
      MONTHS[parsed.getMonth()] +
      " / " +
      parsed.getFullYear(),
  };
}

function eventLocation(location: string) {
  const [venue, ...address] = location.split(",");
  return {
    venue: venue?.trim() || "Lokasi acara",
    address: address.join(",").trim(),
  };
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";

  return (
    <motion.section className={styles.cover} exit={{ y: "-100%" }} transition={{ duration: 1.2, ease: revealEase }}>
      <div className={styles.coverBackground} style={bg(invitation.bride.photo || REFERENCE_FALLBACK)} />
      <div className={styles.coverShade} />
      <div className={styles.coverGardenOverlay} aria-hidden="true" />
      <div className={`${styles.coverFloral} ${styles.coverFloralRight}`} aria-hidden="true" />
      <div className={styles.coverPortraitPair}>
        <div className={`${styles.coverPortraitFrame} ${styles.coverPortraitCouple}`}>
          <div
            className={styles.coverPortrait}
            style={bg(invitation.coverImage || REFERENCE_COVER)}
          />
        </div>
      </div>
      <div className={styles.coverFrame} />
      <div className={styles.coverStack}>
        <motion.p
          className={styles.coverEyebrow}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          The Wedding of
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {firstName(invitation.bride)} &amp; {firstName(invitation.groom)}
        </motion.h1>
        <motion.div
          className={styles.coverGuest}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <p>Kepada Yth:</p>
          <strong>{guest}</strong>
          <button type="button" onClick={onOpen}>
            <Icon name="envelope" /> Buka Undangan
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function OpeningHero({ invitation, opened }: { invitation: InvitationData; opened: boolean }) {
  const event = invitation.events[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!opened) {
      setFrameReady(false);
      video?.pause();
      if (video && video.readyState > 0) video.currentTime = 0;
      return;
    }

    if (video) {
      void video.play().catch(() => {
        // The poster remains visible if the browser blocks video playback.
      });
    }
  }, [opened]);

  function revealAfterWhiteFrame() {
    const video = videoRef.current;
    if (video && video.currentTime >= FRAME_REVEAL_AT) {
      setFrameReady(true);
    }
  }

  return (
    <section id="home" data-opening-hero className={styles.hero}>
      <div className={styles.heroFallback} style={bg(REFERENCE_FALLBACK)} />
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted
        playsInline
        poster={REFERENCE_FALLBACK}
        onTimeUpdate={revealAfterWhiteFrame}
        aria-hidden="true"
      >
        <source src={REFERENCE_VIDEO} type="video/mp4" />
      </video>
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        {frameReady && (
          <motion.div
            className={styles.heroCopyReveal}
            variants={heroCopyVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={heroCopyItemVariants}>The Wedding of</motion.p>
            <motion.h2 variants={heroCopyItemVariants}>{firstName(invitation.bride)}</motion.h2>
            <motion.span variants={heroCopyItemVariants}>&amp;</motion.span>
            <motion.h2 variants={heroCopyItemVariants}>{firstName(invitation.groom)}</motion.h2>
            <motion.small variants={heroCopyItemVariants}>
              {shortDate(event?.rawDate || null, event?.date || "")}
            </motion.small>
          </motion.div>
        )}
        {frameReady && (
          <motion.button
            type="button"
            className={styles.scrollMouse}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.78, duration: 0.8, ease: revealEase }}
            onClick={() => window.dispatchEvent(new Event(MANUAL_SCROLL_EVENT))}
            aria-label="Mulai scroll otomatis"
            title="Mulai scroll otomatis"
          >
            <span />
          </motion.button>
        )}
      </div>
    </section>
  );
}

function Quote({ invitation }: { invitation: InvitationData }) {
  const quote =
    invitation.opening.quote ||
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
  const source = invitation.opening.quoteSource || "QS. Ar-Rum : 21";
  return (
    <section id="quote" className={styles.quoteSection}>
      <div className={styles.quotePhoto}>
        <motion.div
          className={`${styles.quotePhotoPortrait} ${styles.quotePhotoCouple}`}
          style={bg(invitation.coverImage || REFERENCE_COVER)}
          variants={scrollImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0}
        />
      </div>
      <SectionReveal className={styles.quoteCard}>
        <motion.div
          className={styles.quoteMonogram}
          variants={scrollItemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0.08}
        >
          <span>{initials(firstName(invitation.bride)).slice(0, 1)}</span>
          <i>&amp;</i>
          <span>{initials(firstName(invitation.groom)).slice(0, 1)}</span>
        </motion.div>
        <motion.blockquote
          variants={scrollItemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0.18}
        >
          <motion.p variants={scrollItemVariants} custom={0.08}>
            "{quote}"
          </motion.p>
          <motion.cite variants={scrollItemVariants} custom={0.16}>
            - {source} -
          </motion.cite>
        </motion.blockquote>
      </SectionReveal>
    </section>
  );
}

function Welcome({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="welcome" className={styles.welcomeSection}>
      <SectionReveal className={styles.welcomeInner}>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          We Are<br />Getting Married!
        </motion.h2>
        <motion.p variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.18}>
          {invitation.opening.description ||
            "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:"}
        </motion.p>
      </SectionReveal>
    </section>
  );
}

function Person({
  person,
  role,
  fallback,
  floral,
  branch,
}: {
  person: InvitationData["bride"] | InvitationData["groom"];
  role: "bride" | "groom";
  fallback: string;
  floral: string;
  branch: string;
}) {
  const instagram = person.instagram?.replace(/^@/, "");
  const branchOffset = role === "bride" ? -46 : 46;
  const swayDirection = role === "bride" ? -1 : 1;
  return (
    <SectionReveal className={styles.personBlock}>
      <div className={styles.personStage}>
        <motion.div
          className={styles.personBranchMotion}
          initial={{ opacity: 0, x: branchOffset, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={scrollViewport}
          transition={{ delay: 0.68, duration: 0.9, ease: revealEase }}
        >
          <motion.div
            className={styles.personBranch}
            style={bg(branch)}
            initial={{ x: 0, y: 0, rotate: 0 }}
            whileInView={{
              x: [0, 1.4 * swayDirection, 0, -1.4 * swayDirection, 0],
              y: [0, -1, 0, 1, 0],
              rotate: [0, 0.35 * swayDirection, 0, -0.35 * swayDirection, 0],
            }}
            viewport={scrollViewport}
            transition={{ delay: 1.65, duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div
          className={styles.personPhoto}
          style={bg(person.photo || fallback)}
          variants={scrollImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0.3}
        />
        <motion.div
          className={styles.personFloral}
          variants={scrollImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0}
        >
          <motion.img
            className={styles.personFloralImage}
            src={floral}
            alt=""
            initial={{ x: 0, y: 0, rotate: 0 }}
            whileInView={{
              x: [0, -1.5 * swayDirection, 0, 1.5 * swayDirection, 0],
              y: [0, -1.2, 0, 1.2, 0],
              rotate: [0, 0.6 * swayDirection, 0, -0.6 * swayDirection, 0],
            }}
            viewport={scrollViewport}
            transition={{ delay: 1.05, duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      <motion.div
        className={styles.personText}
        variants={scrollItemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        custom={0.08}
      >
        <motion.span className={styles.personRole} variants={scrollItemVariants} custom={0.08}>
          The {role}
        </motion.span>
        <motion.h3 variants={scrollItemVariants} custom={0.16}>{firstName(person)}</motion.h3>
        <motion.p className={styles.personFullName} variants={scrollItemVariants} custom={0.24}>
          {handleName(person)}
        </motion.p>
        {person.parents && (
          <motion.p className={styles.personParents} variants={scrollItemVariants} custom={0.32}>
            {person.parents}
          </motion.p>
        )}
        {instagram && (
          <motion.a href={instagramUrl(instagram)} target="_blank" rel="noreferrer" variants={scrollItemVariants} custom={0.4}>
            <Icon name="instagram" /> @{instagram}
          </motion.a>
        )}
      </motion.div>
    </SectionReveal>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="couple" className={styles.coupleSection}>
      <Person
        person={invitation.bride}
        role="bride"
        fallback={REFERENCE_GALLERY[2]}
        branch={ASSET_ROOT + "/Garden-02-Couple-1.png.webp"}
        floral={ASSET_ROOT + "/Garden-02-Couple-2.png.webp"}
      />
      <motion.div
        className={styles.coupleAmpersand}
        variants={scrollItemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        custom={0.08}
      >
        &amp;
      </motion.div>
      <Person
        person={invitation.groom}
        role="groom"
        fallback={REFERENCE_GALLERY[3]}
        branch={ASSET_ROOT + "/Garden-02-Couple-2.png.webp"}
        floral={ASSET_ROOT + "/Garden-02-Couple-1.png.webp"}
      />
    </section>
  );
}

function MemorySlideshow() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % REFERENCE_SLIDES.length), 1500);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <motion.section
      className={styles.memorySection}
      aria-label="Momen pernikahan"
      initial={{ opacity: 0, scale: 1.02 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={scrollViewport}
      transition={{ duration: 1, ease: revealEase }}
    >
      {REFERENCE_SLIDES.map((slide, index) => (
        <div className={styles.memorySlide} key={slide} style={{ ...bg(slide), opacity: active === index ? 1 : 0 }} />
      ))}
      <div className={styles.memoryShade} />
    </motion.section>
  );
}

function Countdown({ event }: { event?: InvitationData["events"][number] }) {
  const target = useMemo(() => (event?.rawDate ? new Date(event.rawDate).getTime() : Number.NaN), [event?.rawDate]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const distance = now === null || Number.isNaN(target) ? null : Math.max(0, target - now);
  const values =
    distance === null
      ? [["--", "Hari"], ["--", "Jam"], ["--", "Menit"], ["--", "Detik"]]
      : [
          [String(Math.floor(distance / 86400000)).padStart(2, "0"), "Hari"],
          [String(Math.floor(distance / 3600000) % 24).padStart(2, "0"), "Jam"],
          [String(Math.floor(distance / 60000) % 60).padStart(2, "0"), "Menit"],
          [String(Math.floor(distance / 1000) % 60).padStart(2, "0"), "Detik"],
        ];
  return (
    <section id="countdown" className={styles.countdownSection}>
      <SectionReveal className={styles.countdownInner}>
        <motion.img
          src={ASSET_ROOT + "/Garden-02-Bouquet.png.webp"}
          alt=""
          className={styles.countdownBouquet}
          variants={scrollImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0}
        />
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.12}>
          Save The Date
        </motion.h2>
        <motion.div
          className={styles.countdownGrid}
          variants={scrollItemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0.2}
        >
          {values.map(([value, label], index) => (
            <motion.span
              key={label}
              variants={scrollItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              custom={0.1 + index * 0.08}
            >
              <strong>{value}</strong>
              <small>{label}</small>
            </motion.span>
          ))}
        </motion.div>
        <motion.p variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.28}>
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara pernikahan kami:
        </motion.p>
      </SectionReveal>
    </section>
  );
}

function EventCard({
  event,
  index,
  mapsUrl,
}: {
  event: InvitationData["events"][number];
  index: number;
  mapsUrl: string | null;
}) {
  const dates = eventDateParts(event);
  const location = eventLocation(event.location);
  return (
    <SectionReveal className={styles.eventOuter}>
      <motion.article
        className={styles.eventCard}
        style={bg(REFERENCE_OVERLAY)}
        variants={scrollImageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        custom={0}
      >
        <motion.div
          className={styles.eventCardInner}
          variants={scrollItemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0.08}
        >
          <motion.h3 variants={scrollItemVariants} custom={0.06}>{event.name || (index === 0 ? "Akad Nikah" : "Resepsi Pernikahan")}</motion.h3>
          <motion.p className={styles.eventWeekday} variants={scrollItemVariants} custom={0.14}>{dates.weekday}</motion.p>
          <motion.p className={styles.eventDate} variants={scrollItemVariants} custom={0.2}>{dates.date}</motion.p>
          <motion.p className={styles.eventTime} variants={scrollItemVariants} custom={0.26}>{event.time}</motion.p>
          <motion.span className={styles.eventIcon} variants={scrollItemVariants} custom={0.32}><Icon name="pin" /></motion.span>
          <motion.h4 variants={scrollItemVariants} custom={0.38}>{location.venue}</motion.h4>
          {location.address && <motion.p className={styles.eventAddress} variants={scrollItemVariants} custom={0.44}>{location.address}</motion.p>}
          {mapsUrl && (
            <motion.a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.pillButton} variants={scrollItemVariants} custom={0.5}>
              <Icon name="pin" /> Google Map
            </motion.a>
          )}
        </motion.div>
      </motion.article>
    </SectionReveal>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  const events = invitation.events.length
    ? invitation.events
    : [{ name: "Akad Nikah", date: "", rawDate: null, time: "", location: "" }];
  return (
    <section id="events" className={styles.eventsSection}>
      <div className={styles.eventList}>
        {events.map((event, index) => (
          <EventCard key={event.name + index} event={event} index={index} mapsUrl={invitation.mapsUrl} />
        ))}
      </div>
    </section>
  );
}

function LiveStreaming({ invitation }: { invitation: InvitationData }) {
  const accounts = [invitation.bride.instagram, invitation.groom.instagram].filter(Boolean) as string[];
  return (
    <section id="live" className={styles.liveSection}>
      <SectionReveal className={styles.liveCard}>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          Live Streaming
        </motion.h2>
        <motion.p variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.16}>
          Temui kami secara virtual untuk menyaksikan acara pernikahan kami melalui tautan di bawah ini:
        </motion.p>
        {invitation.videoUrl && (
          <motion.iframe
            className={styles.liveFrame}
            src={invitation.videoUrl}
            title="Live streaming pernikahan"
            allow="autoplay; encrypted-media; picture-in-picture"
            variants={scrollImageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            custom={0.2}
          />
        )}
        <motion.div className={styles.liveButtons} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.26}>
          {(accounts.length ? accounts : ["username", "username"]).map((account, index) => (
            <motion.a key={account + index} href={instagramUrl(account)} target="_blank" rel="noreferrer" variants={scrollItemVariants} custom={0.08 + index * 0.1}>
              <Icon name="instagram" /> @{account.replace(/^@/, "")}
            </motion.a>
          ))}
        </motion.div>
      </SectionReveal>
    </section>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.length ? invitation.gallery : REFERENCE_GALLERY;
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="gallery" className={styles.gallerySection}>
      <div className={styles.galleryBackdrop} style={bg(photos[0] || REFERENCE_GALLERY[0])} />
      <div className={styles.galleryOverlay} />
      <SectionReveal className={styles.galleryInner}>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          Our Gallery
        </motion.h2>
        <motion.div className={styles.galleryGrid} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.16}>
          {photos.map((photo, index) => (
            <motion.button
              key={photo + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={"Buka foto " + (index + 1)}
              variants={scrollImageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              custom={0.08 + index * 0.1}
            >
              <motion.img src={photo} alt="" loading="lazy" variants={scrollImageVariants} custom={0.06} />
            </motion.button>
          ))}
        </motion.div>
      </SectionReveal>
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActive(null);
            }}
          >
            <button type="button" className={styles.lightboxClose} onClick={() => setActive(null)} aria-label="Tutup foto">
              <Icon name="close" />
            </button>
            <img src={photos[active]} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const DEFAULT_STORY = [
  {
    year: "",
    title: "Awal Betemu",
    description:
      "Kami dipertemukan secara tidak sengaja dan saling kenal mengenal, hingga akhirnya kami berdua intens komunikasi untuk mengenal satu sama lain dan saling berkomitmen",
  },
  {
    year: "",
    title: "Lamaran",
    description:
      "Kami dipertemukan untuk pertama kalinya dalam suatu pertemuan keluarga dimana untuk mengikat suatu hubungan yang kami jalani untuk menuju jenjang yg lebih serius",
  },
  {
    year: "",
    title: "Menikah",
    description:
      "Kami memutuskan untuk saling berkomitmen dan hingga akhirnya menikah dan saling menerima kekurangan satu sama lain sebagai sepasang suami Istri",
  },
];

function LoveStory({ invitation }: { invitation: InvitationData }) {
  const story = invitation.story.length ? invitation.story : DEFAULT_STORY;
  return (
    <section id="story" className={styles.storySection}>
      <SectionReveal className={styles.storyCard}>
        <motion.img
          src={ASSET_ROOT + "/Garden-02-Bouquet.png.webp"}
          alt=""
          className={styles.storyBouquet}
          variants={scrollImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          custom={0}
        />
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.14}>
          Love Story
        </motion.h2>
        <motion.div className={styles.storyItems} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.22}>
          {story.slice(0, 3).map((item, index) => (
            <motion.article key={item.title + index} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.08 + index * 0.12}>
              <motion.h3 variants={scrollItemVariants} custom={0.06}>{item.title}</motion.h3>
              <motion.p variants={scrollItemVariants} custom={0.12}>{item.description}</motion.p>
            </motion.article>
          ))}
        </motion.div>
      </SectionReveal>
    </section>
  );
}

function Gifts({ invitation }: { invitation: InvitationData }) {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(account: GiftAccount) {
    if (!account.accountNumber) return;
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(account.accountNumber);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }
  return (
    <section id="gift" className={styles.giftSection}>
      <SectionReveal className={styles.giftInner}>
        <motion.div className={styles.giftIcon} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0}>
          <Icon name="gift" />
        </motion.div>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.12}>
          Love Gift
        </motion.h2>
        <motion.p className={styles.giftIntro} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.2}>
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
        </motion.p>
        <motion.div className={styles.giftCards} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.28}>
          {invitation.gifts.map((account, index) => (
            <motion.article className={styles.giftCard} key={account.owner + index} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.1 + index * 0.1}>
              <motion.img src={MANDIRI_ICON} alt={account.bankName || "Bank"} variants={scrollImageVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06} />
              <motion.p variants={scrollItemVariants} custom={0.14}>
                {account.bankName || "Bank"}<br />
                No. Rekening {account.accountNumber || "—"}<br />
                a.n <b>{account.accountName || account.owner}</b>
              </motion.p>
              {account.accountNumber && (
                <motion.button type="button" onClick={() => void copy(account)} variants={scrollItemVariants} custom={0.22}>
                  <Icon name="copy" /> {copied === account.accountNumber ? "Berhasil disalin" : "Copy Nomor Rekening"}
                </motion.button>
              )}
            </motion.article>
          ))}
        </motion.div>
        <motion.div className={styles.physicalGift} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.34}>
          <motion.div className={styles.physicalGiftIcon} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
            <Icon name="gift" />
          </motion.div>
          <motion.h3 variants={scrollItemVariants} custom={0.12}>Kirim Kado:</motion.h3>
          <motion.p variants={scrollItemVariants} custom={0.18}>
            <b>{handleName(invitation.bride)}</b><br />
            {invitation.events[0]?.location || "Alamat pengiriman kado dapat ditanyakan kepada keluarga."}
          </motion.p>
          <motion.button type="button" onClick={() => void navigator.clipboard?.writeText(invitation.events[0]?.location || "")} variants={scrollItemVariants} custom={0.24}>
            <Icon name="copy" /> Copy Alamat
          </motion.button>
        </motion.div>
      </SectionReveal>
    </section>
  );
}

function Rsvp() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSent(true);
  }
  return (
    <section id="rsvp" className={styles.rsvpSection}>
      <SectionReveal className={styles.rsvpCard}>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          Rsvp
        </motion.h2>
        <motion.p className={styles.rsvpLabel} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.14}>
          Buku Tamu
        </motion.p>
        {sent ? (
          <motion.div className={styles.success} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.22}>
            Terima kasih, konfirmasi Anda sudah dicatat.
          </motion.div>
        ) : (
          <motion.form onSubmit={submit} className={styles.rsvpForm} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.22}>
            <motion.label variants={scrollItemVariants} custom={0.06}>Nama<input value={name} onChange={(event) => setName(event.target.value)} required /></motion.label>
            <motion.label variants={scrollItemVariants} custom={0.14}>Jumlah<input value={amount} onChange={(event) => setAmount(event.target.value)} required /></motion.label>
            <motion.label variants={scrollItemVariants} custom={0.22}>Pesan<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} required /></motion.label>
            <motion.div className={styles.radioList} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.3}>
              {(["Hadir", "Masih Ragu", "Tidak Hadir"] as Attendance[]).map((option) => (
                <motion.label key={option} variants={scrollItemVariants} custom={0.06}>
                  <input type="radio" name="attendance" checked={attendance === option} onChange={() => setAttendance(option)} />
                  {option === "Hadir" ? "Iya, Saya akan Datang" : option === "Masih Ragu" ? "Saya Masih Ragu" : "Maaf, Saya Tidak Bisa Datang"}
                </motion.label>
              ))}
            </motion.div>
            <motion.button type="submit" className={styles.submitButton} variants={scrollItemVariants} custom={0.38}>Reservasi via Whatsapp</motion.button>
          </motion.form>
        )}
      </SectionReveal>
    </section>
  );
}

function Wishes({ invitation }: { invitation: InvitationData }) {
  const { entries, counts, hasMore, loadMore, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }
    const result = await submit({ name, whatsapp: "", attendance: "Hadir", message });
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    setMessage("");
  }
  return (
    <section id="wishes" className={styles.wishesSection}>
      <SectionReveal className={styles.wishesCard}>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          Wishes
        </motion.h2>
        <motion.p className={styles.wishesLabel} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.14}>
          Ucapan Selamat &amp; Do'a
        </motion.p>
        {submitted ? (
          <motion.div className={styles.success} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.22}>
            Ucapan Anda telah terkirim. Terima kasih.
          </motion.div>
        ) : (
          <motion.form onSubmit={send} className={styles.wishesForm} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.22}>
            <motion.label variants={scrollItemVariants} custom={0.06}>Nama<input value={name} onChange={(event) => setName(event.target.value)} required /></motion.label>
            <motion.label variants={scrollItemVariants} custom={0.14}>Pesan<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} required /></motion.label>
            <motion.button type="submit" className={styles.submitButton} variants={scrollItemVariants} custom={0.22} disabled={submitting}>{submitting ? "Mengirim..." : "Kirimkan Ucapan"}</motion.button>
            {error && <motion.small className={styles.formError} variants={scrollItemVariants} custom={0.3}>{error}</motion.small>}
          </motion.form>
        )}
        <motion.div className={styles.wishCounts} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.32}>
          <motion.span variants={scrollItemVariants} custom={0.06}>{counts.hadir} Hadir</motion.span>
          <motion.span variants={scrollItemVariants} custom={0.12}>{counts.tidakHadir} Tidak Hadir</motion.span>
          <motion.span variants={scrollItemVariants} custom={0.18}>{counts.raguRagu} Ragu</motion.span>
        </motion.div>
        {entries.length > 0 && (
          <motion.div className={styles.wishList} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.38}>
            {entries.map((entry) => (
              <motion.article key={entry.id} variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.08}>
                <motion.strong variants={scrollItemVariants} custom={0.04}>{entry.name}</motion.strong>
                <motion.small variants={scrollItemVariants} custom={0.08}>{entry.attendance}</motion.small>
                <motion.p variants={scrollItemVariants} custom={0.12}>{entry.message}</motion.p>
              </motion.article>
            ))}
            {hasMore && <motion.button type="button" onClick={loadMore} variants={scrollItemVariants} custom={0.18}>Lihat ucapan lainnya</motion.button>}
          </motion.div>
        )}
      </SectionReveal>
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footerSection} style={bg(REFERENCE_GALLERY[0])}>
      <div className={styles.footerShade} />
      <SectionReveal className={styles.footerContent}>
        <motion.p variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.06}>
          Suatu kebahagiaan &amp; kehormatan bagi kami,<br />
          apabila Bapak/Ibu/Saudara/i, berkenan hadir<br />
          dan memberikan do'a restu kepada kami
        </motion.p>
        <motion.span variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.16}>
          Kami Yang Berbahagia,
        </motion.span>
        <motion.h2 variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.24}>
          {firstName(invitation.bride)} <i>&amp;</i> {firstName(invitation.groom)}
        </motion.h2>
        <motion.img src={FOOTER_LOGO} alt="Vistiq Invitation" variants={scrollImageVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.32} />
        <motion.small variants={scrollItemVariants} initial="hidden" whileInView="visible" viewport={scrollViewport} custom={0.42}>
          Created By Vistiq Invitation
        </motion.small>
      </SectionReveal>
    </footer>
  );
}

function FloatingActions({ isPlaying, toggle }: { isPlaying: boolean; toggle: () => void }) {
  return (
    <div className={styles.floatingActions}>
      <button type="button" onClick={() => document.getElementById("gift")?.scrollIntoView({ behavior: "smooth" })} aria-label="Buka hadiah">
        <Icon name="gift" />
      </button>
      <button type="button" onClick={toggle} aria-label={isPlaying ? "Jeda musik" : "Putar musik"}>
        <Icon name="music" />
      </button>
    </div>
  );
}

export default function Premium3DMotion({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    if (!opened) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [opened]);

  async function openInvitation() {
    setOpened(true);
    if (invitation.musicUrl && !isPlaying) {
      try {
        await toggle();
      } catch {
        // The music button remains available when autoplay is blocked.
      }
    }
  }

  return (
    <main className={styles.root} data-auto-scroll-mode="manual">
      <aside className={styles.desktopPhoto} style={bg(invitation.coverImage || REFERENCE_COVER)} aria-hidden="true">
        {!opened && (
          <>
            <div className={styles.desktopPhotoShade} />
            <div className={styles.desktopPhotoCopy}>
              <p>The Wedding of</p>
              <h2>{firstName(invitation.bride)} &amp; {firstName(invitation.groom)}</h2>
              <span>{invitation.events[0]?.date || ""}</span>
            </div>
          </>
        )}
      </aside>
      <div className={styles.shell}>
        <div className={styles.content} aria-hidden={!opened}>
          <OpeningHero invitation={invitation} opened={opened} />
          <Quote invitation={invitation} />
          <Welcome invitation={invitation} />
          <Couple invitation={invitation} />
          <MemorySlideshow />
          <Countdown event={invitation.events[0]} />
          <Events invitation={invitation} />
          <LiveStreaming invitation={invitation} />
          <Gallery invitation={invitation} />
          <LoveStory invitation={invitation} />
          {invitation.gifts.length > 0 && <Gifts invitation={invitation} />}
          <Rsvp />
          <Wishes invitation={invitation} />
          <Footer invitation={invitation} />
        </div>
        {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop preload="none" />}
        <AnimatePresence>
          {!opened && <Cover key="cover" invitation={invitation} onOpen={() => void openInvitation()} />}
        </AnimatePresence>
        {opened && (
          <div className={styles.controls}>
            <FloatingActions isPlaying={isPlaying} toggle={() => void toggle()} />
          </div>
        )}
      </div>
    </main>
  );
}
