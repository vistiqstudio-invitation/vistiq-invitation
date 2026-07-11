"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { GiftAccount, InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

function GiftCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = useState(false);
  const { owner, bankName, accountNumber, accountName } = account;

  const copyNumber = async () => {
    if (!accountNumber) return;
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.giftCard}>
      <p className={styles.giftOwner}>{owner}</p>
      {bankName && <h3 className={styles.giftBank}>{bankName}</h3>}
      {accountNumber && <p className={styles.giftNumber}>{accountNumber}</p>}
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
  );
}

export default function Gift({ invitation }: { invitation: InvitationData }) {
  if (invitation.gifts.length === 0) return null;

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Wedding Gift</p>
        <h2 className={styles.title}>Tanda Kasih</h2>
        <div className={styles.ornament}>
          <span className={styles.ornamentDiamond} />
        </div>
      </Reveal>

      <div className={styles.giftGrid}>
        {invitation.gifts.map((account, index) => (
          <Reveal key={account.owner} delay={index * 0.1}>
            <GiftCard account={account} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
