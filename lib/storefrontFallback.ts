export type Storefront = {
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

type StorefrontFallback = Storefront & {
  domain: string;
  reseller_id: string;
};

// Keeps verified custom-domain storefronts available during a temporary
// Supabase API or Storage outage. The database remains the primary source.
const STOREFRONT_FALLBACKS: readonly StorefrontFallback[] = [
  {
    domain: "narasa.biz.id",
    reseller_id: "f380ade5-e8af-4fda-8777-e8485af2ac4c",
    brand_name: "NARASA",
    logo_url: "/brands/narasa.svg",
    brand_color: "#60aac4",
    starting_price: null,
    wedding_price: null,
    khitan_price: 49000,
    graduation_price: 57000,
    aqiqah_price: 48000,
    birthday_price: 43000,
    wedding_premium_price: 86000,
    wedding_motion_price: 99000,
    wedding_luxury_art_price: 68000,
    wedding_regular_price: 40000,
    wedding_adat_price: 45000,
    wedding_no_photo_price: 30000,
    whatsapp: "08998933291",
  },
];

export function getStorefrontFallbackByDomain(domain: string) {
  const normalized = domain.trim().toLowerCase().replace(/\.$/, "");
  return STOREFRONT_FALLBACKS.find((store) => store.domain === normalized) ?? null;
}

export function getStorefrontFallbackByKey(key: string): Storefront | null {
  const normalized = key.trim().toLowerCase();
  return STOREFRONT_FALLBACKS.find(
    (store) => store.reseller_id === normalized || store.domain === normalized
  ) ?? null;
}
