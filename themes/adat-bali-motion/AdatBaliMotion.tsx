"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { EventItem, GiftAccount, InvitationData } from "@/types/invitation";
import baseStyles from "../adat-bali/style.module.css";
import Loading from "../adat-bali/Loading";
import styles from "./style.module.css";

const themeVariables = {
  "--maroon": "#8f7398",
  "--maroon-bright": "#b9a0bf",
  "--black": "#100719",
  "--gold": "#d8b872",
  "--cream": "rgba(255, 255, 255, 0.95)",
  "--ink": "#1c1026",
  "--muted": "rgba(255, 255, 255, 0.72)",
  "--reference-serif": "var(--font-inria-serif), Georgia, serif",
  "--reference-script": "var(--font-pinyon-script), cursive",
  "--reference-display": "var(--font-cormorant-infant), Georgia, serif",
  "--reference-sans": "var(--font-poppins), Arial, sans-serif",
  "--reference-roboto": "var(--font-roboto), Arial, sans-serif",
} as CSSProperties;

type IconProps = { className?: string };

function EnvelopeIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
}

function InstagramIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor"/></svg>;
}

function MapPinIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;
}

function CalendarIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M7 3v4m10-4v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function SendIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7 18-4-7-7-4 18-7Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m10 14 5-5" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;
}

function GiftIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18v11H3zm-1-5h20v5H2zM12 5v16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 5c-1.5 0-5-.4-5-2.4C7 .8 10.7 1.3 12 5Zm0 0c1.5 0 5-.4 5-2.4 0-1.8-3.7-1.3-5 2.4Z" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;
}

function CopyIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;
}

function MusicIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/></svg>;
}

function LiveIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4 0a6 6 0 0 0 0-8.4M4.9 4.9a10 10 0 0 0 0 14.2m14.2 0a10 10 0 0 0 0-14.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function PauseIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14m8-14v14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>;
}

function CompactMusicPlayer({ url }: { url: string | null }) {
  const { audioRef, isPlaying, toggle } = useMusicPlayer(url);
  if (!url) return null;

  return <>
    <audio ref={audioRef} src={url} loop preload="none" />
    <button className={`${styles.musicControl} ${isPlaying ? styles.musicControlPlaying : ""}`} type="button" onClick={() => void toggle()} aria-label={isPlaying ? "Jeda musik" : "Putar musik"}>
      {isPlaying ? <PauseIcon /> : <MusicIcon />}
    </button>
  </>;
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function shortName(name: string, nickname?: string | null) {
  return nickname || name.split(/\s+/)[0] || name;
}

function eventDateParts(event: EventItem) {
  const raw = event.rawDate || "";
  const datePart = raw.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return { weekday: "", day: "", month: "", year: "" };
  }

  const weekday = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  return {
    weekday,
    day: String(day),
    month: MONTHS[month - 1] || "",
    year: String(year),
  };
}

