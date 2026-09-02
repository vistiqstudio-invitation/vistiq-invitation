"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ThemeCoverPreview from "@/components/ThemeCoverPreview";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList, isThemeNew, type ThemeMeta } from "@/lib/theme";
import { getThemeCoverImage } from "@/lib/themeCoverImages";
import styles from "@/app/demo/demo.module.css";

function CartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="18" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M21 3 3 10.5l7 3 3 7L21 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 3 10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
  { key: "premium-3d-motion", label: "Tema Premium 3D Motion" },
  { key: "luxury-art", label: "Luxury Art" },
  { key: "reguler", label: "Tema Reguler" },
  { key: "adat", label: "Tema Adat" },
  { key: "tanpa-foto", label: "Tanpa Foto" },
] as const;

type WeddingSubKey = (typeof WEDDING_SUBFILTERS)[number]["key"];

const COMING_SOON: Record<string, { label: string; description: string }> = {
  wisuda: { label: "Wisuda", description: "Tema undangan wisuda digital - segera hadir." },
};

function ThemeCard({
  theme,
  demoPath,
  eyebrowLabel,
  priceLabel,
  priceWasLabel,
  discountLabel,
  waNumber,
  brandName,
}: {
  theme: ThemeMeta;
  demoPath: string;
  eyebrowLabel: string;
  priceLabel: string;
  priceWasLabel?: string;
  discountLabel?: string;
  waNumber: string;
  brandName: string;
}) {
  const orderText = encodeURIComponent(`Halo ${brandName}, saya ingin order undangan tema ${theme.label}`);

  return (
    <div className={styles.card}>
      {isThemeNew(theme) && <span className={styles.newBadge}>Baru</span>}

      <div className={styles.cardPreview}>
        <ThemeCoverPreview
          coverImage={getThemeCoverImage(theme.key, demoPath)}
          swatch={theme.swatch}
          label={theme.label}
          demoPath={demoPath}
          themeKey={theme.key}
        />
        {priceWasLabel && discountLabel && <span className={styles.discountBadge}>DISC. {discountLabel}</span>}
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardEyebrow}>{eyebrowLabel}</p>
        <h2 className={styles.cardTitle}>
          <CartIcon /> {theme.label}
        </h2>
        <p className={styles.cardDesc}>{theme.description}</p>

        <div className={styles.priceRow}>
          {priceWasLabel && <span className={styles.priceWas}>{priceWasLabel}</span>}
          <span className={styles.priceNow}>{priceLabel}</span>
        </div>

        <div className={styles.cardActions}>
          <Link href={`${demoPath}/${theme.key}`} className={styles.cardButton}>
            <SendIcon /> Lihat Tema
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
  priceWasLabel,
  discountLabel,
  defaultOccasion,
}: {
  waNumber?: string;
  brandName?: string;
  priceLabel?: string;
  priceWasLabel?: string;
  discountLabel?: string;
  defaultOccasion?: OccasionKey;
}) {
  const [occasion, setOccasion] = useState<OccasionKey | null>(defaultOccasion ?? null);
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
            onClick={() => {
              setOccasion((current) => (current === item.key ? null : item.key));
              if (item.key === "wedding") setWeddingSub("semua");
            }}
            aria-pressed={occasion === item.key}
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

      {occasion === null ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Pilih Jenis Undangan</p>
          <p className={styles.emptyStateDesc}>
            Klik Wedding, Khitan, Wisuda, Akikah, atau Ulang Tahun untuk melihat pilihan temanya.
          </p>
        </div>
      ) : occasion === "wedding" && weddingSub === "tanpa-foto" ? (
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
              demoPath="/demo"
              eyebrowLabel="Indonesian Wedding"
              priceLabel={priceLabel}
              priceWasLabel={priceWasLabel}
              discountLabel={discountLabel}
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
              demoPath="/demo-khitan"
              eyebrowLabel="Indonesian Khitan"
              priceLabel={priceLabel}
              priceWasLabel={priceWasLabel}
              discountLabel={discountLabel}
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
              demoPath="/demo-akikah"
              eyebrowLabel="Indonesian Aqiqah"
              priceLabel={priceLabel}
              priceWasLabel={priceWasLabel}
              discountLabel={discountLabel}
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
              demoPath="/demo-ulang-tahun"
              eyebrowLabel="Kids Birthday"
              priceLabel={priceLabel}
              priceWasLabel={priceWasLabel}
              discountLabel={discountLabel}
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
