"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { CSSProperties, FormEvent } from "react";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

const REFERENCE_COVER =
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-3.jpg";
const REFERENCE_FALLBACK =
  "https://undanganqu.net/wp-content/uploads/2024/11/Garden-02-Fallback.jpg";
const REFERENCE_VIDEO =
  "https://undanganqu.net/wp-content/uploads/2024/11/02.-Cottage-Garden.mp4";
const REFERENCE_QUOTE_BG =
  "https://undanganqu.net/wp-content/uploads/2024/11/Garden-02-Ayat.jpg";
const REFERENCE_GALLERY = [
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-4.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-3.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-2.jpg",
  "https://undanganqu.net/wp-content/uploads/2025/09/ai-ungu-1.jpg",
];
const ASSET_ROOT = "/themes/premium-3d-motion-2";

const revealEase = [0.22, 1, 0.36, 1] as const;
const coverEase = [0.23, 0.56, 0.38, 0.78] as const;

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

function background(url?: string | null): CSSProperties {
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
          <path {...line} d="M3.8 19v-2.3A4.2 4.2 0 0 1 8 12.5a4 4 0 0 1 4 4V19M12 19v-2.5a4 4 0 0 1 8 0V19" />
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

function Flower({
  side,
  variant = "bouquet",
  delay = 0,
}: {
  side: "left" | "right" | "top" | "bottom";
  variant?: "bouquet" | "bride" | "groom";
  delay?: number;
}) {
  const src =
    variant === "bride"
      ? ASSET_ROOT + "/Garden-02-Couple-2.png.webp"
      : variant === "groom"
        ? ASSET_ROOT + "/Garden-02-Couple-1.png.webp"
        : ASSET_ROOT + "/Garden-02-Bouquet.png.webp";

  return (
    <motion.div
      className={styles.flower + " " + styles["flower" + side[0].toUpperCase() + side.slice(1)]}
      aria-hidden="true"
      animate={{ y: [0, -4, 0], rotate: [0, side === "left" ? -0.45 : 0.45, 0] }}
      transition={{ delay, duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <img src={src} alt="" />
    </motion.div>
  );
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0];
  const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  const date = invitation.events[0]?.date;

  return (
    <motion.section
      className={styles.cover}
      exit={{ y: "-120%" }}
      transition={{ duration: 1.55, ease: coverEase }}
    >
      <div
        className={styles.coverBackground}
        style={background(invitation.coverImage || REFERENCE_COVER)}
        aria-hidden="true"
      />
      <div className={styles.coverShade} aria-hidden="true" />
      <div className={styles.coverGrain} aria-hidden="true" />
      <div className={styles.coverFrame} aria-hidden="true" />

      <motion.div
        className={styles.coverTitle}
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9, ease: revealEase }}
      >
        <p>The Wedding of</p>
        <h1>{bride} <span>&amp;</span> {groom}</h1>
      </motion.div>

      <motion.div
        className={styles.coverGuest}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: revealEase }}
      >
        <p>
          <span>Kepada Yth:</span>
          <strong>{guest}</strong>
        </p>
        <button type="button" onClick={onOpen}>
          <Icon name="envelope" /> Buka Undangan
        </button>
      </motion.div>
    </motion.section>
  );
}

