import "server-only";

import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/supabase/dal";

/**
 * Aktivasi manual reseller dinonaktifkan secara global.
 * Semua reseller mengaktifkan undangan melalui pembayaran Rp20.000 di
 * /api/reseller/invitation-activation. Endpoint lama dipertahankan agar
 * client/UI versi lama mendapat respons yang jelas, bukan mengaktifkan data.
 */
export async function POST() {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "reseller") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  return NextResponse.json(
    {
      error: "Aktivasi manual sudah tidak digunakan. Bayar Rp20.000 untuk mengaktifkan akun client dan undangannya secara otomatis.",
      activationFee: 20_000,
      paymentRequired: true,
    },
    { status: 409 },
  );
}
