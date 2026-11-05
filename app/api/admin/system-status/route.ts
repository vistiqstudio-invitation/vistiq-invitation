import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paymentConfigurationStatus } from "@/lib/paymentConfiguration";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await createClient();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "owner") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    const mediaKeys = ["R2_ACCOUNT_ID", "R2_BUCKET_NAME", "R2_PUBLIC_URL", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"];
    const missingMedia = mediaKeys.filter((key) => !process.env[key]?.trim());
    const payment = paymentConfigurationStatus();
    // Only configuration presence is returned, never values or credentials.
    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      payment,
      adminServer: { configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) },
      media: { configured: missingMedia.length === 0, missing: missingMedia },
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Status konfigurasi belum dapat diperiksa." }, { status: 503 });
  }
}
