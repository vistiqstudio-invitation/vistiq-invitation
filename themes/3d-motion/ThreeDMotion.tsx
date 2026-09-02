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

type IconName =
  | "home"
  | "couple"
  | "calendar"
  | "gallery"
  | "heart"
  | "chat"
  | "gift"
  | "music"
  | "pin"
  | "copy"
  | "envelope"
  | "play"
  | "close";

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
      {name === "heart" && <path {...line} d="M20.7 6.8c0 5-8.7 11.3-8.7 11.3S3.3 11.8 3.3 6.8C3.3 4.7 5 3 7.2 3c1.9 0 3.2 1 4.8 3 1.6-2 2.9-3 4.8-3 2.2 0 3.9 1.7 3.9 3.8Z" />}
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
      {name === "play" && <path fill="currentColor" d="m8 5 11 7-11 7V5Z" />}
      {name === "close" && <path {...line} d="m6 6 12 12M18 6 6 18" />}
    </svg>
  );
}

function BotanicalOverlay({
  side,
  delay = 0,
}: {
  side: "left" | "right" | "top" | "bottom";
  delay?: number;
}) {
  return (
    <motion.div
      className={`${styles.botanical} ${styles[`botanical${side[0].toUpperCase()}${side.slice(1)}`]}`}
      aria-hidden="true"
      animate={{ y: [0, -4, 0], rotate: side === "top" || side === "bottom" ? [0, 0.5, 0] : [0, side === "left" ? -0.6 : 0.6, 0] }}
      transition={{ delay, duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src="/themes/3d-motion/bouquet.webp"
        alt=""
        fill
        sizes="500px"
        className={styles.botanicalImage}
      />
    </motion.div>
  );
}

function CoupleArtwork({ role }: { role: "bride" | "groom" }) {
  return (
    <Image
      src={role === "bride" ? "/themes/3d-motion/couple-bride.webp" : "/themes/3d-motion/couple-groom.webp"}
      alt=""
      fill
      sizes="(max-width: 600px) 92vw, 460px"
      className={styles.coupleArtwork}
    />
  );
}

function Portrait({
  src,
  alt,
  role,
  priority = false,
}: {
  src: string | null;
  alt: string;
  role: "bride" | "groom";
  priority?: boolean;
}) {
  return (
    <div className={`${styles.portraitFrame} ${role === "bride" ? styles.portraitBride : styles.portraitGroom}`}>
      <div className={styles.portraitImage}>
        {src && <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 600px) 59vw, 295px" />}
      </div>
      <CoupleArtwork role={role} />
    </div>
  );
}

function Cover({ invitation, onOpen }: { invitation: InvitationData; onOpen: () => void }) {
  const guest = useSearchParams().get("to") || "Bapak/Ibu/Saudara/i";
  const bride = invitation.bride.nickname || invitation.bride.name.split(" ")[0];
  const groom = invitation.groom.nickname || invitation.groom.name.split(" ")[0];
  const date = invitation.events[0]?.date;

  return (
    <motion.section className={styles.cover} exit={{ y: "-120%" }} transition={{ duration: 1.65, ease: coverEase }}>
      {invitation.coverImage && (
        <Image
          className={styles.coverPhoto}
          src={invitation.coverImage}
          alt={`${bride} dan ${groom}`}
          fill
          priority
          sizes="(max-width: 600px) 100vw, 500px"
        />
      )}
      <div className={styles.coverShade} aria-hidden="true" />
      <div className={styles.coverGrain} aria-hidden="true" />
      <div className={styles.coverFrame} aria-hidden="true" />
      <BotanicalOverlay side="left" />
      <BotanicalOverlay side="right" delay={0.35} />

      <motion.div
        className={styles.coverTitle}
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.9, ease: revealEase }}
      >
        <p>The Wedding of</p>
        <h1>
          <em>{bride}</em>
          <span>&amp;</span>
          <em>{groom}</em>
        </h1>
        {date && <small>{date}</small>}
      </motion.div>

      <motion.div
        className={styles.coverMonogram}
        initial={{ opacity: 0, scale: 0.78 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.9, ease: revealEase }}
      >
        <span>{bride.slice(0, 1).toUpperCase()}</span>
        <i>&amp;</i>
        <span>{groom.slice(0, 1).toUpperCase()}</span>
      </motion.div>

      <motion.div
        className={styles.guestBlock}
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: revealEase }}
      >
        <p>
          <span>Kepada Yth.</span>
          <strong>{guest}</strong>
        </p>
        <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onOpen}>
          <Icon name="envelope" /> Buka Undangan
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

