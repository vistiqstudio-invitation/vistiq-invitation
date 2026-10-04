import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidCustomDomain, normalizeCustomDomain } from "@/lib/customDomain";
import { getStorefrontFallbackByDomain } from "@/lib/storefrontFallback";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const domain = normalizeCustomDomain(request.nextUrl.searchParams.get("domain") || "");
  if (!isValidCustomDomain(domain)) {
    return NextResponse.json({ error: "Domain tidak valid." }, { status: 400 });
  }

  const fallback = getStorefrontFallbackByDomain(domain);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return fallback
      ? NextResponse.json({ resellerId: fallback.reseller_id })
      : NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 503 });
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .rpc("get_reseller_by_custom_domain", { p_domain: domain })
    .maybeSingle();

  if (error) {
    console.error("Failed to resolve reseller storefront domain", error.message);
    return fallback
      ? NextResponse.json({ resellerId: fallback.reseller_id })
      : NextResponse.json({ error: "Katalog belum dapat dimuat." }, { status: 500 });
  }

  const tenant = data as { reseller_id?: string } | null;
  if (!tenant?.reseller_id) {
    return fallback
      ? NextResponse.json({ resellerId: fallback.reseller_id })
      : NextResponse.json({ error: "Katalog tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(
    { resellerId: tenant.reseller_id },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
