import type { Metadata } from "next";
import ThemeBrowser from "@/components/ThemeBrowser";
import floating from "@/components/FloatingWhatsApp.module.css";
import TenantUrlCleaner from "@/components/TenantUrlCleaner";
import {
  getStorefrontFallbackByKey,
  type Storefront,
} from "@/lib/storefrontFallback";
import styles from "../../demo/demo.module.css";
import hero from "./landing.module.css";

function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

type PageProps = { params: Promise<{ resellerId: string }> };

async function getStorefront(key: string): Promise<Storefront | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const fallback = getStorefrontFallbackByKey(key);
  if (!url || !apiKey) return fallback;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/get_reseller_storefront_by_key`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_key: key }),
      next: { revalidate: 60 },
    });

    if (!response.ok) return fallback;
    const rows = await response.json();
    return ((Array.isArray(rows) ? rows[0] : rows) as Storefront | null) || fallback;
  } catch {
    return fallback;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { resellerId } = await params;
  const store = await getStorefront(resellerId);
  const brandName = store?.brand_name?.trim() || "Undangan Digital";
  const description = `Katalog undangan digital premium dari ${brandName}.`;

  return {
    title: { absolute: brandName },
    applicationName: brandName,
    description,
    manifest: `/api/storefront/manifest?key=${encodeURIComponent(resellerId)}`,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: brandName,
    },
    openGraph: {
      title: brandName,
      description,
      ...(store?.logo_url ? { images: [{ url: store.logo_url, alt: brandName }] } : {}),
    },
    ...(store?.logo_url
      ? { icons: { icon: [{ url: store.logo_url }], apple: [{ url: store.logo_url }] } }
      : {}),
  };
}

export default async function ResellerPromoPage({ params }: PageProps) {
  const { resellerId } = await params;
  const store = await getStorefront(resellerId);

  if (!store || !store.whatsapp) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Undangan Digital</p>
          <h1 className={styles.title}>Katalog Tidak Ditemukan</h1>
          <p className={styles.subtitle}>Link ini tidak valid atau belum aktif.</p>
        </div>
      </main>
    );
  }

  const brandName = store.brand_name?.trim() || "Undangan Digital";
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
  const whatsappHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${brandName}, saya ingin tanya-tanya soal undangan digital.`)}`;

  return (
    <main
      className={styles.page}
      style={store.brand_color ? ({ "--accent": store.brand_color } as React.CSSProperties) : undefined}
    >
      <TenantUrlCleaner />
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
            <a href={whatsappHref} target="_blank" rel="noreferrer" className={hero.heroCta}>
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

      <a className={floating.button} href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`Hubungi ${brandName} melalui WhatsApp`}>
        <span className={floating.pulse} aria-hidden="true" />
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16.04 3C8.86 3 3.03 8.73 3.03 15.79c0 2.25.6 4.45 1.74 6.38L3 28.55l6.6-1.7a13.1 13.1 0 0 0 6.43 1.63h.01c7.17 0 13.01-5.74 13.01-12.79C29.05 8.64 23.21 3 16.04 3Zm0 23.32h-.01a10.9 10.9 0 0 1-5.55-1.49l-.4-.23-3.92 1.01 1.05-3.75-.26-.39a10.5 10.5 0 0 1-1.68-5.68c0-5.87 4.83-10.64 10.78-10.64 5.94 0 10.77 4.77 10.77 10.64 0 5.86-4.84 10.53-10.78 10.53Zm5.91-7.98c-.32-.16-1.92-.93-2.22-1.03-.29-.11-.51-.16-.72.16-.22.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.61-1.56a9.7 9.7 0 0 1-1.81-2.22c-.19-.32-.02-.49.14-.65.15-.14.33-.37.49-.55.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.15-.73-1.72-.99-2.36-.27-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.86.4-.3.31-1.14 1.09-1.14 2.67 0 1.57 1.16 3.09 1.32 3.3.16.21 2.29 3.44 5.54 4.82.78.33 1.38.52 1.85.67.78.24 1.48.21 2.04.13.62-.09 1.92-.78 2.19-1.52.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.63-.37Z" />
        </svg>
        <span className={floating.copy}>
          <small>Butuh bantuan?</small>
          <strong>Chat {brandName}</strong>
        </span>
      </a>
    </main>
  );
}
