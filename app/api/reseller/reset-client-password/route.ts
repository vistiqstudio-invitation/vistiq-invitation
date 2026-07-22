import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

// Reseller-scoped equivalent of /api/admin/reset-password. A reseller may
// only reset a client's password if that client actually belongs to them
// (client.reseller_id must match the caller's own reseller row) - unlike
// the owner-only admin route, this takes a clientId rather than a raw
// userId precisely so that ownership check can happen server-side instead
// of trusting whatever id the client sent.
export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const profile = await getSessionProfile();
  if (!profile || profile.role !== "reseller") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Env var belum diset di server." }, { status: 500 });
  }

  const body = await request.json();
  const clientId = String(body.clientId || "").trim();
  if (!clientId) {
    return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reseller } = await supabaseAdmin
    .from("resellers")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!reseller) {
    return NextResponse.json({ error: "Akun reseller belum terhubung." }, { status: 400 });
  }

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, user_id, reseller_id")
    .eq("id", clientId)
    .maybeSingle();

  if (!client || client.reseller_id !== reseller.id) {
    return NextResponse.json({ error: "Client tidak ditemukan." }, { status: 404 });
  }

  if (!client.user_id) {
    return NextResponse.json({ error: "Client ini belum punya akun login." }, { status: 400 });
  }

  const password = generatePassword();
  const { data: updated, error } = await supabaseAdmin.auth.admin.updateUserById(client.user_id, { password });

  if (error || !updated.user) {
    return NextResponse.json({ error: error?.message || "Gagal mengubah password." }, { status: 400 });
  }

  return NextResponse.json({ email: updated.user.email, password });
}
