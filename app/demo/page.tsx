import Link from "next/link";
import { themeList } from "@/lib/theme";
import styles from "./demo.module.css";

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
          {themeList.map((theme) => (
            <div className={styles.card} key={theme.key}>
              <div className={styles.swatch}>
                <span
                  className={styles.swatchHalf}
                  style={{ background: theme.swatch[0] }}
                />
                <span
                  className={styles.swatchHalf}
                  style={{ background: theme.swatch[1] }}
                />
              </div>

              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{theme.label}</h2>
                <p className={styles.cardDesc}>{theme.description}</p>

                <Link href={`/demo/${theme.key}`} className={styles.cardButton}>
                  Lihat Demo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
