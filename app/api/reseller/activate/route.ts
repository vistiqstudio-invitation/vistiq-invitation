import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

type ActivationTarget = "client" | "invitation";

function isBrandAccessActive(reseller: {
  package?: string | null;
  status?: string | null;
  brand_active?: boolean | null;
  brand_expires_at?: string | null;
}) {
  const brandNotExpired =
    !reseller.brand_expires_at || new Date(reseller.brand_expires_at).getTime() > Date.now();

  return reseller.package === "reseller_brand"
    && reseller.status === "active"
    && reseller.brand_active === true
    && brandNotExpired;
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "reseller") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });
  }

  const body = (await request.json()) as {
    target?: ActivationTarget;
    id?: string | number;
    status?: "active" | "inactive";
  };
  const target = body.target;
  const id = String(body.id ?? "").trim();

  if ((target !== "client" && target !== "invitation") || !id) {
    return NextResponse.json({ error: "Permintaan aktivasi tidak valid." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reseller, error: resellerError } = await supabaseAdmin
    .from("resellers")
    .select("id, package, status, brand_active, brand_expires_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (resellerError || !reseller) {
    return NextResponse.json({ error: "Akun reseller belum terhubung." }, { status: 403 });
  }

  if (!isBrandAccessActive(reseller)) {
    return NextResponse.json(
      { error: "Aktivasi mandiri hanya tersedia untuk Mitra Brand yang aktif." },
      { status: 403 },
    );
  }

  if (target === "client") {
    if (body.status && body.status !== "active" && body.status !== "inactive") {
      return NextResponse.json({ error: "Status client tidak valid." }, { status: 400 });
    }

    const nextStatus = body.status ?? "active";
    const { data: ownedClient } = await supabaseAdmin
      .from("clients")
      .select("id, status")
      .eq("id", id)
      .eq("reseller_id", reseller.id)
      .maybeSingle();

    if (!ownedClient) {
      return NextResponse.json({ error: "Client tidak ditemukan." }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("clients")
      .update({ status: nextStatus })
      .eq("id", ownedClient.id)
      .eq("reseller_id", reseller.id);

    if (error) {
      return NextResponse.json({ error: "Gagal mengubah status akun client." }, { status: 500 });
    }

    let invitationsActivated = 0;
    if (nextStatus === "active") {
      const { data: activatedInvitations, error: invitationError } = await supabaseAdmin
        .from("invitations")
        .update({ is_active: true })
        .eq("client_id", ownedClient.id)
        .select("id");

      if (invitationError) {
        const { error: rollbackError } = await supabaseAdmin
          .from("clients")
          .update({ status: ownedClient.status })
          .eq("id", ownedClient.id)
          .eq("reseller_id", reseller.id);

        if (rollbackError) {
          console.error("reseller client activation rollback failed", {
            clientId: ownedClient.id,
            error: rollbackError.message,
          });
        }

        return NextResponse.json(
          { error: "Akun client belum diaktifkan karena undangannya gagal diaktifkan." },
          { status: 500 },
        );
      }

      invitationsActivated = activatedInvitations?.length ?? 0;
    }

    return NextResponse.json({
      success: true,
      target,
      status: nextStatus,
      invitationsActivated,
    });
  }

  const invitationId = Number(id);
  if (!Number.isSafeInteger(invitationId) || invitationId <= 0) {
    return NextResponse.json({ error: "ID undangan tidak valid." }, { status: 400 });
  }

  const { data: invitation } = await supabaseAdmin
    .from("invitations")
    .select("id, client_id")
    .eq("id", invitationId)
    .maybeSingle();

  if (!invitation?.client_id) {
    return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  }

  const { data: ownedClient } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("id", invitation.client_id)
    .eq("reseller_id", reseller.id)
    .maybeSingle();

  if (!ownedClient) {
    return NextResponse.json({ error: "Undangan bukan milik reseller ini." }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("invitations")
    .update({ is_active: true })
    .eq("id", invitation.id)
    .eq("client_id", ownedClient.id);

  if (error) {
    return NextResponse.json({ error: "Gagal mengaktifkan undangan." }, { status: 500 });
  }

  return NextResponse.json({ success: true, target });
}