function calendarUrl(event: EventItem) {
  if (!event.rawDate) return null;
  const [datePart, timePart = "00:00:00"] = event.rawDate.split("T");
  const [hour = "00", minute = "00"] = timePart.split(":");
  const start = `${datePart.replaceAll("-", "")}T${hour}${minute}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${start}/${start}`,
    location: event.location,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function ReferenceCover({ invitation }: { invitation: InvitationData }) {
  const { setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guest = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const groom = shortName(invitation.groom.name, invitation.groom.nickname);
  const bride = shortName(invitation.bride.name, invitation.bride.nickname);

  return (
    <section className={styles.cover} aria-label="Sampul undangan">
      <div
        className={styles.coverImage}
        style={
          invitation.coverImage
            ? { backgroundImage: `url("${invitation.coverImage}")` }
            : undefined
        }
      />
      <div className={styles.coverOverlay} />

      <div className={styles.coverPanel}>
        <div className={styles.coverBottom}>
          <div className={styles.coverTitleGroup}>
            <h2>The Wedding of</h2>
            <h1>
              {groom} <span>&amp;</span> {bride}
            </h1>
          </div>

          <div className={styles.coverGuest}>
            <p>
              Kepada Yth.
              <br />
              {guest}
            </p>
            <button type="button" onClick={() => setOpened(true)}>
              <EnvelopeIcon className={styles.envelope} />
              <span>Buka Undangan</span>
            </button>
            <small>Mohon maaf apabila ada kesalahan penulisan nama/gelar</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function OpeningVideo({
  invitation,
  onFinished,
}: {
  invitation: InvitationData;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const reveal = () => setRevealed(true);
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setRevealed(true);
      onFinished();
    };

    if (!video) {
      const fallbackTimer = window.setTimeout(finish, 900);
      return () => window.clearTimeout(fallbackTimer);
    }

    const handleTimeUpdate = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 20;
      if (video.currentTime >= Math.max(0, duration - 2)) reveal();
    };

    video.currentTime = 0;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    const fallbackTimer = window.setTimeout(finish, 22_000);
    void video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      window.clearTimeout(fallbackTimer);
    };
  }, [invitation.videoUrl, onFinished]);

  const groom = shortName(invitation.groom.name, invitation.groom.nickname);
  const bride = shortName(invitation.bride.name, invitation.bride.nickname);
  const date = invitation.coverEvent?.date || invitation.events[0]?.date || "";

  return (
    <section id="bukaUndangan" className={styles.opening} aria-label="Video opening undangan">
      {invitation.videoUrl ? (
        <video
          ref={videoRef}
          className={styles.openingVideo}
          src={invitation.videoUrl}
          poster={invitation.coverImage || undefined}
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-label="Video opening 3D Adat Bali"
        />
      ) : (
        <div className={styles.openingFallback} />
      )}

      <div className={styles.openingShade} />
      <div className={`${styles.openingCopy} ${revealed ? styles.openingCopyVisible : ""}`}>
        <h2>The Wedding of</h2>
        <h1>{groom}</h1>
        <p className={styles.openingAmpersand}>&amp;</p>
        <h1>{bride}</h1>
        {date && <p className={styles.openingDate}>{date}</p>}
        <div className={styles.scrollPrompt} aria-hidden="true">
          <span className={styles.scrollCue}><i /></span>
          <small>Scroll ke bawah</small>
        </div>
      </div>
    </section>
  );
}

