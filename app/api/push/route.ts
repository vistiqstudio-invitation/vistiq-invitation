import "server-only";

import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/supabase/dal";
import { pushAdmin, pushConfigured, validPushEndpoint, validPushKey } from "@/lib/webPush";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await getSessionProfile();
    if (!profile || !["owner", "reseller"].includes(profile.role)) return NextResponse.json({ error: "Silakan login sebagai owner atau reseller." }, { status: 403 });
    if (!pushConfigured()) return NextResponse.json({ error: "Notifikasi HP belum siap." }, { status: 503 });
    const { data, error } = await pushAdmin().from("web_push_subscriptions").select("endpoint").eq("user_id", profile.id);
    if (error) throw error;
    return NextResponse.json({ publicKey: process.env.WEB_PUSH_PUBLIC_KEY, endpoints: (data ?? []).map((row) => row.endpoint) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Gagal memuat pengaturan notifikasi HP." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const profile = await getSessionProfile();
    if (!profile || !["owner", "reseller"].includes(profile.role)) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 403 });
    if (!pushConfigured()) return NextResponse.json({ error: "Notifikasi HP belum siap." }, { status: 503 });
    const body = await request.json().catch(() => null);
    const endpoint = body?.subscription?.endpoint ?? body?.endpoint;
    if (!validPushEndpoint(endpoint)) return NextResponse.json({ error: "Perangkat notifikasi tidak valid atau browser belum didukung." }, { status: 400 });
    const admin = pushAdmin();
    if (body.action === "test") {
      const { data: subscription } = await admin.from("web_push_subscriptions").select("endpoint").eq("endpoint", endpoint).eq("user_id", profile.id).maybeSingle();
      if (!subscription) return NextResponse.json({ error: "Aktifkan notifikasi HP terlebih dahulu." }, { status: 404 });
      const { data: recent } = await admin.from("web_push_jobs").select("id").eq("endpoint", endpoint).like("event_key", "test:%").gte("created_at", new Date(Date.now() - 60_000).toISOString()).limit(1);
      if (recent?.length) return NextResponse.json({ error: "Tunggu satu menit sebelum mengirim percobaan lagi." }, { status: 429 });
      const background = body.background === true;
      const { error } = await admin.from("web_push_jobs").insert({ endpoint, user_id: profile.id, recipient_role: profile.role, event_key: `test:${crypto.randomUUID()}`, title: background ? "Tes notifikasi saat aplikasi ditutup" : "Notifikasi HP aktif", body: "Perangkat ini siap menerima notifikasi meski aplikasi ditutup atau sudah logout.", url: profile.role === "owner" ? "/admin" : "/reseller", available_at: new Date(Date.now() + (background ? 20_000 : 0)).toISOString() });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    const keys = body?.subscription?.keys;
    if (!validPushKey(keys?.p256dh, 65) || !validPushKey(keys?.auth, 16)) return NextResponse.json({ error: "Kunci notifikasi perangkat tidak valid." }, { status: 400 });
    const { count } = await admin.from("web_push_subscriptions").select("endpoint", { count: "exact", head: true }).eq("user_id", profile.id).neq("endpoint", endpoint);
    if ((count ?? 0) >= 10) return NextResponse.json({ error: "Maksimal 10 perangkat per akun." }, { status: 409 });
    const { error } = await admin.from("web_push_subscriptions").upsert({ endpoint, user_id: profile.id, p256dh: keys.p256dh, auth: keys.auth, updated_at: new Date().toISOString() }, { onConflict: "endpoint" });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Gagal menyimpan notifikasi HP. Silakan coba lagi." }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const profile = await getSessionProfile();
    if (!profile) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 403 });
    const body = await request.json().catch(() => null);
    if (!validPushEndpoint(body?.endpoint)) return NextResponse.json({ error: "Perangkat tidak valid." }, { status: 400 });
    const { error } = await pushAdmin().from("web_push_subscriptions").delete().eq("endpoint", body.endpoint).eq("user_id", profile.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Gagal menonaktifkan notifikasi HP." }, { status: 500 }); }
}
