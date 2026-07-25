import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Layanan belum tersedia." }, { status: 503 });

  const body = await request.json();
  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const whatsapp = clean(body.whatsapp, 30);
  const promotionChannel = clean(body.promotionChannel, 120);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || whatsapp.replace(/\D/g, "").length < 9) {
    return NextResponse.json({ error: "Nama, email, dan WhatsApp wajib diisi dengan benar." }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from("affiliate_applications").insert({
    name, email, whatsapp, promotion_channel: promotionChannel || null,
  });
  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "Email ini sudah pernah mendaftar. Silakan tunggu persetujuan Admin." : "Pendaftaran belum dapat disimpan." },
      { status: duplicate ? 409 : 500 },
    );
  }
  return NextResponse.json({ success: true });
}
