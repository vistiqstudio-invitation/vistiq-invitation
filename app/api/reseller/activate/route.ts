import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";

type ActivationTarget = "client" | "invitation";

function isBrandAccessActive(reseller: { package?: string | null; status?: string | null; brand_active?: boolean | null }) {
  return reseller.package === "reseller_brand" && reseller.status === "active" && reseller.brand_active === true;
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "reseller") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });

  const body = (await request.json()) as { target?: ActivationTarget; id?: string | number; status?: "active" | "inactive" };
  const target = body.target;
  const id = String(body.id ?? "").trim();
  if ((target !== "client" && target !== "invitation") || !id) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });

  const db = createServiceClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: reseller } = await db.from("resellers").select("id, package, status, brand_active").eq("user_id", profile.id).maybeSingle();
  if (!reseller || !isBrandAccessActive(reseller)) return NextResponse.json({ error: "Akses ini hanya tersedia untuk akun Mitra Brand lama yang aktif." }, { status: 403 });

  if (target === "client") {
    const nextStatus = body.status ?? "active";
    if (nextStatus !== "active" && nextStatus !== "inactive") return NextResponse.json({ error: "Status client tidak valid." }, { status: 400 });
    const { data: ownedClient } = await db.from("clients").select("id, status").eq("id", id).eq("reseller_id", reseller.id).maybeSingle();
    if (!ownedClient) return NextResponse.json({ error: "Client tidak ditemukan." }, { status: 404 });
    const { data: updatedClient, error } = await db.from("clients").update({ status: nextStatus }).eq("id", ownedClient.id).eq("reseller_id", reseller.id).select("id, status").maybeSingle();
    if (error || !updatedClient) return NextResponse.json({ error: "Status akun client gagal disimpan." }, { status: 500 });
    return NextResponse.json({ success: true, target, status: nextStatus });
  }

  return NextResponse.json(
    { error: "Undangan dipublikasikan setelah biaya layanan Rp20.000 berhasil dibayar melalui Midtrans." },
    { status: 409 },
  );
}
