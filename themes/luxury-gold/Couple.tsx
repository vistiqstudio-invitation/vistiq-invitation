"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Couple({ invitation }: Props) {
  return (
    <section className={styles.couple}>
      <p className={styles.sectionLabel}>The Bride & Groom</p>

      <h2 className={styles.sectionTitle}>
        Bismillahirrahmanirrahim
      </h2>

      <div className={styles.coupleGrid}>
        {/* Bride */}

        <div className={styles.person}>
          <div className={styles.photoFrame}>
            <img
              src={
                invitation?.bride_photo ||
                "/images/themes/luxury-gold/bride.jpg"
              }
              alt="Bride"
            />
          </div>

          <h3>
            {invitation?.bride_name || "Nabila Putri"}
          </h3>

          <span className={styles.personLine}></span>

          <p>
            Putri dari
            <br />
            <strong>
              {invitation?.bride_father || "Bapak Ahmad"}
            </strong>
            <br />
            &
            <br />
            <strong>
              {invitation?.bride_mother || "Ibu Siti"}
            </strong>
          </p>

          {invitation?.bride_instagram && (
            <a
              href={`https://instagram.com/${invitation.bride_instagram}`}
              target="_blank"
            >
              @{invitation.bride_instagram}
            </a>
          )}
        </div>

        {/* AMPERSAND */}

        <div className={styles.middle}>
          <div className={styles.andCircle}>
            &
          </div>
        </div>

        {/* Groom */}

        <div className={styles.person}>
          <div className={styles.photoFrame}>
            <img
              src={
                invitation?.groom_photo ||
                "/images/themes/luxury-gold/groom.jpg"
              }
              alt="Groom"
            />
          </div>

          <h3>
            {invitation?.groom_name || "Rizky Pratama"}
          </h3>

          <span className={styles.personLine}></span>

          <p>
            Putra dari
            <br />
            <strong>
              {invitation?.groom_father || "Bapak Yusuf"}
            </strong>
            <br />
            &
            <br />
            <strong>
              {invitation?.groom_mother || "Ibu Fatimah"}
            </strong>
          </p>

          {invitation?.groom_instagram && (
            <a
              href={`https://instagram.com/${invitation.groom_instagram}`}
              target="_blank"
            >
              @{invitation.groom_instagram}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}