"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: KhitanInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <img className={styles.coverDecor} src="/photos/khitan-warna-bismillah.webp" alt="" aria-hidden="true" style={{ position: "static", width: 64, margin: "0 auto 20px" }} />

        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Merupakan suatu kehormatan
          dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu.
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.footerName}>{invitation.child.name}</h2>

        <p className={styles.copyright}>
          {invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" style={{height:16,verticalAlign:"middle",marginRight:6,display:"inline-block"}}/>}© {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
