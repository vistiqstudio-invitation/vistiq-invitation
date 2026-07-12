"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import OmboWave from "./OmboWave";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <OmboWave className={styles.footerMotif} />

        <p className={styles.footerQuote}>
          "Terima kasih atas doa restu Bapak/Ibu/Saudara/i yang telah
          meluangkan waktu untuk hadir di hari bahagia kami."
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
