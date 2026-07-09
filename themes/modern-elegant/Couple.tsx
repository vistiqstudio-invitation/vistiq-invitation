"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import styles from "./style.module.css";

function NameBlock({
  name,
  parents,
  instagram,
  role,
  align,
}: {
  name: string;
  parents: string | null;
  instagram: string | null;
  role: "Putra" | "Putri";
  align: "left" | "right";
}) {
  return (
    <div className={align === "left" ? styles.nameBlockLeft : styles.nameBlockRight}>
      <h3 className={styles.personName}>{name}</h3>
      {parents && (
        <p className={styles.personParents}>
          {role} dari {parents}
        </p>
      )}
      {instagram && (
        <a
          className={styles.personSocial}
          href={`https://instagram.com/${instagram.replace("@", "")}`}
          target="_blank"
          rel="noreferrer"
        >
          @{instagram.replace("@", "")}
        </a>
      )}
    </div>
  );
}

export default function Couple({ invitation }: { invitation: InvitationData }) {
  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={`${styles.title} ${styles.titleArabic}`}>Bismillahirrahmanirrahim</h2>
      </Reveal>

      <div className={styles.stackWrap}>
        {invitation.bride.photo && (
          <motion.div
            className={styles.stackPhotoBride}
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <img src={invitation.bride.photo} alt={invitation.bride.name} />
          </motion.div>
        )}

        {invitation.groom.photo && (
          <motion.div
            className={styles.stackPhotoGroom}
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
          >
            <img src={invitation.groom.photo} alt={invitation.groom.name} />
          </motion.div>
        )}

        <span className={styles.stackAmp}>&amp;</span>
      </div>

      <div className={styles.nameRow}>
        <Reveal delay={0.4}>
          <NameBlock
            name={invitation.bride.name}
            parents={invitation.bride.parents}
            instagram={invitation.bride.instagram}
            role="Putri"
            align="left"
          />
        </Reveal>
        <Reveal delay={0.5}>
          <NameBlock
            name={invitation.groom.name}
            parents={invitation.groom.parents}
            instagram={invitation.groom.instagram}
            role="Putra"
            align="right"
          />
        </Reveal>
      </div>
    </div>
  );
}
