"use client";

import { useMemo, useState } from "react";
import type { InvitationData } from "@/types/invitation";
import { useRsvpWishes, type Attendance } from "@/hooks/useRsvpWishes";
import styles from "./AdatMelayu.module.css";

function img(src: string | null | undefined, fallback: string) {
  return src || fallback;
}

export default function AdatMelayu({ invitation }: { invitation: InvitationData }) {
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [notice, setNotice] = useState("");
  const { entries, submit } = useRsvpWishes(invitation.id);

  const guest = useMemo(() => {
    if (typeof window === "undefined") return "Nama Tamu";
    return new URLSearchParams(window.location.search).get("to") || "Nama Tamu";
  }, []);

  const coverEvent = invitation.coverEvent || invitation.events?.[0] || null;
  const photos = invitation.gallery?.length ? invitation.gallery : [invitation.coverImage].filter(Boolean) as string[];

  async function sendWish() {
    if (!name.trim() || !message.trim()) {
      setNotice("Nama dan ucapan wajib diisi.");
      return;
    }
    if (!invitation.id) {
      setNotice("RSVP aktif pada undangan klien.");
      return;
    }
    const result = await submit({ name: name.trim(), message: message.trim(), whatsapp: "", attendance });
    setNotice(result?.error || "Terima kasih, ucapan Anda sudah terkirim.");
    if (!result?.error) {
      setName("");
      setMessage("");
    }
  }

  return (
    <main className={styles.page}>
      {!opened && (
        <section className={styles.cover}>
          <div className={styles.topOrnament} aria-hidden="true" />
          <div className={styles.coverInner}>
            <div className={styles.crown} aria-hidden="true">✦</div>
            <p className={styles.kicker}>The Wedding of</p>
            <h1>{invitation.groom.nickname || invitation.groom.name} <span>&amp;</span> {invitation.bride.nickname || invitation.bride.name}</h1>
            <p className={styles.dear}>Dear</p>
            <h2>{guest}</h2>
            <button onClick={() => setOpened(true)} className={styles.primary}>Buka Undangan</button>
          </div>
          <div className={styles.bottomOrnament} aria-hidden="true" />
        </section>
      )}

      <div className={opened ? styles.content : `${styles.content} ${styles.hidden}`}>
        <section className={`${styles.section} ${styles.heroSection}`}>
          <div className={styles.malayMotif} aria-hidden="true" />
          <p className={styles.kicker}>The Wedding of</p>
          <h2 className={styles.scriptTitle}>{invitation.groom.nickname || invitation.groom.name} <span>&amp;</span> {invitation.bride.nickname || invitation.bride.name}</h2>
          <p className={styles.lead}>Kami berharap Anda menjadi bagian dari hari istimewa kami.</p>
          {coverEvent && <div className={styles.datePill}>{coverEvent.date}</div>}
          <a className={styles.primary} href="#event">Save The Date</a>
        </section>

        <section className={`${styles.section} ${styles.cream}`}>
          <div className={styles.malayMotifSmall} aria-hidden="true" />
          <h3>{invitation.opening?.greeting || "Assalamu'alaikum Wr. Wb"}</h3>
          <p className={styles.lead}>{invitation.opening?.description || "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami."}</p>

          <div className={styles.coupleGrid}>
            <article className={styles.personCard}>
              <img src={img(invitation.groom.photo, invitation.coverImage || "/logo-vistiq.png")} alt={invitation.groom.name} />
              <h4>{invitation.groom.name}</h4>
              <p>{invitation.groom.parents}</p>
              {invitation.groom.instagram && <a href={invitation.groom.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            </article>
            <div className={styles.ampersand}>&amp;</div>
            <article className={styles.personCard}>
              <img src={img(invitation.bride.photo, invitation.coverImage || "/logo-vistiq.png")} alt={invitation.bride.name} />
              <h4>{invitation.bride.name}</h4>
              <p>{invitation.bride.parents}</p>
              {invitation.bride.instagram && <a href={invitation.bride.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            </article>
          </div>
        </section>

        <div className={styles.patternStrip} aria-hidden="true" />

        <section id="event" className={`${styles.section} ${styles.green}`}>
          <p className={styles.kickerLight}>Save The Date</p>
          <div className={styles.events}>
            {invitation.events.map((event, i) => (
              <article className={styles.eventCard} key={`${event.name}-${i}`}>
                <div className={styles.malayMotifSmall} aria-hidden="true" />
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.time}</p>
                <p>{event.location}</p>
                {event.mapsUrl && <a className={styles.secondary} href={event.mapsUrl} target="_blank" rel="noreferrer">Lihat Lokasi</a>}
              </article>
            ))}
          </div>
        </section>

        <div className={styles.patternStrip} aria-hidden="true" />

        <section className={`${styles.section} ${styles.cream}`}>
          <div className={styles.malayMotifSmall} aria-hidden="true" />
          <blockquote>{invitation.opening?.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya."}</blockquote>
          <p className={styles.quoteSource}>{invitation.opening?.quoteSource || "QS. Ar-Rum : 21"}</p>

          {!!invitation.story?.length && <>
            <h3 className={styles.sectionTitle}>Love Story</h3>
            <div className={styles.storyList}>
              {invitation.story.map((story, i) => (
                <article key={`${story.title}-${i}`}>
                  <span>{story.year}</span>
                  <h4>{story.title}</h4>
                  <p>{story.description}</p>
                </article>
              ))}
            </div>
          </>}
        </section>

        <div className={styles.patternStrip} aria-hidden="true" />

        <section className={`${styles.section} ${styles.green}`}>
          <h3 className={styles.sectionTitleLight}>Galeri Foto</h3>
          <p className={styles.leadLight}>Kenangan indah yang kami simpan dalam perjalanan menuju hari istimewa.</p>
          <div className={styles.gallery}>
            {photos.slice(0, 8).map((photo, i) => <img key={`${photo}-${i}`} src={photo} alt={`Galeri ${i + 1}`} />)}
          </div>
        </section>

        {!!invitation.gifts?.length && <section className={`${styles.section} ${styles.cream}`}>
          <div className={styles.malayMotifSmall} aria-hidden="true" />
          <h3 className={styles.sectionTitle}>Amplop Digital</h3>
          <p className={styles.lead}>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi adalah ungkapan kasih, Anda dapat mengirim hadiah secara cashless.</p>
          <div className={styles.gifts}>
            {invitation.gifts.map((gift, i) => (
              <article className={styles.giftCard} key={`${gift.accountNumber}-${i}`}>
                <b>{gift.bankName || "Bank"}</b>
                <span>{gift.accountNumber}</span>
                <small>a.n. {gift.accountName || gift.owner}</small>
              </article>
            ))}
          </div>
        </section>}

        <div className={styles.patternStrip} aria-hidden="true" />

        <section className={`${styles.section} ${styles.green}`}>
          <div className={styles.malayMotifLight} aria-hidden="true" />
          <h3 className={styles.sectionTitleLight}>Ucapkan Sesuatu</h3>
          <p className={styles.leadLight}>Berikan Ucapan &amp; Doa Restu</p>
          <div className={styles.rsvp}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Kamu" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Berikan Ucapan & Do'a" rows={4} />
            <div className={styles.attendance}>
              {(["Hadir", "Tidak Hadir", "Masih Ragu"] as Attendance[]).map((item) => (
                <button key={item} className={attendance === item ? styles.activeChoice : ""} onClick={() => setAttendance(item)}>{item}</button>
              ))}
            </div>
            <button className={styles.primary} onClick={sendWish}>Kirim Ucapan</button>
            {notice && <p className={styles.notice}>{notice}</p>}
          </div>
          <div className={styles.wishes}>
            {entries.slice(0, 6).map((entry, i) => (
              <article key={`${entry.name}-${i}`}><b>{entry.name}</b><p>{entry.message}</p></article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.closing}`}>
          <div className={styles.malayMotifLight} aria-hidden="true" />
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
          <h3>Kami yang berbahagia,</h3>
          <h2 className={styles.scriptTitle}>{invitation.groom.nickname || invitation.groom.name} <span>&amp;</span> {invitation.bride.nickname || invitation.bride.name}</h2>
          <p>{invitation.closingGreeting || "Wassalamu'alaikum Wr. Wb"}</p>
        </section>
      </div>
    </main>
  );
}
