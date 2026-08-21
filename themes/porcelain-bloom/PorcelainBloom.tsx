/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import {
  FloatingPearls,
  PorcelainCorner,
  PorcelainDivider,
} from "./PorcelainAccents";
import styles from "./style.module.css";

function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <Reveal>
      <div className={light ? styles.headingLight : undefined}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <PorcelainDivider />
      </div>
    </Reveal>
  );
}

function Loading() {
  return (
    <motion.div
      className={styles.loading}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
    >
      <div className={styles.loadingPlate}>
        <span>V</span>
        <small>Porcelain Bloom</small>
      </div>
    </motion.div>
  );
}

function Cover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";

  return (
    <motion.section
      className={styles.cover}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {invitation.coverImage && (
        <motion.img
          className={styles.coverImage}
          src={invitation.coverImage}
          alt={`Foto ${(invitation.bride.nickname || invitation.bride.name)} dan ${(invitation.groom.nickname || invitation.groom.name)}`}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
        />
      )}
      <div className={styles.coverWash} />
      <div className={styles.coverFrame} aria-hidden="true">
        <span />
      </div>
      <PorcelainCorner className={`${styles.corner} ${styles.cornerTopLeft}`} />
      <PorcelainCorner
        className={`${styles.corner} ${styles.cornerTopRight}`}
        mirrored
      />
      <PorcelainCorner
        className={`${styles.corner} ${styles.cornerBottomLeft}`}
        mirrored
      />
      <PorcelainCorner className={`${styles.corner} ${styles.cornerBottomRight}`} />

      <motion.div
        className={styles.coverMonogram}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9 }}
      >
        <span>{(invitation.bride.nickname || invitation.bride.name).charAt(0)}</span>
        <i>&amp;</i>
        <span>{(invitation.groom.nickname || invitation.groom.name).charAt(0)}</span>
      </motion.div>

      <motion.div
        className={styles.coverCard}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
      >
        <p className={styles.coverLabel}>
          {invitation.opening?.title || "The Wedding Celebration"}
        </p>
        <h1 className={styles.coverNames}>
          {(invitation.bride.nickname || invitation.bride.name)}
          <span>&amp;</span>
          {(invitation.groom.nickname || invitation.groom.name)}
        </h1>
        <PorcelainDivider className={styles.coverDivider} />
        {invitation.events[0]?.date && (
          <p className={styles.coverDate}>{invitation.events[0].date}</p>
        )}

        <div className={styles.guestPanel}>
          <small>Kepada Yth.</small>
          <strong>{guestName}</strong>
          <button className={styles.primaryButton} onClick={() => setOpened(true)}>
            <span>Buka Undangan</span>
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

function Hero({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={`${styles.section} ${styles.hero}`}>
      <PorcelainCorner className={`${styles.sectionCorner} ${styles.sectionCornerLeft}`} />
      <Reveal>
        <div className={styles.heroCrest} aria-hidden="true">
          <span>{(invitation.bride.nickname || invitation.bride.name).charAt(0)}</span>
          <i>&amp;</i>
          <span>{(invitation.groom.nickname || invitation.groom.name).charAt(0)}</span>
        </div>
        <p className={styles.arabic}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h2 className={styles.heroTitle}>
          Dua hati, satu janji,<br />sebuah kisah untuk selamanya.
        </h2>
        <p className={styles.heroCopy}>
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami, {(invitation.bride.nickname || invitation.bride.name)}
          {" "}&amp; {(invitation.groom.nickname || invitation.groom.name)}.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <blockquote className={styles.verseCard}>
          <span className={styles.quoteMark}>“</span>
          <p>
            Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat
            ketenangan hati padanya.
          </p>
          <cite>QS. Ar-Rum : 21</cite>
        </blockquote>
      </Reveal>
    </div>
  );
}

function PersonCard({
  person,
  role,
  delay,
}: {
  person: InvitationData["groom"] | InvitationData["bride"];
  role: "Putra" | "Putri";
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className={styles.personCard}>
        <div className={styles.cameoWrap}>
          <div className={styles.pearlRing} aria-hidden="true" />
          <div className={styles.cameoFrame}>
            {person.photo && <img src={person.photo} alt={person.name} />}
          </div>
          <span className={styles.cameoBow} aria-hidden="true">
            <i />
          </span>
        </div>
        <p className={styles.personRole}>{role} Tercinta</p>
        <h3>{person.name}</h3>
        {person.parents && (
          <p className={styles.personParents}>
            {role} dari<br />{person.parents}
          </p>
        )}
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            @{person.instagram.replace("@", "")}
          </a>
        )}
      </article>
    </Reveal>
  );
}

