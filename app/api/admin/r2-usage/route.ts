import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getR2StorageUsage } from "@/lib/r2Stats";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "owner") {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
    }

    const usage = await getR2StorageUsage();
    return NextResponse.json({ ok: true, ...usage });
  } catch (error) {
    console.error("r2-usage:", error);
    return NextResponse.json({ error: "Gagal membaca penggunaan Cloudflare R2." }, { status: 500 });
  }
}
