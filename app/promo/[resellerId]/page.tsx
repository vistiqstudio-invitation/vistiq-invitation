"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PhoneMockup from "@/components/PhoneMockup";
import { createClient } from "@/lib/supabase/client";
import { themeList, aqiqahThemeList, khitanThemeList } from "@/lib/theme";
import styles from "../../demo/demo.module.css";

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
  { key: "wedding", title: "Undangan Pernikahan", eyebrow: "Indonesian Wedding", themes: themeList, demoPath: "/demo" },
  { key: "aqiqah", title: "Undangan Aqiqah", eyebrow: "Indonesian Aqiqah", themes: aqiqahThemeList, demoPath: "/demo-akikah" },
  { key: "khitan", title: "Undangan Khitan", eyebrow: "Indonesian Khitan", themes: khitanThemeList, demoPath: "/demo-khitan" },
];

export default function ResellerPromoPage() {
  const params = useParams<{ resellerId: string }>();
  const supabase = createClient();
  const mockupWidth = useMockupWidth();
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
        <Link href="/" className={styles.back}>
          ← Kembali ke Beranda
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          {store.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.logo_url}
              alt={brandName}
              style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }}
            />
          )}
          <p className={styles.eyebrow} style={{ margin: 0 }}>{brandName}</p>
        </div>

        <h1 className={styles.title}>Pilih Tema Undangan</h1>
        <p className={styles.subtitle}>
          Lihat langsung tampilan setiap tema undangan digital, lalu order langsung via WhatsApp.
        </p>

        {SECTIONS.map((section) => (
          <div key={section.key}>
            <h2 style={{ fontSize: 24, margin: "44px 0 20px" }}>{section.title}</h2>

            <div className={styles.grid}>
              {section.themes.map((theme) => {
                const orderText = encodeURIComponent(
                  `Halo ${brandName}, saya ingin order undangan tema ${theme.label}`
                );

                return (
                  <div className={styles.card} key={theme.key}>
                    <div className={styles.cardPreview}>
                      <PhoneMockup themeKey={theme.key} width={mockupWidth} demoPath={section.demoPath} />
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
