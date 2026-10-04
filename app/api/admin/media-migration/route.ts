import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "owner") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ ok: true, message: "Media migration control is ready." });
}