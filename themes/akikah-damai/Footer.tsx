"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";
import Elephant from "./Elephant";

export default function Footer({ invitation }: { invitation: AqiqahInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <Elephant className={styles.footerElephant} />

        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Merupakan suatu kehormatan
          dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu.
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