function OpeningHero({ invitation, active }: { invitation: InvitationData; active: boolean }) {
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  const date = invitation.events[0]?.date || "With joy and gratitude";

  return (
    <section id="home" className={styles.hero}>
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={REFERENCE_FALLBACK}
        aria-hidden="true"
      >
        <source src={REFERENCE_VIDEO} type="video/mp4" />
      </video>
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroFrame} aria-hidden="true" />

      <motion.div
        className={styles.heroCopy}
        initial={{ opacity: 0, y: -18 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
        transition={{ delay: 0.3, duration: 0.85, ease: revealEase }}
      >
        <p>The Wedding of</p>
        <h2>{bride}</h2>
        <span>&amp;</span>
        <h2>{groom}</h2>
        <small>{date}</small>
      </motion.div>

      <motion.div
        className={styles.scrollPrompt}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <span>Scroll to explore</span>
        <i />
      </motion.div>
    </section>
  );
}

function QuoteAndWelcome({ invitation }: { invitation: InvitationData }) {
  const quote = invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const source = invitation.opening.quoteSource || "QS. Ar-Rum : 21";
  const description = invitation.opening.description || "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:";
  const photo = invitation.gallery[1] || REFERENCE_COVER;
  const brideInitial = (invitation.bride.nickname || invitation.bride.name).slice(0, 1).toUpperCase();
  const groomInitial = (invitation.groom.nickname || invitation.groom.name).slice(0, 1).toUpperCase();

  return (
    <section id="quote" className={styles.quote}>
      <div className={styles.quotePhoto} style={background(photo)} aria-hidden="true" />
      <div className={styles.quoteCard}>
        <div className={styles.quoteMonogram}>
          <span>{brideInitial}</span><i>&amp;</i><span>{groomInitial}</span>
        </div>
        <blockquote>
          <p>"{quote}"</p>
          <cite>— {source} —</cite>
        </blockquote>
      </div>
      <motion.div
        className={styles.welcome}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: revealEase }}
      >
        <span className={styles.ornament}>✤</span>
        <h2>We Are<br />Getting Married!</h2>
        <p>{description}</p>
      </motion.div>
      <Flower side="bottom" delay={0.2} />
    </section>
  );
}

function Person({
  person,
  role,
  flowerVariant,
  photoFallback,
}: {
  person: InvitationData["bride"] | InvitationData["groom"];
  role: "bride" | "groom";
  flowerVariant: "bride" | "groom";
  photoFallback: string;
}) {
  const shortName = person.nickname || person.name.split(" ")[0];

  return (
    <motion.article
      className={styles.person}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: revealEase }}
    >
      <div className={styles.personVisual}>
        <div className={styles.personPhoto} style={background(person.photo || photoFallback)} />
        <div className={styles.personBorder} aria-hidden="true" />
        <img
          className={styles.personFlower}
          src={flowerVariant === "bride" ? ASSET_ROOT + "/Garden-02-Couple-2.png.webp" : ASSET_ROOT + "/Garden-02-Couple-1.png.webp"}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className={styles.personContent}>
        <span className={styles.personRole}>{role === "bride" ? "The Bride" : "The Groom"}</span>
        <h3>{shortName}</h3>
        <strong>{person.name}</strong>
        {person.parents && <p>{person.parents}</p>}
        {person.instagram && (
          <a href={"https://instagram.com/" + person.instagram.replace("@", "")} target="_blank" rel="noreferrer">
            <Icon name="instagram" /> @{person.instagram.replace("@", "")}
          </a>
        )}
      </div>
    </motion.article>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  const bridePhoto = invitation.gallery[2] || REFERENCE_GALLERY[2];
  const groomPhoto = invitation.gallery[3] || REFERENCE_GALLERY[3];

  return (
    <section id="couple" className={styles.couple}>
      <div className={styles.coupleIntro}>
        <span>Two hearts, one promise</span>
        <h2>We Are<br />Getting Married!</h2>
        <p>{invitation.opening.description || "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:"}</p>
      </div>
      <div className={styles.people}>
        <Person person={invitation.bride} role="bride" flowerVariant="bride" photoFallback={bridePhoto} />
        <div className={styles.coupleAmpersand} aria-hidden="true">&amp;</div>
        <Person person={invitation.groom} role="groom" flowerVariant="groom" photoFallback={groomPhoto} />
      </div>
      <Flower side="top" variant="bouquet" delay={0.4} />
    </section>
  );
}

