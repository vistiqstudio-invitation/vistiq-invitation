"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList, isThemeNew, type ThemeMeta } from "@/lib/theme";
import { COVER_BY_THEME as WEDDING_COVER_BY_THEME } from "@/lib/demoInvitation";
import { COVER_BY_THEME as AQIQAH_COVER_BY_THEME } from "@/lib/demoAqiqahInvitation";
import { COVER_BY_THEME as KHITAN_COVER_BY_THEME } from "@/lib/demoKhitanInvitation";
import { COVER_BY_THEME as BIRTHDAY_COVER_BY_THEME } from "@/lib/demoBirthdayInvitation";
import styles from "@/app/demo/demo.module.css";

const OCCASIONS = [
  { key: "wedding", label: "Wedding" },
  { key: "khitan", label: "Khitan" },
  { key: "wisuda", label: "Wisuda" },
  { key: "akikah", label: "Akikah" },
  { key: "ulang-tahun", label: "Ulang Tahun" },
] as const;

type OccasionKey = (typeof OCCASIONS)[number]["key"];

const WEDDING_SUBFILTERS = [
  { key: "semua", label: "Semua Tema" },
  { key: "premium", label: "Tema Premium" },
  { key: "reguler", label: "Tema Reguler" },
  { key: "adat", label: "Tema Adat" },
  { key: "tanpa-foto", label: "Tanpa Foto" },
] as const;

type WeddingSubKey = (typeof WEDDING_SUBFILTERS)[number]["key"];

const COMING_SOON: Record<string, { label: string; description: string }> = {
  wisuda: { label: "Wisuda", description: "Tema undangan wisuda digital - segera hadir." },
};

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
  priceLabel,
  waNumber,
  brandName,
}: {
  theme: ThemeMeta;
  mockupWidth: number;
  demoPath: string;
  coverImage?: string;
  overlay: { eyebrow: string; title: string; date: string };
  eyebrowLabel: string;
  priceLabel: string;
  waNumber: string;
  brandName: string;
}) {
  const orderText = encodeURIComponent(`Halo ${brandName}, saya ingin order undangan tema ${theme.label}`);

  return (
    <div className={styles.card}>
      {isThemeNew(theme) && <span className={styles.newBadge}>Baru</span>}

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
          <span className={styles.priceNow}>{priceLabel}</span>
        </div>

        <div className={styles.cardActions}>
          <Link href={`${demoPath}/${theme.key}`} className={styles.cardButton}>
            Lihat Demo
          </Link>
          <a href={`https://wa.me/${waNumber}?text=${orderText}`} target="_blank" className={styles.orderButton}>
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
        <h2 className={styles.cardTitle}>{label}</h2>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function ThemeBrowser({
  waNumber = "6281371338032",
  brandName = "Vistiq Invitation",
  priceLabel = "Rp 99.000",
  defaultOccasion = "wedding",
}: {
  waNumber?: string;
  brandName?: string;
  priceLabel?: string;
  defaultOccasion?: OccasionKey;
}) {
  const mockupWidth = useMockupWidth();
  const [occasion, setOccasion] = useState<OccasionKey>(defaultOccasion);
  const [weddingSub, setWeddingSub] = useState<WeddingSubKey>("semua");

  const filteredWeddingThemes = useMemo(() => {
    if (weddingSub === "semua") return themeList;
    if (weddingSub === "tanpa-foto") return [];
    return themeList.filter((theme) => theme.tags?.includes(weddingSub));
  }, [weddingSub]);

  return (
    <div>
      <div className={styles.filterRow}>
        {OCCASIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setOccasion(item.key)}
            className={`${styles.filterButton} ${occasion === item.key ? styles.filterButtonActive : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {occasion === "wedding" && (
        <div className={`${styles.filterRow} ${styles.subFilterRow}`}>
          {WEDDING_SUBFILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setWeddingSub(item.key)}
              className={`${styles.filterButton} ${styles.filterButtonSub} ${
                weddingSub === item.key ? styles.filterButtonActive : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {occasion === "wedding" && weddingSub === "tanpa-foto" ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Segera Hadir</p>
          <p className={styles.emptyStateDesc}>
            Tema tanpa foto sedang kami siapkan. Hubungi kami di WhatsApp untuk info lebih lanjut.
          </p>
        </div>
      ) : occasion === "wedding" ? (
        <div className={styles.grid}>
          {filteredWeddingThemes.map((theme) => (
            <ThemeCard
              key={theme.key}
              theme={theme}
              mockupWidth={mockupWidth}
              demoPath="/demo"
              coverImage={WEDDING_COVER_BY_THEME[theme.key]}
              eyebrowLabel="Indonesian Wedding"
              overlay={{ eyebrow: "The Wedding Of", title: "Mempelai Pria & Mempelai Wanita", date: "Minggu, 20 September 2026" }}
              priceLabel={priceLabel}
              waNumber={waNumber}
              brandName={brandName}
            />
          ))}
        </div>
      ) : occasion === "khitan" ? (
        <div className={styles.grid}>
          {khitanThemeList.map((theme) => (
            <ThemeCard
              key={theme.key}
              theme={theme}
              mockupWidth={mockupWidth}
              demoPath="/demo-khitan"
              coverImage={KHITAN_COVER_BY_THEME[theme.key]}
              eyebrowLabel="Indonesian Khitan"
              overlay={{ eyebrow: "Khitanan", title: "Nama Anak", date: "Minggu, 20 September 2026" }}
              priceLabel={priceLabel}
              waNumber={waNumber}
              brandName={brandName}
            />
          ))}
        </div>
      ) : occasion === "akikah" ? (
        <div className={styles.grid}>
          {aqiqahThemeList.map((theme) => (
            <ThemeCard
              key={theme.key}
              theme={theme}
              mockupWidth={mockupWidth}
              demoPath="/demo-akikah"
              coverImage={AQIQAH_COVER_BY_THEME[theme.key]}
              eyebrowLabel="Indonesian Aqiqah"
              overlay={{ eyebrow: "Aqiqah & Tasyakuran", title: "Nama Buah Hati", date: "Minggu, 20 September 2026" }}
              priceLabel={priceLabel}
              waNumber={waNumber}
              brandName={brandName}
            />
          ))}
        </div>
      ) : occasion === "ulang-tahun" ? (
        <div className={styles.grid}>
          {birthdayThemeList.map((theme) => (
            <ThemeCard
              key={theme.key}
              theme={theme}
              mockupWidth={mockupWidth}
              demoPath="/demo-ulang-tahun"
              coverImage={BIRTHDAY_COVER_BY_THEME[theme.key]}
              eyebrowLabel="Kids Birthday"
              overlay={{ eyebrow: "Birthday Invitation", title: "Putri Kecil — 7 Tahun", date: "Minggu, 20 September 2026" }}
              priceLabel={priceLabel}
              waNumber={waNumber}
              brandName={brandName}
            />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          <ComingSoonCard {...COMING_SOON[occasion]} />
        </div>
      )}
    </div>
  );
}
