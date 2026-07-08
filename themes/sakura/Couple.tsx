"use client";

import Reveal from "@/components/Reveal";
import type { InvitationData } from "@/types/invitation";
import SakuraBranch from "./SakuraBranch";
import styles from "./style.module.css";

function Person({
  name,
  parents,
  photo,
  instagram,
  role,
}: {
  name: string;
  parents: string | null;
  photo: string | null;
  instagram: string | null;
  role: "Putra" | "Putri";
}) {
  return (
    <div className={styles.person}>
      {photo && (
        <div className={styles.photoFrame}>
          <img src={photo} alt={name} />
        </div>
      )}

      <h3 className={styles.personName}>{name}</h3>
      <span className={styles.personLine} />

      {parents && (
        <p className={styles.personParents}>
          {role} dari
          <br />
          {parents}
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
      <SakuraBranch className={`${styles.branch} ${styles.branchSmall} ${styles.branchTopLeft}`} />
      <SakuraBranch className={`${styles.branch} ${styles.branchSmall} ${styles.branchBottomRight}`} />

      <Reveal>
        <p className={styles.eyebrow}>The Bride &amp; Groom</p>
        <h2 className={styles.title}>Bismillahirrahmanirrahim</h2>
        <div className={styles.ornament}><span className={styles.ornamentMark} /></div>
      </Reveal>

      <div className={styles.coupleGrid}>
        <Reveal delay={0.1}>
          <Person
            name={invitation.bride.name}
            parents={invitation.bride.parents}
            photo={invitation.bride.photo}
            instagram={invitation.bride.instagram}
            role="Putri"
          />
        </Reveal>

        <Reveal delay={0.2} className={styles.middle}>
          <span className={styles.andSymbol}>&amp;</span>
        </Reveal>

        <Reveal delay={0.3}>
          <Person
            name={invitation.groom.name}
            parents={invitation.groom.parents}
            photo={invitation.groom.photo}
            instagram={invitation.groom.instagram}
            role="Putra"
          />
        </Reveal>
      </div>
    </div>
  );
}
