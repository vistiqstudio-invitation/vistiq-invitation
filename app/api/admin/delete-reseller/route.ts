import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Env var belum diset di server." }, { status: 500 });
  }

  const body = await request.json();
  const resellerId = String(body.resellerId || "").trim();
  if (!resellerId) {
    return NextResponse.json({ error: "resellerId wajib diisi." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reseller, error: fetchError } = await supabaseAdmin
    .from("resellers")
    .select("user_id")
    .eq("id", resellerId)
    .maybeSingle();

  if (fetchError || !reseller) {
    return NextResponse.json({ error: "Reseller tidak ditemukan." }, { status: 404 });
  }

  // Refuse to orphan real business data - a reseller with existing clients
  // must be reassigned/cleaned up first rather than silently cascading.
  const { count } = await supabaseAdmin
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("reseller_id", resellerId);

  if (count && count > 0) {
    return NextResponse.json(
      { error: `Reseller ini masih punya ${count} client terdaftar - pindahkan atau hapus client-nya dulu sebelum hapus akun reseller.` },
      { status: 409 },
    );
  }

  const { error: deleteError } = await supabaseAdmin.from("resellers").delete().eq("id", resellerId);
  if (deleteError) {
    return NextResponse.json({ error: "Gagal menghapus data reseller." }, { status: 500 });
  }

  if (reseller.user_id) {
    await supabaseAdmin.auth.admin.deleteUser(reseller.user_id);
  }

  return NextResponse.json({ success: true });
}