function OpeningHero({ invitation, active }: { invitation: InvitationData; active: boolean }) {
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  const heroPhoto = invitation.gallery[0] || invitation.coverImage;

  return (
    <section id="home" data-opening-hero className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true">
        {heroPhoto && <Image src={heroPhoto} alt="" fill priority sizes="(max-width: 600px) 100vw, 500px" className={styles.heroBackdropImage} />}
        <div className={styles.heroWash} />
        <i className={styles.heroGlowOne} />
        <i className={styles.heroGlowTwo} />
      </div>
      <div className={styles.heroFrame} aria-hidden="true" />
      <BotanicalOverlay side="top" />
      <BotanicalOverlay side="bottom" delay={0.5} />

      <motion.div
        className={styles.heroCopy}
        initial={{ opacity: 0, y: -18 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
        transition={{ delay: 0.35, duration: 0.85, ease: revealEase }}
      >
        <p className={styles.eyebrow}>The Wedding of</p>
        <h2>
          <em>{bride}</em>
          <span>&amp;</span>
          <em>{groom}</em>
        </h2>
        <p className={styles.heroDate}>{invitation.events[0]?.date || "With joy and gratitude"}</p>
      </motion.div>

      <motion.div
        className={styles.heroMonogram}
        initial={{ opacity: 0, scale: 0.82, filter: "blur(7px)" }}
        animate={active ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.82, filter: "blur(7px)" }}
        transition={{ delay: 0.8, duration: 1.1, ease: revealEase }}
      >
        <span>{bride.slice(0, 1).toUpperCase()}</span>
        <i>&amp;</i>
        <span>{groom.slice(0, 1).toUpperCase()}</span>
      </motion.div>

      <motion.div
        className={styles.heroScroll}
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
  const photo = invitation.gallery[1] || invitation.coverImage;
  const quote = invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.";
  const source = invitation.opening.quoteSource || "QS. Ar-Rum : 21";
  const description = invitation.opening.description || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, insyaa Allah kami akan menyelenggarakan acara pernikahan.";

  return (
    <section id="quote" className={styles.quote}>
      <div className={styles.quoteImageWrap}>
        {photo && <Image src={photo} alt="Momen pasangan" fill sizes="(max-width: 600px) 100vw, 500px" className={styles.quoteImage} />}
        <div className={styles.quoteImageVeil} aria-hidden="true" />
      </div>
      <motion.div className={styles.quoteBody} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: revealEase }}>
        <span className={styles.quoteMark}>“</span>
        <blockquote>
          <p>{quote}</p>
          <cite>— {source} —</cite>
        </blockquote>
      </motion.div>
      <div className={styles.welcome}>
        <span className={styles.welcomeOrnament}>✾</span>
        <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.75, ease: revealEase }}>
          We Are Getting Married!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.1, duration: 0.75, ease: revealEase }}>
          {description}
        </motion.p>
      </div>
      <BotanicalOverlay side="bottom" delay={0.2} />
    </section>
  );
}

