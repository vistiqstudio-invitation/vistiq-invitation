import "server-only";

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getStorefront } from "./getStorefront";
import type { Brand } from "@/types/invitation";

export type DemoThemePageProps = {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ reseller?: string | string[] }>;
};

export async function getDemoBrand(searchParams: DemoThemePageProps["searchParams"]): Promise<Brand> {
  const [requestHeaders, query] = await Promise.all([headers(), searchParams]);
  const tenantKey = requestHeaders.get("x-vistiq-reseller-id");
  const resellerKey = tenantKey || (typeof query.reseller === "string" ? query.reseller : null);
  if (!resellerKey) return null;

  const store = await getStorefront(resellerKey);
  if (!store?.whatsapp) notFound();

  return {
    name: store.brand_name?.trim() || "Undangan Digital",
    logoUrl: store.logo_url,
    color: store.brand_color,
  };
}
