import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET(request: NextRequest) {
  const invitationId = Number(request.nextUrl.searchParams.get("invitationId"));
  if (!Number.isInteger(invitationId) || invitationId <= 0) {
    return NextResponse.json({ error: "Undangan tidak valid." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvp")
    .select("id,guest_name,attendance,total_guest,message,created_at")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "Gagal memuat RSVP." }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Data RSVP tidak valid." }, { status: 400 }); }

  const invitationId = Number(body.invitationId);
  const guestName = clean(body.guestName, 120);
  const message = clean(body.message, 1000);
  const attendance = clean(body.attendance, 16);
  const totalGuest = Math.min(20, Math.max(1, Number(body.totalGuest) || 1));

  if (!Number.isInteger(invitationId) || invitationId <= 0 || !guestName || !message || !["hadir", "tidak"].includes(attendance)) {
    return NextResponse.json({ error: "Lengkapi nama, ucapan, dan konfirmasi kehadiran." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id,is_active")
    .eq("id", invitationId)
    .maybeSingle();

  if (invitationError || !invitation || invitation.is_active !== true) {
    return NextResponse.json({ error: "Undangan tidak aktif atau tidak ditemukan." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("rsvp")
    .insert({ invitation_id: invitationId, guest_name: guestName, attendance, total_guest: totalGuest, message })
    .select("id,guest_name,attendance,total_guest,message,created_at")
    .single();

  if (error) return NextResponse.json({ error: "RSVP gagal disimpan." }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
