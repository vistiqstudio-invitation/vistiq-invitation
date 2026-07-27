"use client";

import Link from "next/link";
import ThemeBrowser from "@/components/ThemeBrowser";
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

        <ThemeBrowser />
      </div>
    </main>
  );
}
