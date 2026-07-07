import Cover from "./Cover";
import Hero from "./Hero";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import Video from "./Video";
import Event from "./Event";
import Maps from "./Maps";
import Gift from "./Gift";
import RSVP from "./RSVP";
import Wishes from "./Wishes";
import Footer from "./Footer";

type Props = {
  invitation: any;
};

export default function LuxuryGold({ invitation }: Props) {
  return (
    <>
      <Cover invitation={invitation} />

      <Hero invitation={invitation} />

      <Couple invitation={invitation} />

      <Story invitation={invitation} />

      <Gallery invitation={invitation} />

      <Video invitation={invitation} />

      <Event invitation={invitation} />

      <Maps invitation={invitation} />

      <Gift invitation={invitation} />

      <RSVP invitation={invitation} />

      <Wishes invitation={invitation} />

      <Footer invitation={invitation} />
    </>
  );
}