function ReferencePerson({
  person,
  relation,
}: {
  person: InvitationData["groom"] | InvitationData["bride"];
  relation: string;
}) {
  const name = shortName(person.name, person.nickname);

  return (
    <article className={styles.couplePerson}>
      {person.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.photo} alt={person.name} />
      )}
      <h3>{name}</h3>
      <p>{person.name}</p>
      <span>{relation}</span>
      <strong>{person.parents || "Keluarga tercinta"}</strong>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace("@", "")}`}
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon className={styles.inlineIcon} />
          {person.instagram.replace("@", "")}
        </a>
      )}
    </article>
  );
}

function ReferenceCountdown({ invitation }: { invitation: InvitationData }) {
  const target = invitation.coverEvent?.rawDate || invitation.events[0]?.rawDate || null;
  const time = useCountdown(target);
  const items = [
    { label: "D", value: time.days },
    { label: "H", value: time.hours },
    { label: "M", value: time.minutes },
    { label: "S", value: time.seconds },
  ];
  const mainEvent = invitation.coverEvent || invitation.events[0];

  return (
    <section className={styles.countdownSection}>
      <div className={styles.countdownCard}>
        <h2>Save the Date</h2>
        <div className={styles.referenceCountdown}>
          {items.map((item) => (
            <div className={styles.referenceCountdownItem} key={item.label}>
              <strong>{String(item.value).padStart(2, "0")}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        {mainEvent && calendarUrl(mainEvent) && (
          <a className={styles.goldButton} href={calendarUrl(mainEvent) || "#"} target="_blank" rel="noreferrer">
            <CalendarIcon className={styles.inlineIcon} /> Save on the calendar
          </a>
        )}
        <p>
          Maka sareng ring puniki, kawedarang wantah pangundang ring Bapak/Ibu/Saudara/Saudari sami,
          dumogi karsayang ngerauhin sareng nyarengin upacara pawiwahan kami.
        </p>
      </div>
    </section>
  );
}

function ReferenceEventCard({ invitation, event }: { invitation: InvitationData; event: EventItem }) {
  const parts = eventDateParts(event);
  return (
    <article className={styles.eventCardReference}>
      <div className={styles.eventOrnament} aria-hidden="true">✦</div>
      <h2>{event.name}</h2>
      <div className={styles.eventDate}>
        <span>{parts.weekday}</span>
        <strong>{parts.day}</strong>
        <small>{parts.month} {parts.year}</small>
      </div>
      <p className={styles.eventTime}>Pukul {event.time || "11.00 WIB s/d selesai"}</p>
      <div className={styles.eventLocation}>
        <b><MapPinIcon /></b>
        <strong>{event.location || "Tempat acara"}</strong>
        <span>Lokasi acara mempelai</span>
      </div>
      {(invitation.mapsUrl || invitation.mapsEmbedUrl) && (
        <a className={styles.purpleButton} href={invitation.mapsUrl || invitation.mapsEmbedUrl || "#"} target="_blank" rel="noreferrer">
          <MapPinIcon className={styles.inlineIcon} /> Google Maps
        </a>
      )}
    </article>
  );
}

function ReferenceRsvp({ invitation }: { invitation: InvitationData }) {
  const { submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    const result = await submit({
      name,
      whatsapp: "",
      attendance,
      message: "Konfirmasi kehadiran",
    });

    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
  };

  return (
    <section className={styles.rsvpSection}>
      <div className={styles.darkPanel}>
        <h2>Rsvp</h2>
        <p>Mohon kesediaannya untuk mengisi konfirmasi kehadiran melalui form di bawah ini.</p>
        {submitted ? (
          <p className={styles.successMessage}>RSVP Anda berhasil disimpan.</p>
        ) : (
          <form className={styles.referenceForm} onSubmit={handleSubmit}>
            <label>
              Nama Anda
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama Anda" />
            </label>
            <label>
              Konfirmasi Kehadiran
              <select value={attendance} onChange={(event) => setAttendance(event.target.value as Attendance)}>
                <option>Hadir</option>
                <option>Tidak Hadir</option>
                <option>Masih Ragu</option>
              </select>
            </label>
            <button className={styles.purpleButton} type="submit" disabled={submitting}>
              <SendIcon className={styles.inlineIcon} /> {submitting ? "Mengirim..." : "Kirim"}
            </button>
            {error && <small className={styles.formError}>{error}</small>}
          </form>
        )}
      </div>
    </section>
  );
}

function ReferenceGallery({ invitation }: { invitation: InvitationData }) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const photos = invitation.gallery.slice(0, 6);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryWrap}>
        <div className={styles.referenceGallery}>
          {photos.map((photo, index) => (
            <button className={styles.galleryTile} key={photo} type="button" onClick={() => setActivePhoto(index)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
      {activePhoto !== null && photos[activePhoto] && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" onClick={() => setActivePhoto(null)}>
          <button type="button" onClick={() => setActivePhoto(null)} aria-label="Tutup foto">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[activePhoto]} alt="" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function ReferenceStory({ invitation }: { invitation: InvitationData }) {
  const storyPhotos = invitation.gallery.slice(0, 4).reverse();
  const fallbackPhotos = invitation.gallery.slice(0, 4);

  return (
    <section className={styles.storySection}>
      <div className={styles.storyPanel}>
        <h2>Love Story</h2>
        <div className={styles.storyList}>
          {invitation.story.map((item, index) => (
            <article className={styles.storyItem} key={`${item.title}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={storyPhotos[index] || fallbackPhotos[index] || invitation.coverImage || ""} alt="" loading="lazy" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferenceGiftCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    if (!account.accountNumber) return;
    await navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className={styles.giftCardReference}>
      <span className={styles.giftLogo}>{account.bankName || "Gift"}</span>
      <span className={styles.giftChip} aria-hidden="true" />
      <strong>{account.accountNumber || "—"}</strong>
      <small>a.n {account.accountName || account.owner}</small>
      <button type="button" onClick={copyNumber}>
        <CopyIcon className={styles.inlineIcon} /> {copied ? "Tersalin" : "Salin Nomor Rekening"}
      </button>
    </article>
  );
}

