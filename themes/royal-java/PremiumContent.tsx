"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { InvitationData } from "@/types/invitation";
import Gift from "@/themes/jawa-merah/Gift";
import RSVP from "@/themes/jawa-merah/RSVP";
import Wishes from "@/themes/jawa-merah/Wishes";
import Footer from "@/themes/jawa-merah/Footer";
import styles from "./premium.module.css";

export default function PremiumContent({ invitation }: { invitation: InvitationData }) {
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
        <motion.div className={styles.heroBase} initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8 }} />
        <motion.div className={styles.heroTop} aria-hidden="true" initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2.2, delay: .25, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/canopy.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
        <motion.div className={styles.heroJanur} aria-hidden="true" initial={{ y: 65, opacity: 0, scaleY: .6 }} animate={{ y: 0, opacity: 1, scaleY: 1 }} transition={{ duration: 2.2, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/janur.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
        <motion.div className={styles.heroJoglo} aria-hidden="true" initial={{ y: 150, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2.5, delay: .85, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/joglo.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
        <motion.div className={styles.heroBottom} aria-hidden="true" initial={{ y: 130, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}><Image src="/decor/royal-java-layers/florals.webp" alt="" fill priority sizes="(max-width: 520px) 100vw, 520px" /></motion.div>
        <motion.div className={styles.heroCloud} aria-hidden="true" initial={{ opacity: .9, scale: .6, x: -80 }} animate={{ opacity: [0.9, .55, 0], scale: [0.6, 1.25, 1.55], x: [-80, 0, 95] }} transition={{ duration: 3.4, ease: "easeOut" }} />
        <motion.div className={styles.heroIdentity} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.7, delay: 2.3 }}>
          <p>The Royal Wedding Of</p>
          <h1><span>{invitation.groom.nickname || invitation.groom.name}</span><em>&amp;</em><span>{invitation.bride.nickname || invitation.bride.name}</span></h1>
          {weddingDate && <time>{weddingDate}</time>}
        </motion.div>
        <motion.div className={styles.scrollCue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }} aria-hidden="true"><i /></motion.div>
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
          <h1>{(invitation.groom.nickname || invitation.groom.name)}<em>&amp;</em>{(invitation.bride.nickname || invitation.bride.name)}</h1>
          <p className={styles.courtesy}>{invitation.opening.description || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."}</p>
        </motion.div>
        <div className={styles.people}>
          <motion.article {...reveal}>
            {invitation.groom.photo && <div className={styles.personPhoto}><Image src={invitation.groom.photo} alt={`Foto ${invitation.groom.name}`} fill sizes="220px" /></div>}
            <span className={styles.personRole}>Mempelai Pria</span>
            <h3>{invitation.groom.name}</h3>
            {invitation.groom.parents && <p>Putra dari<br /><b>{invitation.groom.parents}</b></p>}
            {invitation.groom.instagram && <a href={`https://instagram.com/${invitation.groom.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">@{invitation.groom.instagram.replace("@", "")}</a>}
          </motion.article>
          <span className={styles.peopleAmp}>&amp;</span>
          <motion.article {...reveal}>
            {invitation.bride.photo && <div className={styles.personPhoto}><Image src={invitation.bride.photo} alt={`Foto ${invitation.bride.name}`} fill sizes="220px" /></div>}
            <span className={styles.personRole}>Mempelai Wanita</span>
            <h3>{invitation.bride.name}</h3>
            {invitation.bride.parents && <p>Putri dari<br /><b>{invitation.bride.parents}</b></p>}
            {invitation.bride.instagram && <a href={`https://instagram.com/${invitation.bride.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">@{invitation.bride.instagram.replace("@", "")}</a>}
          </motion.article>
        </div>
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

      <section className={styles.moment}>
        <div className={styles.momentShade} aria-hidden="true" />
        <motion.div {...reveal}>
          <span>Menuju Hari Bahagia</span>
          <h2>{weddingDate || "Hari Pernikahan"}</h2>
          <i aria-hidden="true">❦</i>
          <p>Dengan penuh rasa syukur, kami menantikan kehadiran dan doa restu Anda pada hari istimewa kami.</p>
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
