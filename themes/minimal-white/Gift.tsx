"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

export default function Gift({ invitation }: { invitation: InvitationData }) {
  const [copied, setCopied] = useState(false);

  if (!invitation.gift) return null;

  const { bankName, accountNumber, accountName } = invitation.gift;

  const copyNumber = async () => {
    if (!accountNumber) return;
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Wedding Gift</p>
        <h2 className={styles.title}>Tanda Kasih</h2>
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className={styles.giftCard}>
          {bankName && <h3 className={styles.giftBank}>{bankName}</h3>}
          {accountNumber && (
            <p className={styles.giftNumber}>{accountNumber}</p>
          )}
          {accountName && <p className={styles.giftName}>a.n {accountName}</p>}

          {accountNumber && (
            <button
              className={`${styles.button} ${styles.solid}`}
              onClick={copyNumber}
            >
              {copied ? "Tersalin" : "Salin Nomor Rekening"}
            </button>
          )}
        </div>
      </Reveal>
    </div>
  );
}
