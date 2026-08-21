"use client";

import type { InvitationData } from "@/types/invitation";
import Gift from "@/themes/jawa-merah/Gift";
import RSVP from "@/themes/jawa-merah/RSVP";
import Wishes from "@/themes/jawa-merah/Wishes";
import Footer from "@/themes/jawa-merah/Footer";
import styles from "./premium.module.css";

export default function PremiumContent({ invitation }: { invitation: InvitationData }) {
  const couplePhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;

  return (
    <main className={styles.page}>
      <section id="home" className={styles.welcome}>
        <div className={styles.calendarButtons}>
          <button type="button">Simpan ke Google Calendar</button>
          <button type="button">Simpan ke Outlook</button>
        </div>
        <div className={styles.joglo}><i /><i /><i /></div>
        <img className={styles.welcomeFlowers} src="/decor/jawa-merah/floral-spray.png" alt="" />
        <p>{invitation.opening.description || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."}</p>
      </section>

      <section id="couple" className={styles.couple}>
        <p className={styles.eyebrow}>The Royal Wedding Of</p>
        {couplePhoto && <div className={styles.ovalPhoto}><img src={couplePhoto} alt="" /></div>}
        <h1>{(invitation.groom.nickname || invitation.groom.name)}<em>&amp;</em>{(invitation.bride.nickname || invitation.bride.name)}</h1>
        <p>{invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya."}</p>
        <small>{invitation.opening.quoteSource || "QS. Ar-Rum: 21"}</small>
      </section>

      <section id="event" className={styles.events}>
        <p className={styles.eyebrow}>Save The Date</p>
        <h2>Rangkaian Acara</h2>
        <div className={styles.eventGrid}>
          {invitation.events.map((event) => (
            <article key={`${event.name}-${event.date}`}>
              <h3>{event.name}</h3>
              <b>{event.date}</b>
              <span>{event.time}</span>
              <p>{event.location}</p>
              {invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">Lihat Lokasi</a>}
            </article>
          ))}
        </div>
      </section>

      {invitation.gallery.length > 0 && (
        <section id="gallery" className={styles.gallery}>
          <p className={styles.eyebrow}>Our Moments</p><h2>Galeri Pernikahan</h2>
          <div>{invitation.gallery.map((photo, index) => <img key={photo} src={photo} alt={`Galeri ${index + 1}`} />)}</div>
        </section>
      )}

      {invitation.story.length > 0 && (
        <section id="story" className={styles.story}>
          <p className={styles.eyebrow}>Love Story</p><h2>Perjalanan Kami</h2>
          {invitation.story.map((item) => <article key={`${item.year}-${item.title}`}><time>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </section>
      )}

      <div className={styles.legacy}>
        {invitation.gifts.length > 0 && <section id="gift"><Gift invitation={invitation} /></section>}
        <section id="rsvp"><RSVP invitation={invitation} /></section>
        <Wishes invitation={invitation} />
        <Footer invitation={invitation} />
      </div>
    </main>
  );
}
