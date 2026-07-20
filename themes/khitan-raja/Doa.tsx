"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";

export default function Doa({ invitation }: { invitation: KhitanInvitationData }) {
  const nickname = invitation.child.name.trim().split(/\s+/).pop() || invitation.child.name;

  return (
    <div className={styles.doaSection}>
      <Reveal>
        <h2 className={styles.title} style={{ color: "var(--cream)" }}>
          Doa Untukmu
        </h2>

        <p className={styles.doaQuote}>
          "Tiada kata yang terindah selain doa, semoga putra kami{" "}
          {nickname} menjadi anak yang sholeh, sehat, berbakti kepada orang
          tua, berguna bagi agama & bangsa, serta senantiasa dalam lindungan
          Allah SWT.
          <br />
          <br />
          Aamiin Ya Robbal Alamin"
        </p>
      </Reveal>
    </div>
  );
}
