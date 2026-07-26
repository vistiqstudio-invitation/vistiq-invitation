"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import Loading from "@/themes/jawa-merah/Loading";
import Hero from "@/themes/jawa-merah/Hero";
import Couple from "@/themes/jawa-merah/Couple";
import Story from "@/themes/jawa-merah/Story";
import Event from "@/themes/jawa-merah/Event";
import Gallery from "@/themes/jawa-merah/Gallery";
import Video from "@/themes/jawa-merah/Video";
import Gift from "@/themes/jawa-merah/Gift";
import RSVP from "@/themes/jawa-merah/RSVP";
import Wishes from "@/themes/jawa-merah/Wishes";
import Footer from "@/themes/jawa-merah/Footer";
import MusicPlayer from "@/themes/jawa-merah/MusicPlayer";
import FloatingMenu from "@/themes/jawa-merah/FloatingMenu";
import CinematicCover from "./CinematicCover";
import javaStyles from "@/themes/jawa-merah/style.module.css";

export default function RoyalJava({ invitation }: { invitation: InvitationData }) {
  const { opened } = useInvitation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const backdropPhoto = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;

  return (
    <div className={javaStyles.root}>
      {backdropPhoto && <div className={javaStyles.photoBackdrop} style={{ backgroundImage: `url(${backdropPhoto})` }} />}
      <AnimatePresence>{!ready && <Loading key="loading" />}</AnimatePresence>
      <AnimatePresence>{ready && !opened && <CinematicCover invitation={invitation} />}</AnimatePresence>
      {ready && opened && (
        <>
          <section id="home"><Hero invitation={invitation} /></section>
          <section id="couple"><Couple invitation={invitation} /></section>
          <section id="event"><Event invitation={invitation} /></section>
          <Video invitation={invitation} />
          {invitation.gallery.length > 0 && <section id="gallery"><Gallery invitation={invitation} /></section>}
          {invitation.story.length > 0 && <section id="story"><Story invitation={invitation} /></section>}
          {invitation.gifts.length > 0 && <section id="gift"><Gift invitation={invitation} /></section>}
          <section id="rsvp"><RSVP invitation={invitation} /></section>
          <Wishes invitation={invitation} />
          <Footer invitation={invitation} />
          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