function ReferenceGift({ invitation }: { invitation: InvitationData }) {
  const [showAccounts, setShowAccounts] = useState(false);
  if (invitation.gifts.length === 0) return null;

  return (
    <section className={styles.giftSection}>
      <div className={styles.giftPanel}>
        <h2>Love Gift</h2>
        <p className={styles.giftDescription}>
          Kehadiran Anda merupakan hadiah terindah. Namun, apabila Anda hendak memberikan tanda kasih kepada kami, dapat melalui fitur di bawah ini.
        </p>
        <button className={styles.purpleButton} type="button" onClick={() => setShowAccounts((value) => !value)}>
          <GiftIcon className={styles.inlineIcon} /> {showAccounts ? "Sembunyikan" : "Lihat Rekening"}
        </button>
        {showAccounts && (
          <>
            {invitation.gifts.map((account) => <ReferenceGiftCard account={account} key={account.owner} />)}
            <div className={styles.giftAddress}>
              <GiftIcon className={styles.giftAddressIcon} />
              <strong>{shortName(invitation.groom.name, invitation.groom.nickname)} &amp; {shortName(invitation.bride.name, invitation.bride.nickname)}</strong>
              <small>Gedung Serbaguna Vistiq, Jakarta</small>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ReferenceWishes({ invitation }: { invitation: InvitationData }) {
  const { entries, hasMore, loadMore, submit, submitting, submitted } = useRsvpWishes(invitation.id);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
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
  };

  return (
    <section className={styles.wishesSection}>
      <div className={styles.wishesPanel}>
        <h2>Ucapan &amp; Doa</h2>
        <p>Berikan doa dan ucapan terbaik Anda untuk mengiringi langkah bahagia kedua mempelai.</p>
        <form className={styles.wishesForm} onSubmit={handleSubmit}>
          <label>
            Nama Anda
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama Anda" />
          </label>
          <label>
            Tulis Ucapan
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} placeholder="Tulis Ucapan" />
          </label>
          <button className={styles.purpleButton} type="submit" disabled={submitting}>
            <SendIcon className={styles.inlineIcon} /> {submitted ? "Terkirim" : submitting ? "Mengirim..." : "Kirim"}
          </button>
          {error && <small className={styles.formError}>{error}</small>}
        </form>

        <div className={styles.wishesFeed}>
          {entries.length === 0 ? (
            <p>Belum ada ucapan. Jadilah tamu pertama yang mengirimkan doa terbaik.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.id}>
                <strong>{entry.name}</strong>
                <span>{entry.attendance}</span>
                <p>{entry.message}</p>
              </article>
            ))
          )}
        </div>
        {hasMore && <button className={styles.loadMore} type="button" onClick={loadMore}>Muat ucapan berikutnya...</button>}
      </div>
    </section>
  );
}

function streamingPlatformLabel(url: string) {
  const value = url.toLowerCase();
  if (value.includes("instagram.com")) return "Instagram";
  if (value.includes("tiktok.com")) return "TikTok";
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "YouTube";
  return "Live Streaming";
}

