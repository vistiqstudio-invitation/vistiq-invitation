import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { themeList } from "@/lib/theme";
import styles from "./demo.module.css";

const WA_NUMBER = "6281371338032";

export default function DemoPickerPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/" className={styles.back}>
          ← Kembali ke Beranda
        </Link>

        <p className={styles.eyebrow}>Vistiq Invitation</p>
        <h1 className={styles.title}>Pilih Tema Undangan</h1>
        <p className={styles.subtitle}>
          Lihat langsung tampilan setiap tema undangan digital yang tersedia,
          lengkap dengan animasi, RSVP, dan galeri fotonya.
        </p>

        <div className={styles.grid}>
          {themeList.map((theme) => {
            const orderText = encodeURIComponent(
              `Halo Vistiq Invitation, saya ingin order undangan tema ${theme.label}`
            );

            return (
              <div className={styles.card} key={theme.key}>
                <div className={styles.cardPreview}>
                  <PhoneMockup themeKey={theme.key} width={150} />
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardEyebrow}>Indonesian Wedding</p>
                  <h2 className={styles.cardTitle}>{theme.label}</h2>
                  <p className={styles.cardDesc}>{theme.description}</p>

                  <div className={styles.priceRow}>
                    <span className={styles.priceNow}>Rp 149.000</span>
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/demo/${theme.key}`} className={styles.cardButton}>
                      Lihat Demo
                    </Link>
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${orderText}`}
                      target="_blank"
                      className={styles.orderButton}
                    >
                      Order
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
