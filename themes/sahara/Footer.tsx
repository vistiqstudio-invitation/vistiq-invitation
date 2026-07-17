"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <p className={styles.footerQuote}>
          "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
          kepada kedua mempelai."
        </p>

        <h2 className={styles.footerNames}>
          {invitation.groom.name.split(" ")[0]}
          <span>&amp;</span>
          {invitation.bride.name.split(" ")[0]}
        </h2>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