function Person({
  person,
  role,
  index,
}: {
  person: InvitationData["bride"] | InvitationData["groom"];
  role: "bride" | "groom";
  index: number;
}) {
  return (
    <motion.article
      className={styles.person}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: revealEase }}
    >
      <Portrait src={person.photo} alt={person.name} role={role} />
      <div className={styles.personContent}>
        <span className={styles.personRole}>{role === "bride" ? "The Bride" : "The Groom"}</span>
        <h3>{person.name}</h3>
        {person.parents && <p>{person.parents}</p>}
        {person.instagram && (
          <a href={`https://instagram.com/${person.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
            @{person.instagram.replace("@", "")}
          </a>
        )}
      </div>
    </motion.article>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="couple" className={styles.couple}>
      <div className={styles.sectionHeading}>
        <span>Two hearts, one promise</span>
        <h2>Meet the Couple</h2>
        <i />
      </div>
      <div className={styles.people}>
        <Person person={invitation.bride} role="bride" index={0} />
        <div className={styles.coupleDivider} aria-hidden="true">
          <span>&amp;</span>
        </div>
        <Person person={invitation.groom} role="groom" index={1} />
      </div>
      <BotanicalOverlay side="left" delay={0.15} />
      <BotanicalOverlay side="right" delay={0.55} />
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
  const values: [string, string][] = distance === null
    ? [["--", "Days"], ["--", "Hours"], ["--", "Minutes"], ["--", "Seconds"]]
    : [
        [String(Math.floor(distance / 86400000)).padStart(2, "0"), "Days"],
        [String(Math.floor(distance / 3600000) % 24).padStart(2, "0"), "Hours"],
        [String(Math.floor(distance / 60000) % 60).padStart(2, "0"), "Minutes"],
        [String(Math.floor(distance / 1000) % 60).padStart(2, "0"), "Seconds"],
      ];

  return (
    <section id="countdown" className={styles.countdown}>
      <div className={styles.countdownBackdrop} aria-hidden="true" />
      <BotanicalOverlay side="top" />
      <motion.div className={styles.countdownInner} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: revealEase }}>
        <span className={styles.sectionKicker}>Mark your calendar</span>
        <h2>Save The Date</h2>
        <p>We would be honored to celebrate this beautiful beginning with you.</p>
        <div className={styles.countdownGrid}>
          {values.map(([value, label]) => (
            <span className={styles.countdownCell} key={label}>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          ))}
        </div>
        <a href="#events" className={styles.saveButton}>
          <Icon name="calendar" /> View The Details
        </a>
      </motion.div>
    </section>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <section id="events" className={styles.events}>
      <div className={styles.sectionHeading}>
        <span>Join us on our special day</span>
        <h2>Wedding Details</h2>
        <i />
      </div>
      <div className={styles.eventList}>
        {invitation.events.map((event, index) => {
          const image = invitation.gallery[index + 2] || invitation.coverImage;
          return (
            <motion.article
              key={`${event.name}-${event.date}`}
              className={styles.eventCard}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.75, ease: revealEase }}
            >
              {image && <Image src={image} alt="" fill sizes="(max-width: 600px) 100vw, 500px" className={styles.eventBackground} />}
              <div className={styles.eventOverlay} aria-hidden="true" />
              <div className={styles.eventContent}>
                <span className={styles.eventKicker}>{index === 0 ? "First ceremony" : "The celebration"}</span>
                <h3>{event.name}</h3>
                <p className={styles.eventDate}>{event.date}</p>
                <p className={styles.eventTime}>{event.time}</p>
                <span className={styles.eventHeart}>♥</span>
                <p className={styles.eventLocation}>{event.location}</p>
                {invitation.mapsUrl && (
                  <a href={invitation.mapsUrl} target="_blank" rel="noreferrer" className={styles.mapButton}>
                    <Icon name="pin" /> Lihat Maps
                  </a>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function LiveStream({ url }: { url: string }) {
  const isVideo = /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(url);

  return (
    <section id="live" className={styles.live}>
      <div className={styles.sectionHeading}>
        <span>Be there from wherever you are</span>
        <h2>Live Streaming</h2>
        <i />
      </div>
      <div className={styles.liveCard}>
        {isVideo ? (
          <video className={styles.liveVideo} src={url} controls playsInline />
        ) : (
          <iframe className={styles.liveFrame} src={url} title="Live streaming pernikahan" allow="autoplay; encrypted-media; picture-in-picture" />
        )}
        <p>Join the moment and send your warmest wishes to the happy couple.</p>
      </div>
    </section>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const photos = invitation.gallery.slice(0, 8);

  return (
    <section id="gallery" className={styles.gallery}>
      <BotanicalOverlay side="top" />
      <div className={styles.sectionHeading}>
        <span>A collection of our favorite moments</span>
        <h2>Our Gallery</h2>
        <i />
      </div>
      <div className={styles.galleryGrid}>
        {photos.map((photo, index) => (
          <motion.button
            type="button"
            key={`${photo}-${index}`}
            className={`${styles.galleryItem} ${index === 0 ? styles.galleryItemWide : ""}`}
            onClick={() => setActive(index)}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ delay: index * 0.05, duration: 0.55 }}
          >
            <Image src={photo} alt={`Galeri ${index + 1}`} fill sizes="(max-width: 600px) 44vw, 220px" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}>
            <button type="button" className={styles.lightboxClose} aria-label="Tutup galeri" onClick={() => setActive(null)}>
              <Icon name="close" />
            </button>
            <div className={styles.lightboxImage}>
              <Image src={photos[active]} alt={`Galeri ${active + 1}`} fill sizes="92vw" />
            </div>
            <p>{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.gallery[3] || invitation.coverImage;

  return (
    <section id="story" className={styles.story}>
      <div className={styles.storyMedia}>
        {photo && <Image src={photo} alt="Perjalanan pasangan" fill sizes="(max-width: 600px) 100vw, 500px" className={styles.storyMediaImage} />}
        <div className={styles.storyMediaShade} aria-hidden="true" />
      </div>
      <div className={styles.storyBody}>
        <div className={styles.sectionHeading}>
          <span>Every chapter brought us here</span>
          <h2>Love Story</h2>
          <i />
        </div>
        <div className={styles.timeline}>
          {invitation.story.map((item, index) => (
            <motion.article
              key={`${item.year}-${item.title}`}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08, duration: 0.65, ease: revealEase }}
            >
              <i className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <span className={styles.timelineYear}>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <BotanicalOverlay side="bottom" />
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
      <BotanicalOverlay side="top" />
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
              <article className={styles.giftCard} key={`${account.owner}-${index}`}>
                <span className={styles.giftBank}>{account.bankName || "Bank"}</span>
                <strong className={styles.giftNumber}>{account.accountNumber || "—"}</strong>
                <span className={styles.giftOwner}>{account.accountName || account.owner}</span>
                {account.accountNumber && (
                  <button type="button" className={styles.copyButton} onClick={() => void copy(account, index)}>
                    <Icon name="copy" /> {copied === index ? "Tersalin" : "Salin Nomor"}
                  </button>
                )}
              </article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <BotanicalOverlay side="bottom" delay={0.3} />
    </section>
  );
}

function Guestbook({ invitation }: { invitation: InvitationData }) {
  const { submit, submitting, submitted, entries, counts, hasMore, loadMore } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function send(event: React.FormEvent<HTMLFormElement>) {
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
            <button type="submit" className={styles.formSubmit} disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Ucapan"}
            </button>
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
                <span className={styles.wishAvatar}>{entry.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{entry.name}</strong>
                  <small>{entry.attendance}</small>
                  <p>{entry.message}</p>
                </div>
              </article>
            ))}
            {hasMore && <button type="button" className={styles.loadMore} onClick={loadMore}>Lihat ucapan lainnya</button>}
          </div>
        )}
      </div>
      <BotanicalOverlay side="bottom" delay={0.5} />
    </section>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  const bride = invitation.bride.nickname || invitation.bride.name;
  const groom = invitation.groom.nickname || invitation.groom.name;
  const photo = invitation.gallery[0] || invitation.coverImage;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerBackdrop} aria-hidden="true">
        {photo && <Image src={photo} alt="" fill sizes="(max-width: 600px) 100vw, 500px" className={styles.footerPhoto} />}
        <div className={styles.footerWash} />
      </div>
      <BotanicalOverlay side="top" />
      <motion.div className={styles.footerCopy} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: revealEase }}>
        <p>Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
        <h3>Wassalamu’alaikum Wr. Wb.</h3>
        <small>Kami yang berbahagia</small>
        <h2><em>{bride}</em><span>&amp;</span><em>{groom}</em></h2>
        <div className={styles.footerRule}><i /> <span>∞</span> <i /></div>
        <p className={styles.footerCredit}>A celebration of love, laughter &amp; forever.</p>
      </motion.div>
      <BotanicalOverlay side="bottom" delay={0.4} />
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

export default function ThreeDMotion({ invitation }: { invitation: InvitationData }) {
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
        // The floating music control remains available if playback is blocked.
      }
    }
  }

  return (
    <main className={styles.root}>
      <aside className={styles.desktopPhoto} aria-hidden="true">
        {invitation.coverImage && <Image src={invitation.coverImage} alt="" fill priority sizes="calc(100vw - 500px)" />}
      </aside>
      <div className={styles.shell}>
        <div className={styles.content} aria-hidden={!opened}>
          <OpeningHero invitation={invitation} active={opened} />
          <QuoteAndWelcome invitation={invitation} />
          <Couple invitation={invitation} />
          {firstDate && <Countdown date={firstDate} />}
          <Events invitation={invitation} />
          {invitation.videoUrl && <LiveStream url={invitation.videoUrl} />}
          {invitation.gallery.length > 0 && <Gallery invitation={invitation} />}
          {invitation.story.length > 0 && <Story invitation={invitation} />}
          {invitation.gifts.length > 0 && <Gifts invitation={invitation} />}
          <Guestbook invitation={invitation} />
          <Footer invitation={invitation} />
        </div>
        {invitation.musicUrl && <audio ref={audioRef} src={invitation.musicUrl} loop />}
        <AnimatePresence>{!opened && <Cover key="cover" invitation={invitation} onOpen={() => void openInvitation()} />}</AnimatePresence>
        <AnimatePresence>
          {opened && (
            <motion.div className={styles.controls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
              <FloatingActions isPlaying={isPlaying} toggle={() => void toggle()} />
              <FloatingNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
