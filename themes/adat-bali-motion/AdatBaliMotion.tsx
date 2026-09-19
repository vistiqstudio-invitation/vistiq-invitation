"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import baseStyles from "../adat-bali/style.module.css";
import Loading from "../adat-bali/Loading";
import Cover from "../adat-bali/Cover";
import Hero from "../adat-bali/Hero";
import Couple from "../adat-bali/Couple";
import Story from "../adat-bali/Story";
import Countdown from "../adat-bali/Countdown";
import Event from "../adat-bali/Event";
import Gallery from "../adat-bali/Gallery";
import Maps from "../adat-bali/Maps";
import Gift from "../adat-bali/Gift";
import RSVP from "../adat-bali/RSVP";
import Wishes from "../adat-bali/Wishes";
import Footer from "../adat-bali/Footer";
import MusicPlayer from "../adat-bali/MusicPlayer";
import FloatingMenu from "../adat-bali/FloatingMenu";
import styles from "./style.module.css";

const themeVariables = {
  "--maroon": "#3a125b",
  "--maroon-bright": "#7c35a8",
  "--black": "#100719",
  "--gold": "#d8b26a",
  "--cream": "rgba(255, 255, 255, 0.95)",
  "--ink": "#1c1026",
  "--muted": "rgba(255, 255, 255, 0.72)",
} as CSSProperties;

function NativeInvitation({ invitation }: { invitation: InvitationData }) {
  const weddingDate = invitation.events[0]?.rawDate || null;

  return (
    <>
      {invitation.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={baseStyles.bgPhoto} src={invitation.coverImage} alt="" aria-hidden="true" />
      )}

      <section id="home">
        <Hero invitation={invitation} />
      </section>

      <section id="couple">
        <Couple invitation={invitation} />
      </section>

      {invitation.story.length > 0 && (
        <section id="story">
          <Story invitation={invitation} />
        </section>
      )}

      {weddingDate && (
        <section id="countdown">
          <Countdown targetDate={weddingDate} />
        </section>
      )}

      <section id="event">
        <Event invitation={invitation} />
      </section>

      {invitation.gallery.length > 0 && (
        <section id="gallery">
          <Gallery invitation={invitation} />
        </section>
      )}

      <section id="maps">
        <Maps invitation={invitation} />
      </section>

      {invitation.gifts.length > 0 && (
        <section id="gift">
          <Gift invitation={invitation} />
        </section>
      )}

      <section id="rsvp">
        <RSVP invitation={invitation} />
      </section>

      <Wishes invitation={invitation} />
      <Footer invitation={invitation} />
    </>
  );
}

function OpeningVideo({ invitation }: { invitation: InvitationData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const reveal = () => setRevealed(true);

    if (!video) {
      const fallbackTimer = window.setTimeout(reveal, 900);
      return () => window.clearTimeout(fallbackTimer);
    }

    const handleTimeUpdate = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 20;
      if (video.currentTime >= Math.max(0, duration - 2)) reveal();
    };

    video.currentTime = 0;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", reveal, { once: true });
    const fallbackTimer = window.setTimeout(reveal, 18_000);
    void video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      window.clearTimeout(fallbackTimer);
    };
  }, [invitation.videoUrl]);

  const groomShort = invitation.groom.nickname || invitation.groom.name.split(/\s+/)[0];
  const brideShort = invitation.bride.nickname || invitation.bride.name.split(/\s+/)[0];
  const date = invitation.coverEvent?.date || invitation.events[0]?.date || "";

  return (
    <section className={styles.opening} aria-label="Opening video undangan">
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
          onEnded={() => setRevealed(true)}
          aria-label="Video opening 3D Adat Bali"
        />
      ) : (
        <div className={styles.openingFallback} />
      )}

      <div className={styles.openingShade} />
      <div className={`${styles.openingCopy} ${revealed ? styles.openingCopyVisible : ""}`}>
        <p className={styles.openingEyebrow}>The Wedding of</p>
        <h1 className={styles.openingName}>{groomShort}</h1>
        <span className={styles.openingAmpersand}>&amp;</span>
        <h1 className={styles.openingName}>{brideShort}</h1>
        {date && <p className={styles.openingDate}>{date}</p>}
      </div>
    </section>
  );
}

export default function AdatBaliMotion({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!opened) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  return (
    <div className={`${baseStyles.root} ${styles.motionRoot}`} style={themeVariables}>
      {!ready && <Loading />}

      {ready && !opened && <Cover invitation={invitation} />}

      {ready && opened && (
        <>
          <OpeningVideo invitation={invitation} />
          <NativeInvitation invitation={invitation} />
          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