function Countdown({ date }: { date: string }) {
  const target = useMemo(() => new Date(date).getTime(), [date]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = now === null || Number.isNaN(target) ? null : Math.max(0, target - now);
  const values: [string, string][] =
    distance === null
      ? [["--", "Hari"], ["--", "Jam"], ["--", "Menit"], ["--", "Detik"]]
      : [
          [String(Math.floor(distance / 86400000)).padStart(2, "0"), "Hari"],
          [String(Math.floor(distance / 3600000) % 24).padStart(2, "0"), "Jam"],
          [String(Math.floor(distance / 60000) % 60).padStart(2, "0"), "Menit"],
          [String(Math.floor(distance / 1000) % 60).padStart(2, "0"), "Detik"],
        ];

  return (
    <section id="countdown" className={styles.countdown}>
      <Flower side="top" variant="bouquet" />
      <motion.div
        className={styles.countdownInner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: revealEase }}
      >
        <span>Mark your calendar</span>
        <h2>Save The Date</h2>
        <p>We would be honored to celebrate this beautiful beginning with you.</p>
        <div className={styles.countdownGrid}>
          {values.map(([value, label]) => (
            <span key={label}>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          ))}
        </div>
        <a href="#events"><Icon name="calendar" /> View The Details</a>
      </motion.div>
    </section>
  );
}

function EventCard({
  event,
  index,
  image,
  mapsUrl,
}: {
  event: InvitationData["events"][number];
  index: number;
  image: string;
  mapsUrl: string | null;
}) {
  return (
    <motion.article
      className={styles.eventCard}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: revealEase }}
      style={background(image)}
    >
      <div className={styles.eventShade} aria-hidden="true" />
      <div className={styles.eventContent}>
        <span>{index === 0 ? "The ceremony" : "The celebration"}</span>
        <h3>{event.name}</h3>
        <p className={styles.eventDate}>{event.date}</p>
        <p className={styles.eventTime}>{event.time}</p>
        <b>♥</b>
        <p className={styles.eventLocation}>{event.location}</p>
        {mapsUrl && <a href={mapsUrl} target="_blank" rel="noreferrer"><Icon name="pin" /> Google Map</a>}
      </div>
    </motion.article>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="events" className={styles.events}>
      <div className={styles.sectionHeading}>
        <span>With joyful hearts</span>
        <h2>Wedding Details</h2>
        <i />
      </div>
      <p className={styles.eventsIntro}>Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:</p>
      <div className={styles.eventList}>
        {invitation.events.map((event, index) => (
          <EventCard
            key={event.name + event.date}
            event={event}
            index={index}
            image={invitation.gallery[index] || REFERENCE_GALLERY[index % REFERENCE_GALLERY.length]}
            mapsUrl={invitation.mapsUrl}
          />
        ))}
      </div>
    </section>
  );
}

