"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import type { InvitationData } from "@/types/invitation";
import Gift from "@/themes/jawa-merah/Gift";
import RSVP from "@/themes/jawa-merah/RSVP";
import Wishes from "@/themes/jawa-merah/Wishes";
import Footer from "@/themes/jawa-merah/Footer";
import styles from "./premium.module.css";

export default function PremiumContent({ invitation }: { invitation: InvitationData }) {
  const couplePhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const weddingDate = invitation.events[0]?.date;

  const reveal = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: 0.8 },
  };

  return (
    <main className={styles.page}>
      <section id="home" className={styles.openedHero}>
        <motion.div className={styles.heroBase} initial={{ scale: 1.08, opacity: .65 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}>
          <Image src="/decor/royal-java-cover-v2.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" className={styles.heroArtwork} />
        </motion.div>
        <motion.div className={styles.heroTop} aria-hidden="true" initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.25, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
          <Image src="/decor/royal-java-cover-v2.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" className={styles.heroArtwork} />
        </motion.div>
        <motion.div className={styles.heroBottom} aria-hidden="true" initial={{ y: 130, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.45, delay: .18, ease: [0.16, 1, 0.3, 1] }}>
          <Image src="/decor/royal-java-cover-v2.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" className={styles.heroArtwork} />
        </motion.div>
        <motion.div className={styles.heroCloud} aria-hidden="true" initial={{ opacity: .9, scale: .6, x: -80 }} animate={{ opacity: [0.9, .55, 0], scale: [0.6, 1.25, 1.55], x: [-80, 0, 95] }} transition={{ duration: 2.1, ease: "easeOut" }} />
        <motion.div className={styles.heroIdentity} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.15, delay: .72 }}>
          <p>The Royal Wedding Of</p>
          <h1><span>{invitation.groom.nickname || invitation.groom.name}</span><em>&amp;</em><span>{invitation.bride.nickname || invitation.bride.name}</span></h1>
          {weddingDate && <time>{weddingDate}</time>}
        </motion.div>
        <motion.div className={styles.heroGuest} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: 1.15 }}>
          <p>Kepada Yth.</p><strong>{guestName}</strong><span>di Tempat</span>
        </motion.div>
        <motion.div className={styles.scrollCue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} aria-hidden="true"><i /></motion.div>
      </section>

      <section className={styles.foundLove}>
        <motion.div {...reveal}>
          <span className={styles.flowerMark}>❦</span>
          <p className={styles.scriptTitle}>We Found Love</p>
          <p>{invitation.opening.quote || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya."}</p>
          <small>{invitation.opening.quoteSource || "QS. Ar-Rum: 21"}</small>
        </motion.div>
      </section>

      <section id="couple" className={styles.couple}>
        <motion.div {...reveal}>
          <p className={styles.eyebrow}>The Royal Wedding Of</p>
          {couplePhoto && <div className={styles.ovalPhoto}><Image src={couplePhoto} alt="Foto kedua mempelai" fill sizes="235px" /></div>}
          <h1>{(invitation.groom.nickname || invitation.groom.name)}<em>&amp;</em>{(invitation.bride.nickname || invitation.bride.name)}</h1>
          <p className={styles.courtesy}>{invitation.opening.description || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."}</p>
        </motion.div>
      </section>

      <section id="event" className={styles.events}>
        <p className={styles.eyebrow}>Save The Date</p>
        <h2>Rangkaian Acara</h2>
        <motion.div className={styles.eventGrid} {...reveal}>
          {invitation.events.map((event) => (
            <article key={`${event.name}-${event.date}`}>
              <h3>{event.name}</h3>
              <b>{event.date}</b>
              <span>{event.time}</span>
              <p>{event.location}</p>
              {invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">Lihat Lokasi</a>}
            </article>
          ))}
        </motion.div>
      </section>

      {invitation.gallery.length > 0 && (
        <section id="gallery" className={styles.gallery}>
          <p className={styles.eyebrow}>Our Moments</p><h2>Galeri Pernikahan</h2>
          <motion.div {...reveal}>{invitation.gallery.map((photo, index) => <Image key={photo} src={photo} alt={`Galeri ${index + 1}`} width={320} height={420} />)}</motion.div>
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
