"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import Bunting from "./Bunting";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: AqiqahInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Bunting className={styles.footerBunting} />

      <Reveal>
        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Semoga Bapak/Ibu/Saudara/i
          berkenan untuk hadir dan memberikan doa restu.
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.footerName}>{invitation.baby.name}</h2>

        <p className={styles.copyright}>
          {invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" style={{height:16,verticalAlign:"middle",marginRight:6,display:"inline-block"}}/>}© {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
