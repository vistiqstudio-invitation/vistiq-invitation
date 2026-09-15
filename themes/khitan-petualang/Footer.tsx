"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Compass from "./Compass";

export default function Footer({ invitation }: { invitation: KhitanInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <Compass className={styles.footerCompass} />

        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Merupakan suatu kehormatan
          dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu.
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.footerName}>{invitation.child.name}</h2>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
