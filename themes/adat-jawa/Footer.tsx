"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import BatikCorner from "./BatikCorner";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <BatikCorner className={`${styles.corner} ${styles.cornerTopLeft}`} />
      <BatikCorner className={`${styles.corner} ${styles.cornerBottomRight}`} />

      <Reveal>
        <p className={styles.footerQuote}>
          "Rahayu, rahayu, rahayu. Mugi Bapak/Ibu/Saudara/i saged rawuh
          kanggo paring donga pangestu dhumateng kaluwarga kula."
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
