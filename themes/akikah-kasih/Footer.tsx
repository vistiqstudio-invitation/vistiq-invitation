"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";
import BabyBear from "./BabyBear";

export default function Footer({ invitation }: { invitation: AqiqahInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <BabyBear className={styles.coverBear} style={{ margin: "0 auto 18px" }} />

        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Semoga Bapak/Ibu/Saudara/i
          berkenan untuk hadir dan memberikan doa restu.
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.footerName}>{invitation.baby.name}</h2>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
