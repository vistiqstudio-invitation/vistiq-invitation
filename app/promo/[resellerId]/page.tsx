"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeBrowser from "@/components/ThemeBrowser";
import styles from "../../demo/demo.module.css";
import hero from "./landing.module.css";

// wa.me links need full international digits (62...), but resellers type
// their number however feels natural to them (081..., +6281..., 6281...).
function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

type Storefront = {
  brand_name: string | null;
  logo_url: string | null;
  brand_color: string | null;
  starting_price: number | null;
  wedding_price: number | null;
  khitan_price: number | null;
  graduation_price: number | null;
  aqiqah_price: number | null;
  birthday_price: number | null;
  wedding_premium_price: number | null;
  wedding_motion_price: number | null;
  wedding_luxury_art_price: number | null;
  wedding_regular_price: number | null;
  wedding_adat_price: number | null;
  wedding_no_photo_price: number | null;
  whatsapp: string | null;
};

export default function ResellerPromoPage() {
  const params = useParams<{ resellerId: string }>();
  const supabase = createClient();
  const [store, setStore] = useState<Storefront | null | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .rpc("get_reseller_storefront", { p_reseller_id: params.resellerId })
        .maybeSingle();
      setStore((data as Storefront) ?? null);
    };
    load();
  }, [params.resellerId]);

  if (store === undefined) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>Memuat...</div>
      </main>
    );
  }

  if (!store || !store.whatsapp) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Vistiq Invitation</p>
          <h1 className={styles.title}>Katalog Tidak Ditemukan</h1>
          <p className={styles.subtitle}>Link ini tidak valid atau belum aktif.</p>
        </div>
      </main>
    );
  }

  const brandName = store.brand_name || "Vistiq Invitation";
  const configuredPrices = [
    store.wedding_price,
    store.khitan_price,
    store.graduation_price,
    store.aqiqah_price,
    store.birthday_price,
    store.wedding_premium_price,
    store.wedding_motion_price,
    store.wedding_luxury_art_price,
    store.wedding_regular_price,
    store.wedding_adat_price,
    store.wedding_no_photo_price,
  ].filter((price): price is number => Number(price) > 0);
  const lowestPrice = configuredPrices.length > 0
    ? Math.min(...configuredPrices.map(Number))
    : Number(store.starting_price || 0);
  const priceLabel = lowestPrice
    ? `Mulai dari Rp ${lowestPrice.toLocaleString("id-ID")}`
    : "Hubungi untuk harga";
  const categoryPriceLabels = {
    wedding: store.wedding_price ? `Rp ${Number(store.wedding_price).toLocaleString("id-ID")}` : priceLabel,
    khitan: store.khitan_price ? `Rp ${Number(store.khitan_price).toLocaleString("id-ID")}` : priceLabel,
    wisuda: store.graduation_price ? `Rp ${Number(store.graduation_price).toLocaleString("id-ID")}` : priceLabel,
    akikah: store.aqiqah_price ? `Rp ${Number(store.aqiqah_price).toLocaleString("id-ID")}` : priceLabel,
    "ulang-tahun": store.birthday_price ? `Rp ${Number(store.birthday_price).toLocaleString("id-ID")}` : priceLabel,
  };
  const weddingPriceLabels = {
    premium: store.wedding_premium_price ? `Rp ${Number(store.wedding_premium_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
    "premium-3d-motion": store.wedding_motion_price ? `Rp ${Number(store.wedding_motion_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
    "luxury-art": store.wedding_luxury_art_price ? `Rp ${Number(store.wedding_luxury_art_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
    reguler: store.wedding_regular_price ? `Rp ${Number(store.wedding_regular_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
    adat: store.wedding_adat_price ? `Rp ${Number(store.wedding_adat_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
    "tanpa-foto": store.wedding_no_photo_price ? `Rp ${Number(store.wedding_no_photo_price).toLocaleString("id-ID")}` : categoryPriceLabels.wedding,
  };
  const waNumber = normalizeWhatsapp(store.whatsapp);

  return (
    <main
      className={styles.page}
      style={store.brand_color ? ({ "--accent": store.brand_color } as React.CSSProperties) : undefined}
    >
      <div className={styles.inner}>
        <section className={hero.hero}>
          <div className={hero.heroTop}>
            {store.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logo_url} alt={brandName} className={hero.heroLogo} />
            )}
            <div>
              <p className={hero.heroEyebrow}>Undangan Digital Premium</p>
              <p className={hero.heroBrand}>{brandName}</p>
            </div>
          </div>

          <h1 className={hero.heroHeadline}>Undangan digital yang bikin acara Anda diingat tamu</h1>
          <p className={hero.heroCopy}>
            Pernikahan, khitan, aqiqah, wisuda, atau ulang tahun — pilih dari puluhan tema siap pakai, lihat tampilan aslinya
            langsung, lalu konsultasikan kebutuhan Anda ke {brandName} lewat WhatsApp.
          </p>

          <ul className={hero.heroTrust}>
            <li>40+ pilihan tema</li>
            <li>Proses cepat</li>
            <li>Bisa request desain khusus</li>
          </ul>

          <div className={hero.heroActions}>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${brandName}, saya ingin tanya-tanya soal undangan digital.`)}`}
              target="_blank"
              className={hero.heroCta}
            >
              Chat Sekarang via WhatsApp
            </a>
            <span className={hero.heroPrice}>Harga <strong>{priceLabel}</strong></span>
          </div>
        </section>

        <p className={hero.sectionLabel}>Pilih Tema Undangan</p>
        <p className={hero.sectionSub}>Lihat langsung tampilan setiap tema, lalu order dari tema yang Anda suka.</p>

        <ThemeBrowser
          waNumber={waNumber}
          brandName={brandName}
          priceLabel={priceLabel}
          priceLabels={categoryPriceLabels}
          weddingPriceLabels={weddingPriceLabels}
        />
      </div>
    </main>
  );
}
