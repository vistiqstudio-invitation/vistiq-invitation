"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useInvitation } from "@/components/InvitationProvider";
import type { KhitanInvitationData } from "@/types/khitan";

import Loading from "./Loading";
import Cover from "./Cover";
import Hero from "./Hero";
import Child from "./Child";
import Event from "./Event";
import Gallery from "./Gallery";
import Video from "./Video";
import Maps from "./Maps";
import RSVP from "./RSVP";
import Doa from "./Doa";
import Gift from "./Gift";
import Wishes from "./Wishes";
import Footer from "./Footer";
import MusicPlayer from "./MusicPlayer";
import FloatingMenu from "./FloatingMenu";
import styles from "./style.module.css";

export default function KhitanElang({ invitation }: { invitation: KhitanInvitationData }) {
  const { opened } = useInvitation();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const [ready, setReady] = useState(isPreview);

  useEffect(() => {
    if (isPreview) return;
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, [isPreview]);

  return (
    <div className={styles.root}>
      <AnimatePresence>{!ready && <Loading key="loading" />}</AnimatePresence>

      {ready && !opened && <Cover invitation={invitation} />}

      {ready && opened && (
        <>
          <section id="home">
            <Hero invitation={invitation} />
          </section>

          <section id="child">
            <Child invitation={invitation} />
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

          <Maps invitation={invitation} />

          <section id="rsvp">
            <RSVP invitation={invitation} />
          </section>

          <Doa invitation={invitation} />

          {invitation.gifts.length > 0 && (
            <section id="gift">
              <Gift invitation={invitation} />
            </section>
          )}

          <Wishes invitation={invitation} />

          <Footer invitation={invitation} />

          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu invitation={invitation} />
        </>
      )}
    </div>
  );
}
