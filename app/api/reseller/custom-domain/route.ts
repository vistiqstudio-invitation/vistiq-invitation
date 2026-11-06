import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { isValidCustomDomain, normalizeCustomDomain } from "@/lib/customDomain";
import { getCloudflareDomainStatus, registerCloudflareDomain } from "@/lib/cloudflareDomains";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Konfigurasi Supabase server belum lengkap.");
  return createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
async function currentReseller() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "reseller") return null;

  const supabase = adminClient();
  const { data } = await supabase
    .from("resellers")
    .select("id, package, brand_active, brand_expires_at, custom_domain")
    .eq("user_id", profile.id)
    .maybeSingle();
  return data ? { supabase, reseller: data } : null;
}

function packageHasDomainAccess(reseller: { package?: string; brand_active?: boolean; brand_expires_at?: string | null }) {
  if (reseller.package === "reseller") return true;
  return reseller.package === "reseller_brand" &&
    reseller.brand_active === true &&
    (!reseller.brand_expires_at || new Date(reseller.brand_expires_at).getTime() > Date.now());
}

function errorResponse(error: unknown) {
  console.error("custom-domain:", error);
  const message = error instanceof Error ? error.message : "Proses custom domain gagal.";
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  try {
    const context = await currentReseller();
    if (!context) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });

    const domain = context.reseller.custom_domain;
    if (!domain) return NextResponse.json({ domain: null, status: "not_configured" });

    const result = await getCloudflareDomainStatus(domain);
    const status = result.status;
    await context.supabase.from("resellers").update({
      custom_domain_status: status,
      custom_domain_verified_at: status === "active" ? new Date().toISOString() : null,
      custom_domain_error: null,
    }).eq("id", context.reseller.id);

    return NextResponse.json({ ...result, status });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await currentReseller();
    if (!context) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    if (!packageHasDomainAccess(context.reseller)) {
      return NextResponse.json({ error: "Custom domain tersedia untuk Reseller dan Mitra Brand yang aktif." }, { status: 403 });
    }

    const body = await request.json();
    const action = String(body.action || "add");

    if (action === "check") {
      if (!context.reseller.custom_domain) throw new Error("Belum ada domain yang disimpan.");
      const result = await registerCloudflareDomain(context.reseller.custom_domain);
      const status = result.status;
      await context.supabase.from("resellers").update({
        custom_domain_status: status,
        custom_domain_verified_at: status === "active" ? new Date().toISOString() : null,
        custom_domain_error: null,
      }).eq("id", context.reseller.id);
      return NextResponse.json({ ...result, status });
    }

    const domain = normalizeCustomDomain(String(body.domain || ""));
    if (!isValidCustomDomain(domain)) {
      return NextResponse.json({ error: "Masukkan domain yang valid, misalnya elovainvitation.com." }, { status: 400 });
    }

    const { data: owner } = await context.supabase
      .from("resellers")
      .select("id")
      .ilike("custom_domain", domain)
      .neq("id", context.reseller.id)
      .maybeSingle();
    if (owner) return NextResponse.json({ error: "Domain ini sudah digunakan oleh akun lain." }, { status: 409 });

    // Keep existing published URLs stable. Domain migration needs an explicit
    // separate cutover flow rather than silently replacing the active mapping.
    if (context.reseller.custom_domain && context.reseller.custom_domain !== domain) {
      return NextResponse.json({ error: "Domain lama masih terhubung. Hubungi admin untuk migrasi domain tanpa memutus link undangan." }, { status: 409 });
    }
    const result = await registerCloudflareDomain(domain);
    const status = result.status;
    const { error } = await context.supabase.from("resellers").update({
      custom_domain: domain,
      custom_domain_status: status,
      custom_domain_verified_at: status === "active" ? new Date().toISOString() : null,
      custom_domain_error: null,
    }).eq("id", context.reseller.id);
    if (error) {
      // The hostname may predate this request (e.g. manual Cloudflare setup).
      // Do not remove it on an unrelated database failure.
      throw error;
    }

    return NextResponse.json({ ...result, status });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE() {
  try {
    const context = await currentReseller();
    if (!context) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    // Delink only in our database. Deleting the Cloudflare hostname would
    // break already shared invitation URLs and must be handled by admin.
    const { error } = await context.supabase.from("resellers").update({
      custom_domain: null,
      custom_domain_status: "not_configured",
      custom_domain_verified_at: null,
      custom_domain_error: null,
    }).eq("id", context.reseller.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
