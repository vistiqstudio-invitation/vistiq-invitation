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
  if (context.error === "forbidden") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  if (!context.client) return NextResponse.json({ error: "Env var server belum diset." }, { status: 500 });

  const [{ data: resellers, error: resellerError }, { data: authData, error: authError }] = await Promise.all([
    context.client.from("resellers").select("*").order("created_at", { ascending: false }),
    context.client.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  if (resellerError || authError) {
    return NextResponse.json({ error: resellerError?.message || authError?.message || "Gagal memuat reseller." }, { status: 500 });
  }

  const emailByUserId = new Map(authData.users.map((user) => [user.id, user.email || ""]));
  return NextResponse.json({
    resellers: (resellers ?? []).map((reseller) => ({ ...reseller, email: emailByUserId.get(reseller.user_id) || "" })),
  });
}

export async function PATCH(request: Request) {
  try {
    const context = await ownerAdminClient();
    if (context.error === "forbidden") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    if (!context.client) return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });

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

    if (!resellerId || !name || !email) return NextResponse.json({ error: "Nama dan email reseller wajib diisi." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });

    const { data: reseller, error: resellerError } = await context.client
      .from("resellers")
      .select("id, user_id, name, whatsapp, brand_name")
      .eq("id", resellerId)
      .single();

    if (resellerError || !reseller?.user_id) return NextResponse.json({ error: "Data reseller tidak ditemukan." }, { status: 404 });

    const { data: authData, error: authReadError } = await context.client.auth.admin.getUserById(reseller.user_id);
    if (authReadError || !authData?.user) {
      console.error("reseller_edit_auth_read_failed", authReadError);
      return NextResponse.json({ error: "Akun login reseller tidak ditemukan atau gagal dibaca." }, { status: 500 });
    }

    const previousEmail = authData.user.email || "";
    const oldName = reseller.name || "";
    const oldWhatsapp = reseller.whatsapp || "";
    const oldBrandName = reseller.brand_name ?? null;
    const emailChanged = email !== previousEmail.toLowerCase();

    // Owner changes the login email administratively, so confirm it immediately.
    // This avoids leaving the reseller in a pending-email state and keeps the
    // email used by Auth/login in sync with the owner dashboard.
    if (emailChanged) {
      const { error: authUpdateError } = await context.client.auth.admin.updateUserById(
        reseller.user_id,
        { email, email_confirm: true },
      );

      if (authUpdateError) {
        console.error("reseller_edit_auth_update_failed", authUpdateError);
        const message = authUpdateError.message || "";
        const duplicate = /already|registered|exists|duplicate|unique/i.test(message);
        return NextResponse.json(
          { error: duplicate ? "Email tersebut sudah digunakan akun lain." : `Gagal mengubah email login reseller: ${message || "server auth menolak perubahan email."}` },
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
      if (emailChanged) await context.client.auth.admin.updateUserById(reseller.user_id, { email: previousEmail, email_confirm: true });
      return NextResponse.json({ error: "Gagal menyimpan data reseller. Perubahan email dibatalkan." }, { status: 500 });
    }

    const { error: profileError } = await context.client
      .from("profiles")
      .update({ name, whatsapp })
      .eq("id", reseller.user_id);

    if (profileError) {
      console.error("reseller_edit_profile_update_failed", profileError);
      await context.client.from("resellers").update({ name: oldName, whatsapp: oldWhatsapp, brand_name: oldBrandName }).eq("id", resellerId);
      if (emailChanged) await context.client.auth.admin.updateUserById(reseller.user_id, { email: previousEmail, email_confirm: true });
      return NextResponse.json({ error: "Gagal menyinkronkan profil reseller. Semua perubahan dibatalkan." }, { status: 500 });
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("reseller_edit_unexpected_error", error);
    return NextResponse.json({ error: "Terjadi gangguan saat menyimpan. Silakan coba lagi atau hubungi admin teknis." }, { status: 500 });
  }
}
