"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import IslamicMotif from "./IslamicMotif";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <IslamicMotif className={`${styles.cornerMotif} ${styles.cornerMotifTop}`} />

      <Reveal>
        <p className={styles.footerQuote}>
          "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."
        </p>

        <h2 className={styles.footerNames}>
          {invitation.groom.name}
          <span>&amp;</span>
          {invitation.bride.name}
        </h2>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
