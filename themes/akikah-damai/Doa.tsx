"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Doa({ invitation }: { invitation: AqiqahInvitationData }) {
  const nickname = invitation.baby.name.trim().split(/\s+/).pop() || invitation.baby.name;
  const pronoun = invitation.baby.gender === "P" ? "putri" : "putra";

  return (
    <div className={styles.doaSection}>
      <Reveal>
        <h2 className={styles.title} style={{ color: "var(--cream)" }}>
          Doa Untukmu
        </h2>

        <p className={styles.doaQuote}>
          "Tiada kata yang terindah selain doa, semoga {pronoun} kami{" "}
          {nickname} tumbuh menjadi anak yang sholeh/sholehah, sehat,
          berbakti kepada orang tua, berguna bagi agama & bangsa, serta
          senantiasa dalam lindungan Allah SWT.
          <br />
          <br />
          Aamiin Ya Robbal Alamin"
        </p>
      </Reveal>
    </div>
  );
}
