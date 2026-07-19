"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Doa({ invitation }: { invitation: AqiqahInvitationData }) {
  const nickname = invitation.baby.name.trim().split(/\s+/).pop() || invitation.baby.name;
  const childWord = invitation.baby.gender === "P" ? "Putri" : "Putra";

  return (
    <div className={styles.doaSection}>
      <Reveal>
        <h2 className={styles.title} style={{ color: "#faf6f1" }}>
          Doa Untukmu
        </h2>

        <p className={styles.doaQuote}>
          "Tiada kata yang terindah selain doa, semoga {childWord.toLowerCase()} kami{" "}
          {nickname} menjadi anak yang sholeh/sholehah, berbakti kepada orang
          tua, berguna bagi agama & bangsa, serta diberikan kepandaian yang
          diberkahi Allah SWT.
          <br />
          <br />
          Aamiin Ya Robbal Alamin"
        </p>
      </Reveal>
    </div>
  );
}
