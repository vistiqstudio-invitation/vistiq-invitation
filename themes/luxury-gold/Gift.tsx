"use client";

import styles from "./style.module.css";

type Props = {
  invitation: any;
};

export default function Gift({ invitation }: Props) {
  return (
    <section className={styles.section}>

      <p className={styles.sectionLabel}>
        Wedding Gift
      </p>

      <h2 className={styles.sectionTitle}>
        Tanda Kasih
      </h2>

      <div className={styles.card}>

        <h3>{invitation?.bank_name || "BCA"}</h3>

        <p>
          {invitation?.bank_account || "1234567890"}
        </p>

        <p>
          a.n {invitation?.bank_holder || "Rizky Pratama"}
        </p>

      </div>

    </section>
  );
}