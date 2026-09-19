"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import type { EventItem, GiftAccount, InvitationData } from "@/types/invitation";
import baseStyles from "../adat-bali/style.module.css";
import Loading from "../adat-bali/Loading";
import MusicPlayer from "../adat-bali/MusicPlayer";
import FloatingMenu from "../adat-bali/FloatingMenu";
import styles from "./style.module.css";

const themeVariables = {
  "--maroon": "#3a125b",
  "--maroon-bright": "#6e2ca0",
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
            <span className={styles.envelope} aria-hidden="true">✉</span>
            <span>Buka Undangan</span>
          </button>
          <small>Mohon maaf apabila ada kesalahan penulisan nama/gelar</small>
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
        <span className={styles.scrollCue} aria-hidden="true"><i /></span>
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
          ◎ {person.instagram.replace("@", "")}
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
            ▣ &nbsp; Save on the calendar
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
        <b>⌖</b>
        <strong>{event.location || "Tempat acara"}</strong>
        <span>Lokasi acara mempelai</span>
      </div>
      {(invitation.mapsUrl || invitation.mapsEmbedUrl) && (
        <a className={styles.purpleButton} href={invitation.mapsUrl || invitation.mapsEmbedUrl || "#"} target="_blank" rel="noreferrer">
          ⌖ &nbsp; Google Maps
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
              ✈ &nbsp; {submitting ? "Mengirim..." : "Kirim"}
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
        {copied ? "Tersalin" : "Salin Nomor Rekening"}
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
          {showAccounts ? "◉  Sembunyikan" : "◉  Lihat Rekening"}
        </button>
        {showAccounts && (
          <>
            {invitation.gifts.map((account) => <ReferenceGiftCard account={account} key={account.owner} />)}
            <div className={styles.giftAddress}>
              <span aria-hidden="true">🎁</span>
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
            ✈ &nbsp; {submitted ? "Terkirim" : submitting ? "Mengirim..." : "Kirim"}
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
        <div className={styles.videoTeaser}>
          <h2>Video Opening</h2>
          <p>Saksikan video opening resmi Adat Bali dari Vistiq Invitation.</p>
          <a className={styles.purpleButton} href="#bukaUndangan">▶ &nbsp; Lihat Video Opening</a>
        </div>
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
          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
