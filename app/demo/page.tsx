"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { themeList, aqiqahThemeList, khitanThemeList, type ThemeMeta } from "@/lib/theme";
import { COVER_BY_THEME as WEDDING_COVER_BY_THEME } from "@/lib/demoInvitation";
import { COVER_BY_THEME as AQIQAH_COVER_BY_THEME } from "@/lib/demoAqiqahInvitation";
import { COVER_BY_THEME as KHITAN_COVER_BY_THEME } from "@/lib/demoKhitanInvitation";
import styles from "./demo.module.css";

const WA_NUMBER = "6281371338032";

const CATEGORIES = [
  { key: "semua", label: "Semua Tema" },
  { key: "reguler", label: "Tema Reguler" },
  { key: "premium", label: "Tema Premium" },
  { key: "adat", label: "Tema Adat" },
  { key: "tanpa-foto", label: "Tanpa Foto" },
  { key: "non-wedding", label: "Non Wedding" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const COMING_SOON_NON_WEDDING = [
  { label: "Ulang Tahun", description: "Tema undangan ulang tahun digital - segera hadir." },
  { label: "Wisuda", description: "Tema undangan wisuda digital - segera hadir." },
];

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

function ThemeCard({
  theme,
  mockupWidth,
  demoPath,
  coverImage,
  overlay,
  eyebrowLabel,
  orderText,
}: {
  theme: ThemeMeta;
  mockupWidth: number;
  demoPath: string;
  coverImage?: string;
  overlay: { eyebrow: string; title: string; date: string };
  eyebrowLabel: string;
  orderText: string;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardPreview}>
        <PhoneMockup
          themeKey={theme.key}
          width={mockupWidth}
          demoPath={demoPath}
          mode="static"
          coverImage={coverImage}
          swatch={theme.swatch}
          label={theme.label}
          overlay={overlay}
        />
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardEyebrow}>{eyebrowLabel}</p>
        <h2 className={styles.cardTitle}>{theme.label}</h2>
        <p className={styles.cardDesc}>{theme.description}</p>

        <div className={styles.priceRow}>
          <span className={styles.priceNow}>Rp 149.000</span>
        </div>

        <div className={styles.cardActions}>
          <Link href={`${demoPath}/${theme.key}`} className={styles.cardButton}>
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
}

function ComingSoonCard({ label, description }: { label: string; description: string }) {
  return (
    <div className={`${styles.card} ${styles.cardComingSoon}`}>
      <div className={styles.cardPreview}>
        <span className={styles.comingSoonBadge}>Segera Hadir</span>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardEyebrow}>Non Wedding</p>
        <h2 className={styles.cardTitle}>{label}</h2>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function DemoPickerPage() {
  const mockupWidth = useMockupWidth();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("semua");

  const filteredWeddingThemes = useMemo(() => {
    if (activeCategory === "semua") return themeList;
    if (activeCategory === "reguler" || activeCategory === "premium" || activeCategory === "adat") {
      return themeList.filter((theme) => theme.tags?.includes(activeCategory));
    }
    return [];
  }, [activeCategory]);

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

        <div className={styles.filterRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`${styles.filterButton} ${
                activeCategory === cat.key ? styles.filterButtonActive : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategory === "tanpa-foto" ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>Segera Hadir</p>
            <p className={styles.emptyStateDesc}>
              Tema tanpa foto sedang kami siapkan. Hubungi kami di WhatsApp
              untuk info lebih lanjut.
            </p>
          </div>
        ) : activeCategory === "non-wedding" ? (
          <div className={styles.grid}>
            {aqiqahThemeList.map((theme) => (
              <ThemeCard
                key={theme.key}
                theme={theme}
                mockupWidth={mockupWidth}
                demoPath="/demo-akikah"
                coverImage={AQIQAH_COVER_BY_THEME[theme.key]}
                eyebrowLabel="Indonesian Aqiqah"
                overlay={{
                  eyebrow: "Aqiqah & Tasyakuran",
                  title: "Muhammad Rayyan Athallah",
                  date: "Minggu, 20 September 2026",
                }}
                orderText={encodeURIComponent(
                  `Halo Vistiq Invitation, saya ingin order undangan aqiqah tema ${theme.label}`
                )}
              />
            ))}

            {khitanThemeList.map((theme) => (
              <ThemeCard
                key={theme.key}
                theme={theme}
                mockupWidth={mockupWidth}
                demoPath="/demo-khitan"
                coverImage={KHITAN_COVER_BY_THEME[theme.key]}
                eyebrowLabel="Indonesian Khitan"
                overlay={{
                  eyebrow: "Khitanan",
                  title: "Muhammad Rayyan Athallah",
                  date: "Minggu, 20 September 2026",
                }}
                orderText={encodeURIComponent(
                  `Halo Vistiq Invitation, saya ingin order undangan khitan tema ${theme.label}`
                )}
              />
            ))}

            {COMING_SOON_NON_WEDDING.map((item) => (
              <ComingSoonCard key={item.label} label={item.label} description={item.description} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredWeddingThemes.map((theme) => (
              <ThemeCard
                key={theme.key}
                theme={theme}
                mockupWidth={mockupWidth}
                demoPath="/demo"
                coverImage={WEDDING_COVER_BY_THEME[theme.key]}
                eyebrowLabel="Indonesian Wedding"
                overlay={{
                  eyebrow: "The Wedding Of",
                  title: "Rizky Pratama & Nabila Putri",
                  date: "Minggu, 20 September 2026",
                }}
                orderText={encodeURIComponent(
                  `Halo Vistiq Invitation, saya ingin order undangan tema ${theme.label}`
                )}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
