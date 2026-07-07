"use client";

import { useInvitation } from "@/components/InvitationProvider";

import Cover from "./Cover";
import Hero from "./Hero";
import Couple from "./Couple";
import Story from "./Story";
import Event from "./Event";
import Gallery from "./Gallery";
import Video from "./Video";
import Maps from "./Maps";
import Gift from "./Gift";
import RSVP from "./RSVP";
import Wishes from "./Wishes";
import Footer from "./Footer";

type Props = {
  invitation: any;
};

export default function LuxuryGold({ invitation }: Props) {
  const { opened } = useInvitation();

  if (!opened) {
    return <Cover invitation={invitation} />;
  }

  return (
    <>
      <Hero invitation={invitation} />
      <Couple invitation={invitation} />
      <Story invitation={invitation} />
      <Event invitation={invitation} />
      <Gallery invitation={invitation} />
      <Video invitation={invitation} />
      <Maps invitation={invitation} />
      <Gift invitation={invitation} />
      <RSVP invitation={invitation} />
      <Wishes invitation={invitation} />
      <Footer invitation={invitation} />
    </>
  );
}