function LiveStream({ invitation }: { invitation: InvitationData }) {
  const accounts = [invitation.bride.instagram, invitation.groom.instagram].filter(Boolean) as string[];
  const isVideo = Boolean(invitation.videoUrl && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(invitation.videoUrl));

  return (
    <section id="live" className={styles.live}>
      <div className={styles.sectionHeading}>
        <span>Be there from wherever you are</span>
        <h2>Live Streaming</h2>
        <i />
      </div>
      <p>Temui kami secara virtual untuk menyaksikan acara pernikahan kami melalui tautan di bawah ini:</p>
      {isVideo && invitation.videoUrl ? (
        <video className={styles.liveVideo} src={invitation.videoUrl} controls playsInline />
      ) : invitation.videoUrl ? (
        <iframe className={styles.liveFrame} src={invitation.videoUrl} title="Live streaming pernikahan" allow="autoplay; encrypted-media; picture-in-picture" />
      ) : (
        <div className={styles.socialLinks}>
          {accounts.map((account) => (
            <a key={account} href={"https://instagram.com/" + account.replace("@", "")} target="_blank" rel="noreferrer">
              <Icon name="instagram" /> @{account.replace("@", "")}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.length > 0 ? invitation.gallery : REFERENCE_GALLERY;
  const [active, setActive] = useState<number | null>(null);
  const [backdropIndex, setBackdropIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setBackdropIndex((value) => (value + 1) % photos.length), 1800);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  return (
    <section id="gallery" className={styles.gallery}>
      <div
        className={styles.galleryBackdrop}
        style={background(photos[backdropIndex] || REFERENCE_COVER)}
        aria-hidden="true"
      />
      <div className={styles.galleryOverlay} aria-hidden="true" />
      <div className={styles.sectionHeading}>
        <span>A collection of our favorite moments</span>
        <h2>Our Gallery</h2>
        <i />
      </div>
      <div className={styles.galleryGrid}>
        {photos.slice(0, 8).map((photo, index) => (
          <button
            type="button"
            key={photo + index}
            className={index === 0 ? styles.galleryWide : ""}
            style={background(photo)}
            onClick={() => setActive(index)}
            aria-label={"Buka foto galeri " + (index + 1)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}
          >
            <button type="button" className={styles.lightboxClose} onClick={() => setActive(null)} aria-label="Tutup galeri">
              <Icon name="close" />
            </button>
            <div className={styles.lightboxPhoto} style={background(photos[active])} />
            <p>{String(active + 1).padStart(2, "0")} / {String(Math.min(photos.length, 8)).padStart(2, "0")}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Flower side="bottom" variant="bouquet" delay={0.25} />
    </section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.gallery[0] || REFERENCE_COVER;

  return (
    <section id="story" className={styles.story}>
      <div className={styles.storyPhoto} style={background(photo)} aria-hidden="true" />
      <div className={styles.storyShade} aria-hidden="true" />
      <div className={styles.storyBody}>
        <div className={styles.sectionHeading}>
          <span>Every chapter brought us here</span>
          <h2>Love Story</h2>
          <i />
        </div>
        <div className={styles.timeline}>
          {invitation.story.map((item, index) => (
            <motion.article
              key={item.year + item.title}
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06, duration: 0.65, ease: revealEase }}
            >
              <span>{item.year}</span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
      <Flower side="top" variant="bouquet" delay={0.45} />
    </section>
  );
}

function Gifts({ invitation }: { invitation: InvitationData }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(account: GiftAccount, index: number) {
    if (!account.accountNumber) return;
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(index);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section id="gift" className={styles.gift}>
      <Flower side="top" variant="bouquet" />
      <div className={styles.sectionHeading}>
        <span>Your prayers are the greatest gift</span>
        <h2>Love Gift</h2>
        <i />
      </div>
      <p className={styles.giftText}>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.</p>
      <button type="button" className={styles.giftToggle} onClick={() => setShow((value) => !value)}>
        <Icon name="gift" /> {show ? "Tutup Amplop Digital" : "Amplop Digital"}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div className={styles.giftAccounts} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {invitation.gifts.map((account, index) => (
              <article className={styles.giftCard} key={account.owner + index}>
                <span>{account.bankName || "Bank"}</span>
                <strong>{account.accountNumber || "—"}</strong>
                <small>{account.accountName || account.owner}</small>
                {account.accountNumber && (
                  <button type="button" onClick={() => void copy(account, index)}>
                    <Icon name="copy" /> {copied === index ? "Tersalin" : "Salin Nomor"}
                  </button>
                )}
              </article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Flower side="bottom" variant="bouquet" delay={0.3} />
    </section>
  );
}

function Guestbook({ invitation }: { invitation: InvitationData }) {
  const { submit, submitting, submitted, entries, counts, hasMore, loadMore } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }
    const result = await submit({ name, whatsapp: "", attendance, message });
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    setMessage("");
  }

  return (
    <section id="rsvp" className={styles.rsvp}>
      <div className={styles.rsvpPanel}>
        <div className={styles.sectionHeading}>
          <span>Leave a little love for us</span>
          <h2>Wishes</h2>
          <i />
        </div>
        <p className={styles.rsvpSubtitle}>Berikan ucapan terbaik untuk kedua mempelai dan konfirmasi kehadiran Anda.</p>
        {submitted ? (
          <div className={styles.success}>Terima kasih, konfirmasi dan ucapan Anda telah terkirim.</div>
        ) : (
          <form className={styles.rsvpForm} onSubmit={send}>
            <input aria-label="Nama" placeholder="Nama Kamu" value={name} onChange={(event) => setName(event.target.value)} />
            <textarea aria-label="Ucapan" placeholder="Berikan ucapan dan do’a" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} />
            <label>Konfirmasi Kehadiran</label>
            <div className={styles.attendance}>
              {(["Hadir", "Tidak Hadir", "Masih Ragu"] as Attendance[]).map((option) => (
                <button type="button" key={option} className={attendance === option ? styles.attendanceActive : ""} onClick={() => setAttendance(option)}>
                  {option}
                </button>
              ))}
            </div>
            <button type="submit" className={styles.formSubmit} disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Ucapan"}</button>
            {error && <small className={styles.error}>{error}</small>}
          </form>
        )}
        <div className={styles.rsvpCounts}>
          <span><strong>{counts.hadir}</strong> Hadir</span>
          <span><strong>{counts.tidakHadir}</strong> Tidak Hadir</span>
          <span><strong>{counts.raguRagu}</strong> Ragu</span>
        </div>
        {entries.length > 0 && (
          <div className={styles.wishList}>
            {entries.map((entry) => (
              <article className={styles.wishItem} key={entry.id}>
                <span>{entry.name.slice(0, 1).toUpperCase()}</span>
                <div><strong>{entry.name}</strong><small>{entry.attendance}</small><p>{entry.message}</p></div>
              </article>
            ))}
            {hasMore && <button type="button" className={styles.loadMore} onClick={loadMore}>Lihat ucapan lainnya</button>}
          </div>
        )}
      </div>
      <Flower side="bottom" variant="bouquet" delay={0.5} />
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  const photo = invitation.gallery[0] || REFERENCE_COVER;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerPhoto} style={background(photo)} aria-hidden="true" />
      <div className={styles.footerShade} aria-hidden="true" />
      <div className={styles.footerCopy}>
        <p>Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
        <h3>Wassalamu’alaikum Wr. Wb.</h3>
        <small>Kami yang berbahagia</small>
        <h2>{bride} <span>&amp;</span> {groom}</h2>
        <div className={styles.footerRule}><i /><span>∞</span><i /></div>
      </div>
      <Flower side="bottom" variant="bouquet" delay={0.35} />
    </footer>
  );
}

const nav: [string, IconName, string][] = [
  ["home", "home", "Home"],
  ["couple", "couple", "Mempelai"],
  ["events", "calendar", "Acara"],
  ["gallery", "gallery", "Galeri"],
  ["story", "heart", "Cerita"],
  ["rsvp", "chat", "Ucapan"],
  ["gift", "gift", "Hadiah"],
];

function FloatingNav() {
  return (
    <nav className={styles.nav} aria-label="Navigasi undangan">
      {nav.map(([id, icon, label]) => (
        <button type="button" key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} aria-label={label}>
          <Icon name={icon} />
        </button>
      ))}
    </nav>
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
        <i className={isPlaying ? styles.musicPlaying : ""} />
      </button>
    </div>
  );
}

export default function Premium3DMotion({ invitation }: { invitation: InvitationData }) {
  const { opened, setOpened } = useInvitation();
  const { audioRef, isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, false);
  const firstDate = invitation.events[0]?.rawDate;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    if (!opened) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [opened]);

  async function openInvitation() {
    setOpened(true);
    if (invitation.musicUrl && !isPlaying) {
      try {
        await toggle();
      } catch {
        // Browser autoplay policies can keep the music control available.
      }
    }
  }

  return (
    <main className={styles.root}>
      <aside className={styles.desktopPhoto} style={background(invitation.coverImage || REFERENCE_COVER)} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.content} aria-hidden={!opened}>
          <OpeningHero invitation={invitation} active={opened} />
          <QuoteAndWelcome invitation={invitation} />
          <Couple invitation={invitation} />
          {firstDate && <Countdown date={firstDate} />}
          <Events invitation={invitation} />
          <LiveStream invitation={invitation} />
          <Gallery invitation={invitation} />
          {invitation.story.length > 0 && <Story invitation={invitation} />}
          {invitation.gifts.length > 0 && <Gifts invitation={invitation} />}
          <Guestbook invitation={invitation} />
          <Footer invitation={invitation} />
        </div>
        {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}
        <AnimatePresence>
          {!opened && <Cover key="cover" invitation={invitation} onOpen={() => void openInvitation()} />}
        </AnimatePresence>
        <AnimatePresence>
          {opened && (
            <motion.div className={styles.controls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: 0.5 }}>
              <FloatingActions isPlaying={isPlaying} toggle={() => void toggle()} />
              <FloatingNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
