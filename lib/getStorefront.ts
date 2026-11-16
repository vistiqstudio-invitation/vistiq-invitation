import "server-only";

import { getStorefrontFallbackByKey, type Storefront } from "./storefrontFallback";

export async function getStorefront(key: string): Promise<Storefront | null> {
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
