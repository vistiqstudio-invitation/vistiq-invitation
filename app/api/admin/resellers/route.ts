import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createServiceClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function ownerAdminClient() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") return { error: "forbidden" as const, client: null };

  const client = getAdminClient();
  if (!client) return { error: "config" as const, client: null };
  return { error: null, client };
}

export async function GET() {
  const context = await ownerAdminClient();
  if (context.error === "forbidden") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }
  if (!context.client) {
    return NextResponse.json({ error: "Env var server belum diset." }, { status: 500 });
  }

  const [{ data: resellers, error: resellerError }, { data: authData, error: authError }] =
    await Promise.all([
      context.client.from("resellers").select("*").order("created_at", { ascending: false }),
      context.client.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

  if (resellerError || authError) {
    return NextResponse.json(
      { error: resellerError?.message || authError?.message || "Gagal memuat reseller." },
      { status: 500 },
    );
  }

  const emailByUserId = new Map(authData.users.map((user) => [user.id, user.email || ""]));
  return NextResponse.json({
    resellers: (resellers ?? []).map((reseller) => ({
      ...reseller,
      email: emailByUserId.get(reseller.user_id) || "",
    })),
  });
}

export async function PATCH(request: Request) {
  try {
    const context = await ownerAdminClient();
    if (context.error === "forbidden") {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    }
    if (!context.client) {
      return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data permintaan tidak valid." }, { status: 400 });
    }

    const resellerId = String(body.resellerId || "").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const whatsapp = String(body.whatsapp || "").trim();
    const brandName = String(body.brand_name || "").trim() || null;

    if (!resellerId || !name || !email) {
      return NextResponse.json({ error: "Nama dan email reseller wajib diisi." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const { data: reseller, error: resellerError } = await context.client
      .from("resellers")
      .select("id, user_id, name, whatsapp, brand_name")
      .eq("id", resellerId)
      .single();

    if (resellerError || !reseller?.user_id) {
      return NextResponse.json({ error: "Data reseller tidak ditemukan." }, { status: 404 });
    }

    const { data: authData, error: authReadError } =
      await context.client.auth.admin.getUserById(reseller.user_id);
    if (authReadError || !authData?.user) {
      console.error("reseller_edit_auth_read_failed", authReadError);
      return NextResponse.json({ error: "Akun login reseller tidak ditemukan atau gagal dibaca." }, { status: 500 });
    }

    const previousEmail = authData.user.email || "";
    const previousMetadata = authData.user.user_metadata || {};
    const oldName = reseller.name || "";
    const oldWhatsapp = reseller.whatsapp || "";
    const oldBrandName = reseller.brand_name ?? null;
    const emailChanged = email !== previousEmail.toLowerCase();

    // Name and WhatsApp live in public.resellers + public.profiles.
    // Do not touch Supabase Auth metadata for those ordinary edits: Auth can
    // intermittently return a retryable 500 even though the public profile is healthy.
    // The Auth admin API is required only when the login email itself changes.
    if (emailChanged) {
      let authUpdateError: { message?: string } | null = null;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const result = await context.client.auth.admin.updateUserById(
          reseller.user_id,
          { email },
        );
        authUpdateError = result.error;
        if (!authUpdateError) break;
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }

      if (authUpdateError) {
        console.error("reseller_edit_auth_update_failed", authUpdateError);
        const message = typeof authUpdateError.message === "string" ? authUpdateError.message : "";
        const duplicate = /already|registered|exists|duplicate|unique/i.test(message);
        return NextResponse.json(
          { error: duplicate ? "Email tersebut sudah digunakan akun lain." : "Gagal mengubah email login reseller. Silakan coba lagi." },
          { status: 400 },
        );
      }
    }

    const { error: updateError } = await context.client
      .from("resellers")
      .update({ name, whatsapp, brand_name: brandName })
      .eq("id", resellerId);

    if (updateError) {
      console.error("reseller_edit_reseller_update_failed", updateError);
      if (emailChanged) {
        const { error: rollbackError } = await context.client.auth.admin.updateUserById(
          reseller.user_id,
          {
            ...(emailChanged ? { email: previousEmail, email_confirm: true } : {}),
            user_metadata: previousMetadata,
          },
        );
        if (rollbackError) console.error("reseller_edit_auth_rollback_failed", rollbackError);
      }
      return NextResponse.json({ error: "Gagal menyimpan data reseller. Tidak ada perubahan yang berhasil disimpan." }, { status: 500 });
    }

    // Dashboard greeting uses public.profiles, while the list uses resellers;
    // keep both in sync after an owner edits the reseller.
    const { error: profileError } = await context.client
      .from("profiles")
      .update({ name, whatsapp })
      .eq("id", reseller.user_id);
    if (profileError) {
      console.error("reseller_edit_profile_update_failed", profileError);
      // Do not falsely claim that everything succeeded if the profile update fails.
      await context.client.from("resellers").update({
        name: oldName, whatsapp: oldWhatsapp, brand_name: oldBrandName,
      }).eq("id", resellerId);
      if (emailChanged) {
        const { error: rollbackError } = await context.client.auth.admin.updateUserById(
          reseller.user_id,
          {
            ...(emailChanged ? { email: previousEmail, email_confirm: true } : {}),
            user_metadata: previousMetadata,
          },
        );
        if (rollbackError) console.error("reseller_edit_auth_rollback_failed", rollbackError);
      }
      return NextResponse.json({ error: "Gagal menyinkronkan profil reseller. Silakan coba lagi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("reseller_edit_unexpected_error", error);
    return NextResponse.json(
      { error: "Terjadi gangguan saat menyimpan. Silakan coba lagi atau hubungi admin teknis." },
      { status: 500 },
    );
  }
}
