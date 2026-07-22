"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { aqiqahThemeList } from "@/lib/theme";
import { COVER_BY_THEME } from "@/lib/demoAqiqahInvitation";
import styles from "../demo/demo.module.css";

const WA_NUMBER = "6281371338032";

function useMockupWidth() {
  const [width, setWidth] = useState(150);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setWidth(mq.matches ? 84 : 150);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return width;
}

export default function DemoAkikahPickerPage() {
  const mockupWidth = useMockupWidth();

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/" className={styles.back}>
          ← Kembali ke Beranda
        </Link>

        <p className={styles.eyebrow}>Vistiq Invitation</p>
        <h1 className={styles.title}>Pilih Tema Undangan Aqiqah</h1>
        <p className={styles.subtitle}>
          Lihat langsung tampilan setiap tema undangan aqiqah digital yang
          tersedia, lengkap dengan animasi, RSVP, dan galeri fotonya.
        </p>

        <div className={styles.grid}>
          {aqiqahThemeList.map((theme) => {
            const orderText = encodeURIComponent(
              `Halo Vistiq Invitation, saya ingin order undangan aqiqah tema ${theme.label}`
            );

            return (
              <div className={styles.card} key={theme.key}>
                <div className={styles.cardPreview}>
                  <PhoneMockup
                    themeKey={theme.key}
                    width={mockupWidth}
                    demoPath="/demo-akikah"
                    mode="static"
                    coverImage={COVER_BY_THEME[theme.key]}
                    swatch={theme.swatch}
                    label={theme.label}
                  />
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardEyebrow}>Indonesian Aqiqah</p>
                  <h2 className={styles.cardTitle}>{theme.label}</h2>
                  <p className={styles.cardDesc}>{theme.description}</p>

                  <div className={styles.priceRow}>
                    <span className={styles.priceNow}>Rp 149.000</span>
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/demo-akikah/${theme.key}`} className={styles.cardButton}>
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
