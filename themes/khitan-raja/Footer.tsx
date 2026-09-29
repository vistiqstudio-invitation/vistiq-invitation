"use client";

import Reveal from "@/components/Reveal";
import type { KhitanInvitationData } from "@/types/khitan";
import styles from "./style.module.css";
import Crown from "./Crown";

export default function Footer({ invitation }: { invitation: KhitanInvitationData }) {
  const quote = invitation.opening?.quote?.trim() || "";
  const entertainmentMatch = quote.match(/^hiburan\s*:\s*(.+)$/i);
  const entertainment = entertainmentMatch?.[1]?.trim() || "";

  return (
    <footer className={styles.footer}>
      <Reveal>
        <Crown className={styles.footerCrown} />

        <p className={styles.footerQuote}>
          Demikian undangan ini kami sampaikan. Merupakan suatu kehormatan
          dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu.
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2 className={styles.footerName}>{invitation.child.name}</h2>

        {entertainment && (
          <div className={styles.footerEntertainment}>
            <span>Hiburan</span>
            <strong>{entertainment}</strong>
          </div>
        )}

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
