"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <span className={styles.footerBali} lang="ban">
          ᬒᬁᬰᬵᬦ᭄ᬢᬶᬄ᭞​ᬰᬵᬦ᭄ᬢᬶᬄ᭞​ᬰᬵᬦ᭄ᬢᬶᬄ᭞​ᬒᬁ​᭟
        </span>

        <p className={styles.footerQuote}>
          "Suksma ateh sinamian galah sane sampun kaicen olih Bapak/Ibu/
          Saudara/i, ngiring rauh miwah ngastawayang kami ring rahina
          bagia puniki."
        </p>

        <p className={styles.footerLabel}>Kami yang berbahagia,</p>

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
