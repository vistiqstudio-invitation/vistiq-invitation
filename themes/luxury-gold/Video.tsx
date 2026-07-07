"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Video({ invitation }: Props) {
  if (!invitation?.video_url) return null;

  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>
        Pre Wedding
      </p>

      <h2 className={styles.sectionTitle}>
        Wedding Video
      </h2>

      <div className={styles.videoBox}>
        <iframe
          src={invitation.video_url}
          allowFullScreen
        />
      </div>
    </section>
  );
}