function ReferenceInvitation({ invitation }: { invitation: InvitationData }) {
  const first = shortName(invitation.groom.name, invitation.groom.nickname);
  const second = shortName(invitation.bride.name, invitation.bride.nickname);

  return (
    <main className={styles.referenceBody}>
      <section className={styles.quoteSection}>
        <div className={styles.quotePanel}>
          <div className={styles.initials} aria-hidden="true">
            <span>{first.charAt(0)}</span><b>&amp;</b><span>{second.charAt(0)}</span>
          </div>
          <p>{invitation.opening.quote || "Wahai pasangan suami-istri, semoga kalian tetap bersatu dan tidak pernah terpisahkan."}</p>
          <h2>{invitation.opening.quoteSource || "RG VEDA X.85.42."}</h2>
        </div>
      </section>

      <section className={styles.coupleSection}>
        <div className={styles.coupleIntro}>
          <h2>Bride &amp; Groom</h2>
          <strong>Om Swastyastu</strong>
          <p>{invitation.opening.description || "Dengan memohon anugerah Ida Sang Hyang Widhi Wasa, kami mengaturkan undangan kepada Bapak/Ibu/Saudara/i untuk berkenan hadir pada Resepsi Pernikahan (Pawiwahan) kami."}</p>
        </div>
        <div className={styles.coupleGrid}>
          <ReferencePerson person={invitation.bride} relation="Putri dari" />
          <div className={styles.coupleAnd}>&amp;</div>
          <ReferencePerson person={invitation.groom} relation="Putra dari" />
        </div>
      </section>

      <ReferenceCountdown invitation={invitation} />

      <section className={styles.eventSection}>
        <div className={styles.eventStack}>
          {invitation.events.map((event) => <ReferenceEventCard invitation={invitation} event={event} key={event.name} />)}
        </div>
        {invitation.liveStreamingUrl && (() => {
          const platform = streamingPlatformLabel(invitation.liveStreamingUrl);
          return (
            <div className={styles.videoTeaser}>
              <h2>Live Streaming</h2>
              <p>Saksikan siaran langsung pernikahan kami melalui {platform}.</p>
              <a className={styles.purpleButton} href={invitation.liveStreamingUrl} target="_blank" rel="noreferrer">
                <LiveIcon className={styles.inlineIcon} /> Buka {platform}
              </a>
            </div>
          );
        })()}
      </section>

      <ReferenceRsvp invitation={invitation} />
      <ReferenceGallery invitation={invitation} />
      <ReferenceStory invitation={invitation} />
      <ReferenceGift invitation={invitation} />
      <ReferenceWishes invitation={invitation} />

      <section className={styles.inviteSection}>
        <div className={styles.invitePanel}>
          <h2>Turut Mengundang</h2>
          <p><b>Keluarga Mempelai Wanita</b><br />1.<br />2.<br />3.<br />4.<br />5.</p>
          <p><b>Keluarga Mempelai Pria</b><br />1.<br />2.<br />3.<br />4.<br />5.</p>
        </div>
      </section>

      <footer className={styles.finalSection}>
        <div className={styles.finalPanel}>
          <p>Suatu kebahagiaan &amp; kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do&apos;a restu kepada kami</p>
          <strong>Kami Yang Berbahagia</strong>
          <h2>{first} &amp; {second}</h2>
        </div>
      </footer>
    </main>
  );
}

export default function AdatBaliMotion({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);
  const [openingFinished, setOpeningFinished] = useState(false);
  const handleOpeningFinished = useCallback(() => setOpeningFinished(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!opened || !openingFinished) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened, openingFinished]);

  return (
    <div className={`${baseStyles.root} ${styles.motionRoot}`} style={themeVariables}>
      {!ready && <Loading />}

      {ready && !opened && <ReferenceCover invitation={invitation} />}

      {ready && opened && (
        <>
          <OpeningVideo invitation={invitation} onFinished={handleOpeningFinished} />
          <ReferenceInvitation invitation={invitation} />
          <CompactMusicPlayer url={invitation.musicUrl} />
        </>
      )}
    </div>
  );
}
