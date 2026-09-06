"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";

import Loading from "./Loading";
import Cover from "./Cover";
import Hero from "./Hero";
import Couple from "./Couple";
import Story from "./Story";
import Countdown from "./Countdown";
import Event from "./Event";
import Gallery from "./Gallery";
import Video from "./Video";
import Maps from "./Maps";
import Gift from "./Gift";
import RSVP from "./RSVP";
import Wishes from "./Wishes";
import Footer from "./Footer";
import MusicPlayer from "./MusicPlayer";
import FloatingMenu from "./FloatingMenu";
import FloatingPetals from "./FloatingPetals";
import styles from "./style.module.css";

export default function MinimalWhite({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const weddingDate = invitation.events[0]?.rawDate || null;

  return (
    <div className={styles.root}>
      <AnimatePresence>{!ready && <Loading key="loading" />}</AnimatePresence>

      {ready && !opened && <Cover invitation={invitation} />}

      {ready && opened && (
        <>
          <FloatingPetals />

          <section id="home" className={styles.pageSection}>
            <Hero invitation={invitation} />
          </section>

          <section id="couple" className={styles.pageSection}>
            <Couple invitation={invitation} />
          </section>

          {weddingDate && (
            <section id="countdown" className={styles.pageSection}>
              <Countdown targetDate={weddingDate} />
            </section>
          )}

          <section id="event" className={styles.pageSection}>
            <Event invitation={invitation} />
          </section>

          <Video invitation={invitation} />

          {invitation.story.length > 0 && (
            <section id="story" className={styles.pageSection}>
              <Story invitation={invitation} />
            </section>
          )}

          {invitation.gallery.length > 0 && (
            <section id="gallery" className={styles.gallerySection}>
              <Gallery invitation={invitation} />
            </section>
          )}

          {!invitation.mapsUrl && (
            <section id="maps" className={styles.pageSection}>
              <Maps invitation={invitation} />
            </section>
          )}

          {invitation.gifts.length > 0 && (
            <section id="gift" className={styles.pageSection}>
              <Gift invitation={invitation} />
            </section>
          )}

          <section id="rsvp" className={styles.rsvpSection}>
            <RSVP invitation={invitation} />
          </section>

          <Wishes invitation={invitation} />

          <Footer invitation={invitation} />

          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
