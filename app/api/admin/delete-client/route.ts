import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });
  }

  const body = await request.json();
  const clientId = String(body.clientId || "").trim();
  if (!clientId) {
    return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: client, error: fetchError } = await supabaseAdmin
    .from("clients")
    .select("id, user_id, name")
    .eq("id", clientId)
    .maybeSingle();

  if (fetchError || !client) {
    return NextResponse.json({ error: "Client tidak ditemukan." }, { status: 404 });
  }

  // Invitations are client-owned content and must not become orphaned owner
  // invitations when the client row is removed (the FK otherwise uses SET NULL).
  const { error: invitationsError } = await supabaseAdmin
    .from("invitations")
    .delete()
    .eq("client_id", clientId);

  if (invitationsError) {
    return NextResponse.json(
      { error: "Gagal menghapus undangan milik client." },
      { status: 500 }
    );
  }

  const { error: clientError } = await supabaseAdmin
    .from("clients")
    .delete()
    .eq("id", clientId);

  if (clientError) {
    return NextResponse.json({ error: "Gagal menghapus data client." }, { status: 500 });
  }

  if (client.user_id) {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(client.user_id);
    if (authError) {
      console.error("delete-client auth cleanup:", authError);
      return NextResponse.json(
        { error: "Data client terhapus, tetapi akun login gagal dibersihkan. Hubungi pengelola sistem." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
