"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useInvitation } from "@/components/InvitationProvider";
import type { AqiqahInvitationData } from "@/types/aqiqah";

import Loading from "./Loading";
import Cover from "./Cover";
import FloatingStars from "./FloatingStars";
import Hero from "./Hero";
import Baby from "./Baby";
import Event from "./Event";
import Gallery from "./Gallery";
import Video from "./Video";
import Maps from "./Maps";
import RSVP from "./RSVP";
import Gift from "./Gift";
import Wishes from "./Wishes";
import Footer from "./Footer";
import MusicPlayer from "./MusicPlayer";
import FloatingMenu from "./FloatingMenu";
import styles from "./style.module.css";

export default function AkikahNur({ invitation }: { invitation: AqiqahInvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.root}>
      <AnimatePresence>{!ready && <Loading key="loading" />}</AnimatePresence>

      {ready && !opened && <Cover invitation={invitation} />}

      {ready && opened && (
        <>
          <FloatingStars />

          <section id="home">
            <Hero invitation={invitation} />
          </section>

          <section id="baby">
            <Baby invitation={invitation} />
          </section>

          <section id="event">
            <Event invitation={invitation} />
          </section>

          {invitation.gallery.length > 0 && (
            <section id="gallery">
              <Gallery invitation={invitation} />
            </section>
          )}

          <Video invitation={invitation} />

          <section id="maps">
            <Maps invitation={invitation} />
          </section>

          <section id="rsvp">
            <RSVP invitation={invitation} />
          </section>

          {invitation.gifts.length > 0 && (
            <section id="gift">
              <Gift invitation={invitation} />
            </section>
          )}

          <Wishes invitation={invitation} />

          <Footer invitation={invitation} />

          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
