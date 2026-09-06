"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { themeList, aqiqahThemeList, khitanThemeList, birthdayThemeList, isThemeNew, type ThemeMeta } from "@/lib/theme";
import { getThemeCardPreviewImage, getThemeCoverImage } from "@/lib/themeCoverImages";
import styles from "@/app/demo/demo.module.css";

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

const SCREENSHOT_VARIANTS = [
  { label: "Cover", objectPosition: "50% 0%", transform: "scale(1)" },
  { label: "Kisah", objectPosition: "50% 33%", transform: "scale(1.08)" },
  { label: "Acara", objectPosition: "50% 66%", transform: "scale(1.08)" },
  { label: "Galeri", objectPosition: "50% 100%", transform: "scale(1.04)" },
] as const;

function getThemeScreenshotImages(coverImage: string | null) {
  // The catalog cards must show screenshots of the invitation website itself.
  // Reuse the portrait website preview and crop different vertical sections;
  // the invitation gallery contains raw couple photos and must not be used here.
  return SCREENSHOT_VARIANTS.map(() => coverImage);
}

function ThemeScreenshotCard({
  theme,
  image,
  variant,
}: {
  theme: ThemeMeta;
  image: string | null;
  variant: (typeof SCREENSHOT_VARIANTS)[number];
}) {
  return (
    <div className={styles.screenshotCard} role="img" aria-label={`Preview ${variant.label} tema ${theme.label}`}>
      <div className={styles.screenshotChrome} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div
        className={styles.screenshotViewport}
        style={{ background: `linear-gradient(155deg, ${theme.swatch[0]}, ${theme.swatch[1]})` }}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 28vw, 100px"
            className={styles.screenshotImage}
            style={{ objectPosition: variant.objectPosition, transform: variant.transform }}
          />
        ) : (
          <span className={styles.screenshotFallback}>{variant.label}</span>
        )}
      </div>
    </div>
  );
}

function ThemeCatalogPreview({
  theme,
  demoPath,
  coverImage,
  previewImages,
  cardImage,
}: {
  theme: ThemeMeta;
  demoPath: string;
  coverImage: string | null;
  previewImages: Array<string | null>;
  cardImage: string | null;
}) {
  return (
    <div
      className={`${styles.catalogPreview} ${cardImage ? styles.catalogPreviewCustom : ""}`}
      role="img"
      aria-label={`Preview katalog tema ${theme.label}`}
    >
      {cardImage ? (
        <Image
          src={cardImage}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1040px) 33vw, 260px"
          className={styles.catalogImage}
        />
      ) : (
        <>
          <div className={styles.screenshotDeck} aria-hidden="true">
            {SCREENSHOT_VARIANTS.map((variant, index) => (
              <ThemeScreenshotCard key={variant.label} theme={theme} image={previewImages[index] || null} variant={variant} />
            ))}
          </div>
          <div className={styles.catalogPhone} aria-hidden="true">
            <PhoneMockup
              themeKey={theme.key}
              demoPath={demoPath}
              mode="static"
              width={74}
              coverImage={coverImage}
              swatch={theme.swatch}
              label={theme.label}
            />
          </div>
        </>
      )}
    </div>
  );
}

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
  const coverImage = getThemeCoverImage(theme.key, demoPath);
  const cardImage = getThemeCardPreviewImage(theme.key, demoPath);
  const previewImages = getThemeScreenshotImages(coverImage);

  return (
    <div className={styles.card}>
      {isThemeNew(theme) && <span className={styles.newBadge}>Baru</span>}

      <div className={styles.cardPreview}>
        <ThemeCatalogPreview
          theme={theme}
          demoPath={demoPath}
          coverImage={coverImage}
          previewImages={previewImages}
          cardImage={cardImage}
        />
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardEyebrow}>{eyebrowLabel}</p>
        <h2 className={styles.cardTitle}>{theme.label}</h2>
        <p className={styles.cardDesc}>{theme.description}</p>

        <div className={styles.priceRow}>
          <span className={styles.priceNow}>{priceLabel}</span>
          {priceWasLabel && <span className={styles.priceWas}>{priceWasLabel}</span>}
          {discountLabel && <span className={styles.priceBadge}>Disc. {discountLabel}</span>}
        </div>

        <div className={styles.cardActions}>
          <Link href={`${demoPath}/${theme.key}`} className={styles.cardButton}>
            <SendIcon /> Lihat Tema
          </Link>
          <a
            href={`https://wa.me/${waNumber}?text=${orderText}`}
            target="_blank"
            rel="noreferrer"
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
