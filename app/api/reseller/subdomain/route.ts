import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { freeSubdomainHostname, normalizeSubdomain, validateSubdomain } from "@/lib/customDomain";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercelDomains";

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
    .select("id, package, brand_active, brand_expires_at, free_subdomain")
    .eq("user_id", profile.id)
    .maybeSingle();
  return data ? { supabase, reseller: data } : null;
}

function packageIsActive(reseller: { package?: string; brand_active?: boolean; brand_expires_at?: string | null }) {
  return reseller.package === "reseller_brand" && reseller.brand_active === true &&
    (!reseller.brand_expires_at || new Date(reseller.brand_expires_at).getTime() > Date.now());
}

function errorResponse(error: unknown) {
  console.error("free-subdomain:", error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Proses subdomain gagal." },
    { status: 400 }
  );
}

async function isAvailable(supabase: ReturnType<typeof adminClient>, subdomain: string, resellerId: string) {
  const { data } = await supabase
    .from("resellers")
    .select("id")
    .ilike("free_subdomain", subdomain)
    .neq("id", resellerId)
    .maybeSingle();
  return !data;
}

export async function POST(request: Request) {
  try {
    const context = await currentReseller();
    if (!context) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    if (!packageIsActive(context.reseller)) {
      return NextResponse.json({ error: "Subdomain gratis hanya tersedia untuk Reseller Brand yang aktif." }, { status: 403 });
    }

    const body = await request.json();
    const subdomain = normalizeSubdomain(String(body.subdomain || ""));
    const validationError = validateSubdomain(subdomain);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const available = await isAvailable(context.supabase, subdomain, context.reseller.id);
    if (!available) return NextResponse.json({ available: false, error: "Nama subdomain sudah digunakan." }, { status: 409 });
    if (body.action === "check") return NextResponse.json({ available: true, subdomain, hostname: freeSubdomainHostname(subdomain) });

    const oldSubdomain = context.reseller.free_subdomain;
    const hostname = freeSubdomainHostname(subdomain);
    if (oldSubdomain && oldSubdomain !== subdomain) {
      await removeDomainFromVercel(freeSubdomainHostname(oldSubdomain)).catch(() => undefined);
    }

    await addDomainToVercel(hostname);
    const { error } = await context.supabase.from("resellers").update({ free_subdomain: subdomain }).eq("id", context.reseller.id);
    if (error) {
      await removeDomainFromVercel(hostname).catch(() => undefined);
      throw error;
    }
    return NextResponse.json({ available: true, active: true, subdomain, hostname });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE() {
  try {
    const context = await currentReseller();
    if (!context) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    if (context.reseller.free_subdomain) {
      await removeDomainFromVercel(freeSubdomainHostname(context.reseller.free_subdomain)).catch(() => undefined);
    }
    const { error } = await context.supabase.from("resellers").update({ free_subdomain: null }).eq("id", context.reseller.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
