/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { useInvitation } from "@/components/InvitationProvider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import type { BirthdayInvitationData } from "@/types/birthday";
import { ComicDivider, FloatingSparks, SpeedLines } from "./SuperheroAccents";
import styles from "./style.module.css";

function MissionCountdown({ targetDate }: { targetDate: string }) {
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
      <p className={styles.eyebrow}>Misi Segera Dimulai</p>
      <h2 className={styles.sectionTitle}>Hitung Mundur</h2>
      <div className={styles.countdownGrid}>
        {values.map(([value, label], index) => (
          <div
            className={styles.countdownItem}
            key={String(label)}
            style={{ rotate: `${index % 2 === 0 ? -3 : 3}deg` }}
          >
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuperheroBirthday({
  invitation,
}: {
  invitation: BirthdayInvitationData;
}) {
  const { opened, setOpened } = useInvitation();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Bapak/Ibu/Saudara/i";
  const { isPlaying, toggle } = useMusicPlayer(invitation.musicUrl, opened);
  const event = invitation.event;

  if (!opened) {
    return (
      <main className={styles.root}>
        <section className={styles.cover}>
          {invitation.coverImage && (
            <motion.img
              className={styles.coverImage}
              src={invitation.coverImage}
              alt={`Ulang tahun ${invitation.child.name}`}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4 }}
            />
          )}
          <div className={styles.coverWash} />
          <img
            className={styles.coverEmblem}
            src="/photos/superhero-city/emblem.webp"
            alt=""
            aria-hidden="true"
          />
          <div className={styles.coverFrame}><span /></div>
          <SpeedLines className={`${styles.corner} ${styles.cornerTopLeft}`} />
          <SpeedLines className={`${styles.corner} ${styles.cornerTopRight}`} mirrored />
          <SpeedLines className={`${styles.corner} ${styles.cornerBottomLeft}`} mirrored />
          <SpeedLines className={`${styles.corner} ${styles.cornerBottomRight}`} />
          <motion.div
            className={styles.coverCard}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
          >
            <p className={styles.coverLabel}>Misi Ulang Tahun</p>
            <h1 className={styles.coverNames}>{invitation.child.name}</h1>
            <ComicDivider className={styles.coverDivider} />
            <p className={styles.coverDate}>
              Merayakan Ulang Tahun ke-{invitation.child.age || ""}
            </p>
            <div className={styles.guestPanel}>
              <small>Kepada Yth.</small>
              <strong>{guestName}</strong>
              <button className={styles.primaryButton} onClick={() => setOpened(true)}>
                Mulai Misi!
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <FloatingSparks />
      <section className={`${styles.section} ${styles.hero}`}>
        <img
          className={styles.heroScene}
          src="/photos/superhero-city/hero-scene.webp"
          alt=""
          aria-hidden="true"
        />
        <Reveal>
          <p className={styles.eyebrow}>Laporan Markas</p>
          <h1 className={styles.heroTitle}>
            Pahlawan kecil kami merayakan ulang tahun ke-{invitation.child.age || ""}
          </h1>
          <p className={styles.heroCopy}>
            {invitation.opening.description ||
              "Bersiaplah, kota membutuhkanmu! Kami mengundang Anda untuk ikut merayakan hari ulang tahun pahlawan kecil kami."}
          </p>
        </Reveal>
        {invitation.opening.quote && (
          <Reveal delay={0.12}>
            <blockquote className={styles.verseCard}>
              <span className={styles.quoteMark}>&ldquo;</span>
              <p>{invitation.opening.quote}</p>
              {invitation.opening.quoteSource && <cite>{invitation.opening.quoteSource}</cite>}
            </blockquote>
          </Reveal>
        )}
      </section>

      <section className={`${styles.section} ${styles.heroSectionProfile}`}>
        <Reveal>
          <p className={styles.eyebrow}>Profil Pahlawan</p>
          <h2 className={styles.sectionTitle}>{invitation.child.name}</h2>
          <ComicDivider />
          <div className={styles.shieldWrap}>
            <div className={styles.shieldFrame}>
              {invitation.child.photo && (
                <img src={invitation.child.photo} alt={invitation.child.name} />
              )}
            </div>
            <img
              className={styles.shieldOverlay}
              src="/photos/superhero-city/frame.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
          <p className={styles.heroCopy}>
            Pahlawan cilik kesayangan {invitation.parents.father} &amp; {invitation.parents.mother}
          </p>
        </Reveal>
      </section>

      {event?.rawDate && (
        <div className={styles.countdownScene}>
          <MissionCountdown targetDate={event.rawDate} />
          <img
            className={styles.actionPose}
            src="/photos/superhero-city/action-pose.webp"
            alt=""
            aria-hidden="true"
          />
        </div>
      )}

      {event && (
        <section className={styles.section}>
          <Reveal>
            <p className={styles.eyebrow}>Lokasi Misi</p>
            <h2 className={styles.sectionTitle}>Waktu &amp; Tempat</h2>
            <ComicDivider />
            <article className={styles.eventCard}>
              <p className={styles.eyebrow}>Pesta Pahlawan</p>
              <h3>{event.date}</h3>
              <p>{event.time}</p>
              <p>{event.location}</p>
              {invitation.mapsUrl && (
                <a className={styles.primaryButton} href={invitation.mapsUrl} target="_blank">
                  Buka Lokasi
                </a>
              )}
            </article>
          </Reveal>
        </section>
      )}

      {invitation.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className={styles.section}>
            <Reveal>
              <p className={styles.eyebrow}>Galeri Aksi</p>
              <h2 className={styles.sectionTitle}>Galeri {invitation.child.name}</h2>
              <ComicDivider />
            </Reveal>
            <div className={styles.galleryGrid}>
              {invitation.gallery.map((photo, index) => (
                <Reveal key={photo} delay={Math.min(index * 0.06, 0.24)}>
                  <div
                    className={styles.galleryItem}
                    style={{ rotate: `${index % 2 === 0 ? -2 : 2}deg` }}
                  >
                    <img src={photo} alt={`Galeri ${invitation.child.name} ${index + 1}`} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <SpeedLines className={styles.footerCorner} />
        <Reveal>
          <p className={styles.eyebrow}>Misi Selesai</p>
          <h2>
            Sampai Jumpa
            <span>di misi berikutnya</span>
            {invitation.child.name}
          </h2>
          <p className={styles.copyright}>
            {invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" />}
            © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
          </p>
        </Reveal>
      </footer>

      {invitation.musicUrl && (
        <button
          type="button"
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          className={`${styles.musicButton} ${isPlaying ? styles.musicPlaying : ""}`}
          onClick={toggle}
        >
          <span>{isPlaying ? "Ⅱ" : "♪"}</span>
        </button>
      )}
    </main>
  );
}
