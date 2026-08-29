import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSessionProfile } from "@/lib/supabase/dal";
import { createManualPackageOrder } from "@/lib/createManualPackageOrder";
import type { ManualResellerPackage } from "@/lib/createManualPackageOrder";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Konfigurasi database server belum tersedia." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data order tidak valid." }, { status: 400 });
  }

  const resellerId = typeof body.resellerId === "string" ? body.resellerId.trim() : "";
  if (!isUuid(resellerId)) {
    return NextResponse.json({ error: "Reseller tidak valid." }, { status: 400 });
  }

  const rawAmount = body.amount;
  const amount = typeof rawAmount === "number" ? rawAmount : Number(rawAmount);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "Nominal pembayaran harus berupa angka bulat lebih dari 0." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reseller, error: resellerError } = await supabaseAdmin
    .from("resellers")
    .select("id, user_id, name, whatsapp, package")
    .eq("id", resellerId)
    .maybeSingle();

  if (resellerError || !reseller) {
    return NextResponse.json({ error: "Data reseller tidak ditemukan." }, { status: 404 });
  }

  const resellerPackage = reseller.package === "reseller_brand" ? "reseller_brand" : reseller.package === "reseller" ? "reseller" : null;
  if (!resellerPackage) {
    return NextResponse.json({ error: "Paket reseller tidak valid." }, { status: 400 });
  }

  let email = "";
  if (reseller.user_id) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(reseller.user_id);
    email = authUser.user?.email ?? "";
  }

  try {
    const { orderId } = await createManualPackageOrder(supabaseAdmin, {
      resellerId: reseller.id,
      package: resellerPackage as ManualResellerPackage,
      name: reseller.name,
      email,
      whatsapp: reseller.whatsapp ?? "",
      amount,
    });

    return NextResponse.json({ orderId });
  } catch (orderError) {
    const message = orderError instanceof Error ? orderError.message : "Order paket manual gagal dibuat.";
    const status = message.includes("masih memiliki order") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
