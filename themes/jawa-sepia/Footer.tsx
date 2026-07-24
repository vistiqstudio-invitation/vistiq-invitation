"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import FloralAccent from "./FloralAccent";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: InvitationData }) {
  const photo = invitation.coverImage || invitation.groom.photo || invitation.bride.photo;

  return (
    <footer className={styles.footer}>
      <FloralAccent variant="corner" className={styles.footerCornerTL} />
      <FloralAccent variant="corner" className={styles.footerCornerTR} />

      <Reveal>
        <div className={styles.footerCard}>
          {photo && (
            <div className={styles.footerPhoto}>
              <img src={photo} alt="" />
            </div>
          )}

          <p className={styles.footerThanks}>Terima Kasih</p>

          <h2 className={styles.footerNames}>
            <span className={styles.footerNameLine}>{invitation.groom.name}</span>
            <span className={styles.footerAmpersand}>&amp;</span>
            <span className={styles.footerNameLine}>{invitation.bride.name}</span>
          </h2>

          <p className={styles.footerQuote}>
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas
            kehadiran dan doa restunya kami ucapkan terima kasih."
          </p>
        </div>

        <FloralAccent variant="spray" className={styles.footerSpray} />

        <p className={styles.copyright}>
          {invitation.brand?.logoUrl && <img src={invitation.brand.logoUrl} alt="" style={{height:16,verticalAlign:"middle",marginRight:6,display:"inline-block"}}/>}© {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