function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={`${styles.section} ${styles.coupleSection}`}>
      <SectionHeading eyebrow="Bride & Groom" title="Mempelai" />
      <div className={styles.coupleGrid}>
        <PersonCard person={invitation.bride} role="Putri" delay={0.08} />
        <Reveal delay={0.16} className={styles.coupleAmpersand}>
          <span>&amp;</span>
        </Reveal>
        <PersonCard person={invitation.groom} role="Putra" delay={0.24} />
      </div>
    </div>
  );
}

function Story({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={`${styles.section} ${styles.storySection}`}>
      <SectionHeading eyebrow="Our Journey" title="Cerita Kita" />
      <div className={styles.storyRibbon} aria-hidden="true" />
      <div className={styles.storyList}>
        {invitation.story.map((item, index) => (
          <Reveal key={`${item.year}-${item.title}`} delay={Math.min(index * 0.1, 0.3)}>
            <article className={styles.storyCard}>
              <span className={styles.storyNumber}>{String(index + 1).padStart(2, "0")}</span>
              <p className={styles.storyYear}>{item.year}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Countdown({ targetDate }: { targetDate: string }) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = Math.max(0, target - now);
  const values = [
    [Math.floor(distance / 86_400_000), "Hari"],
    [Math.floor((distance / 3_600_000) % 24), "Jam"],
    [Math.floor((distance / 60_000) % 60), "Menit"],
    [Math.floor((distance / 1000) % 60), "Detik"],
  ];

  return (
    <div className={styles.countdownBand}>
      <PorcelainCorner className={`${styles.bandCorner} ${styles.bandCornerLeft}`} />
      <PorcelainCorner className={`${styles.bandCorner} ${styles.bandCornerRight}`} mirrored />
      <Reveal>
        <p className={styles.eyebrow}>Save The Date</p>
        <h2 className={styles.sectionTitle}>Menuju Hari Bahagia</h2>
      </Reveal>
      <div className={styles.countdownGrid}>
        {values.map(([value, label], index) => (
          <Reveal key={label} delay={index * 0.07}>
            <div className={styles.countdownItem}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Events({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={`${styles.section} ${styles.eventSection}`}>
      <SectionHeading eyebrow="Wedding Day" title="Rangkaian Acara" />
      <div className={styles.eventGrid}>
        {invitation.events.map((event, index) => (
          <Reveal key={`${event.name}-${event.date}`} delay={index * 0.12}>
            <article className={styles.eventCard}>
              <span className={styles.eventIndex}>0{index + 1}</span>
              <div className={styles.eventMedallion} aria-hidden="true">✦</div>
              <h3>{event.name}</h3>
              <p className={styles.eventDate}>{event.date}</p>
              <p className={styles.eventTime}>{event.time}</p>
              <span className={styles.eventRule} />
              <p className={styles.eventLocation}>{event.location}</p>
              {invitation.mapsUrl && (
                <a
                  className={styles.outlineButton}
                  href={invitation.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Petunjuk Lokasi
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Gallery({ invitation }: { invitation: InvitationData }) {
  const photos = invitation.gallery.slice(0, 9);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [activeIndex]);

  return (
    <div className={styles.gallerySection}>
      <div className={styles.section}>
        <SectionHeading eyebrow="Captured With Love" title="Galeri Bahagia" light />
        <div className={styles.galleryGrid}>
          {photos.map((photo, index) => (
            <Reveal key={photo} delay={Math.min(index * 0.05, 0.3)}>
              <button
                className={`${styles.galleryItem} ${index === 0 || index === 3 ? styles.galleryTall : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Buka foto galeri ${index + 1}`}
              >
                <img src={photo} alt="" loading="lazy" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setActiveIndex(null)}
              aria-label="Tutup galeri"
            >
              ×
            </button>
            <motion.img
              src={photos[activeIndex]}
              alt=""
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getVideoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
  } catch {
    return url;
  }
  return url;
}

function Video({ invitation }: { invitation: InvitationData }) {
  if (!invitation.videoUrl) return null;
  return (
    <div className={styles.section}>
      <SectionHeading eyebrow="A Little Film" title="Our Moment" />
      <Reveal delay={0.1}>
        <div className={styles.videoFrame}>
          <iframe
            src={getVideoEmbedUrl(invitation.videoUrl)}
            title="Video kedua mempelai"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Reveal>
    </div>
  );
}

function Maps({ invitation }: { invitation: InvitationData }) {
  if (!invitation.mapsEmbedUrl && !invitation.mapsUrl) return null;
  return (
    <div className={`${styles.section} ${styles.mapsSection}`}>
      <SectionHeading eyebrow="Find The Place" title="Lokasi Acara" />
      <Reveal delay={0.1}>
        <div className={styles.mapFrame}>
          {invitation.mapsEmbedUrl && (
            <iframe
              src={invitation.mapsEmbedUrl}
              title="Peta lokasi acara"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
          <div className={styles.mapRibbon}>
            <span>We cannot wait to celebrate with you</span>
            {invitation.mapsUrl && (
              <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">
                Buka Google Maps
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function GiftCard({
  account,
  copied,
  onCopy,
}: {
  account: GiftAccount;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className={styles.giftCard}>
      <div className={styles.giftChip} aria-hidden="true" />
      <p>{account.owner}</p>
      {account.bankName && <h3>{account.bankName}</h3>}
      {account.accountNumber && <strong>{account.accountNumber}</strong>}
      {account.accountName && <small>a.n. {account.accountName}</small>}
      {account.accountNumber && (
        <button onClick={onCopy}>{copied ? "Nomor Tersalin" : "Salin Nomor"}</button>
      )}
    </article>
  );
}

function Gift({ invitation }: { invitation: InvitationData }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyNumber = async (account: GiftAccount, index: number) => {
    if (!account.accountNumber) return;
    await navigator.clipboard.writeText(account.accountNumber);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className={`${styles.section} ${styles.giftSection}`}>
      <SectionHeading eyebrow="Wedding Gift" title="Tanda Kasih" />
      <Reveal>
        <p className={styles.sectionIntro}>
          Doa restu Anda merupakan hadiah terindah. Namun apabila berkenan
          memberikan tanda kasih, dapat disampaikan melalui rekening berikut.
        </p>
      </Reveal>
      <div className={styles.giftGrid}>
        {invitation.gifts.map((account, index) => (
          <Reveal key={`${account.owner}-${index}`} delay={index * 0.1}>
            <GiftCard
              account={account}
              copied={copiedIndex === index}
              onCopy={() => copyNumber(account, index)}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function RSVP({ invitation }: { invitation: InvitationData }) {
  const { counts, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Nama dan ucapan wajib diisi.");
      return;
    }
    const result = await submit({ name, whatsapp, attendance, message });
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    setWhatsapp("");
    setAttendance("Hadir");
    setMessage("");
  };

  return (
    <div className={styles.rsvpSection}>
      <div className={styles.section}>
        <SectionHeading eyebrow="Kindly Respond" title="Konfirmasi Kehadiran" light />
        <div className={styles.rsvpLayout}>
          <Reveal>
            <div className={styles.rsvpSummary}>
              <p>Kehadiran Anda akan membuat hari bahagia kami semakin berkesan.</p>
              <div className={styles.rsvpCounts}>
                {[
                  [counts.hadir, "Hadir"],
                  [counts.tidakHadir, "Tidak Hadir"],
                  [counts.raguRagu, "Masih Ragu"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {submitted ? (
              <div className={styles.successCard}>
                <span>✓</span>
                <h3>Terima Kasih</h3>
                <p>Konfirmasi dan ucapan Anda sudah terkirim.</p>
              </div>
            ) : (
              <form className={styles.rsvpForm} onSubmit={handleSubmit}>
                <label>
                  Nama
                  <input value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label>
                  Nomor WhatsApp <small>(opsional)</small>
                  <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
                </label>
                <label>
                  Konfirmasi
                  <select
                    value={attendance}
                    onChange={(event) => setAttendance(event.target.value as Attendance)}
                  >
                    <option>Hadir</option>
                    <option>Tidak Hadir</option>
                    <option>Masih Ragu</option>
                  </select>
                </label>
                <label>
                  Ucapan dan Doa
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    required
                  />
                </label>
                <button className={styles.primaryButton} disabled={submitting}>
                  {submitting ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>
                {error && <p className={styles.formError}>{error}</p>}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Wishes({ invitation }: { invitation: InvitationData }) {
  const { entries, hasMore, loadMore, totalCount } = useRsvpWishes(invitation.id);
  return (
    <div className={`${styles.section} ${styles.wishesSection}`}>
      <SectionHeading eyebrow="Wedding Wishes" title="Ucapan & Doa" />
      {totalCount === 0 ? (
        <p className={styles.emptyWishes}>Jadilah yang pertama mengirimkan ucapan dan doa.</p>
      ) : (
        <>
          <div className={styles.wishesGrid}>
            {entries.map((entry, index) => (
              <Reveal key={entry.id} delay={Math.min(index * 0.06, 0.3)}>
                <article className={styles.wishCard}>
                  <span className={styles.wishQuote}>“</span>
                  <p>{entry.message}</p>
                  <div>
                    <strong>{entry.name}</strong>
                    <small>{entry.attendance}</small>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {hasMore && (
            <button className={styles.loadMore} onClick={loadMore}>
              Muat Lebih Banyak
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <PorcelainCorner className={`${styles.footerCorner} ${styles.footerCornerLeft}`} />
      <PorcelainCorner className={`${styles.footerCorner} ${styles.footerCornerRight}`} mirrored />
      <Reveal>
        <div className={styles.footerCrest}>
          {(invitation.bride.nickname || invitation.bride.name).charAt(0)}
          <span>&amp;</span>
          {(invitation.groom.nickname || invitation.groom.name).charAt(0)}
        </div>
        <p>Terima kasih atas doa, restu, dan kehadiran Anda.</p>
        <h2>
          {(invitation.bride.nickname || invitation.bride.name)}
          <span>&amp;</span>
          {(invitation.groom.nickname || invitation.groom.name)}
        </h2>
        <small>{invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" style={{height:16,verticalAlign:"middle",marginRight:6,display:"inline-block"}}/>}© {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}</small>
      </Reveal>
    </footer>
  );
}

function MusicPlayer({ url }: { url: string | null }) {
  const { audioRef, isPlaying, toggle } = useMusicPlayer(url);
  if (!url) return null;
  return (
    <>
      <audio ref={audioRef} src={url} loop />
      <button
        className={`${styles.musicButton} ${isPlaying ? styles.musicPlaying : ""}`}
        onClick={toggle}
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      >
        <span>{isPlaying ? "Ⅱ" : "♪"}</span>
      </button>
    </>
  );
}

const navItems = [
  ["home", "⌂", "Home"],
  ["couple", "♡", "Mempelai"],
  ["story", "⌁", "Cerita"],
  ["event", "◇", "Acara"],
  ["gallery", "▦", "Galeri"],
  ["gift", "♧", "Hadiah"],
  ["rsvp", "✉", "RSVP"],
];

function FloatingMenu() {
  return (
    <nav className={styles.floatingMenu} aria-label="Navigasi undangan">
      {navItems.map(([id, icon, label]) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          aria-label={label}
        >
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function PorcelainBloom({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const weddingDate = invitation.events[0]?.rawDate || null;

  return (
    <div className={styles.root}>
      <AnimatePresence>{!ready && <Loading key="loading" />}</AnimatePresence>
      {ready && !opened && <Cover invitation={invitation} />}

      {ready && opened && (
        <>
          <FloatingPearls />
          <section id="home"><Hero invitation={invitation} /></section>
          <PorcelainDivider className={styles.sectionBreak} />
          <section id="couple"><Couple invitation={invitation} /></section>
          {invitation.story.length > 0 && <section id="story"><Story invitation={invitation} /></section>}
          {weddingDate && <section id="countdown"><Countdown targetDate={weddingDate} /></section>}
          <section id="event"><Events invitation={invitation} /></section>
          {invitation.gallery.length > 0 && <section id="gallery"><Gallery invitation={invitation} /></section>}
          <Video invitation={invitation} />
          <section id="maps"><Maps invitation={invitation} /></section>
          {invitation.gifts.length > 0 && <section id="gift"><Gift invitation={invitation} /></section>}
          <section id="rsvp"><RSVP invitation={invitation} /></section>
          <Wishes invitation={invitation} />
          <Footer invitation={invitation} />
          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}

