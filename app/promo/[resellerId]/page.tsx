"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PhoneMockup from "@/components/PhoneMockup";
import { createClient } from "@/lib/supabase/client";
import { themeList, aqiqahThemeList, khitanThemeList } from "@/lib/theme";
import { COVER_BY_THEME as WEDDING_COVERS } from "@/lib/demoInvitation";
import { COVER_BY_THEME as AQIQAH_COVERS } from "@/lib/demoAqiqahInvitation";
import { COVER_BY_THEME as KHITAN_COVERS } from "@/lib/demoKhitanInvitation";
import styles from "../../demo/demo.module.css";
import hero from "./landing.module.css";

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
  whatsapp: string | null;
};

const SECTIONS = [
  { key: "wedding", title: "Undangan Pernikahan", eyebrow: "Indonesian Wedding", themes: themeList, demoPath: "/demo", covers: WEDDING_COVERS },
  { key: "aqiqah", title: "Undangan Aqiqah", eyebrow: "Indonesian Aqiqah", themes: aqiqahThemeList, demoPath: "/demo-akikah", covers: AQIQAH_COVERS },
  { key: "khitan", title: "Undangan Khitan", eyebrow: "Indonesian Khitan", themes: khitanThemeList, demoPath: "/demo-khitan", covers: KHITAN_COVERS },
];

export default function ResellerPromoPage() {
  const params = useParams<{ resellerId: string }>();
  const supabase = createClient();
  const mockupWidth = useMockupWidth();
  const [store, setStore] = useState<Storefront | null | undefined>(undefined);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

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
  const priceLabel = store.starting_price
    ? `Mulai dari Rp ${Number(store.starting_price).toLocaleString("id-ID")}`
    : "Hubungi untuk harga";
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
            Pernikahan, aqiqah, atau khitan — pilih dari puluhan tema siap pakai, lihat tampilan aslinya
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

        <div style={{ display: "flex", gap: 8, margin: "20px 0 8px", flexWrap: "wrap" }}>
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              style={{
                padding: "9px 18px",
                borderRadius: 999,
                border: "1px solid var(--accent, #1167b2)",
                background: activeSection === section.key ? "var(--accent, #1167b2)" : "white",
                color: activeSection === section.key ? "white" : "var(--accent, #1167b2)",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {SECTIONS.filter((section) => section.key === activeSection).map((section) => (
          <div key={section.key}>
            <div className={styles.grid} style={{ marginTop: 20 }}>
              {section.themes.map((theme) => {
                const orderText = encodeURIComponent(
                  `Halo ${brandName}, saya ingin order undangan tema ${theme.label}`
                );

                return (
                  <div className={styles.card} key={theme.key}>
                    <div className={styles.cardPreview}>
                      <PhoneMockup
                        themeKey={theme.key}
                        width={mockupWidth}
                        demoPath={section.demoPath}
                        mode="static"
                        coverImage={section.covers[theme.key]}
                        swatch={theme.swatch}
                        label={theme.label}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <p className={styles.cardEyebrow}>{section.eyebrow}</p>
                      <h2 className={styles.cardTitle}>{theme.label}</h2>
                      <p className={styles.cardDesc}>{theme.description}</p>

                      <div className={styles.priceRow}>
                        <span className={styles.priceNow}>{priceLabel}</span>
                      </div>

                      <div className={styles.cardActions}>
                        <Link href={`${section.demoPath}/${theme.key}`} className={styles.cardButton}>
                          Lihat Demo
                        </Link>
                        <a
                          href={`https://wa.me/${waNumber}?text=${orderText}`}
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
        ))}
      </div>
    </main>
  );
}
