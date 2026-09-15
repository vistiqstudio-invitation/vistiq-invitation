"use client";

import Reveal from "@/components/Reveal";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Footer({ invitation }: { invitation: AqiqahInvitationData }) {
  return (
    <footer className={styles.footer}>
      <Reveal>
        <p className={styles.footerQuote}>
          "Terima kasih atas doa restu dan kehadiran Bapak/Ibu/Saudara/i
          dalam acara aqiqah putra/putri kami. Semoga kelak menjadi anak
          yang sholeh/sholehah, berbakti, dan membanggakan."
        </p>

        <h2 className={styles.footerName}>{invitation.baby.name}</h2>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {invitation.brand?.name ?? "Vistiq Invitation"}
        </p>
      </Reveal>
    </footer>
  );
}
