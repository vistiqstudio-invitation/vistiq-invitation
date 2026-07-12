"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SongketMotif from "./SongketMotif";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <SongketMotif className={styles.footerMotif} />

        <p className={styles.footerQuote}>
          "Tarimo kasih ateh kasadoan Bapak/Ibu/Saudara/i nan alah maluangkan
          wakatu untuak hadir jo mandoakan kami."
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
