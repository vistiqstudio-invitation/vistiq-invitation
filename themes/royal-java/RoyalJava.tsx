"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useInvitation } from "@/components/InvitationProvider";
import type { InvitationData } from "@/types/invitation";
import Loading from "@/themes/jawa-merah/Loading";
import MusicPlayer from "@/themes/jawa-merah/MusicPlayer";
import FloatingMenu from "@/themes/jawa-merah/FloatingMenu";
import CinematicCover from "./CinematicCover";
import PremiumContent from "./PremiumContent";
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
          <PremiumContent invitation={invitation} />
          <MusicPlayer url={invitation.musicUrl} />
          <FloatingMenu />
        </>
      )}
    </div>
  );
}
