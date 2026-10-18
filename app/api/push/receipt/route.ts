import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { pushAdmin } from "@/lib/webPush";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.WEB_PUSH_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id) || typeof body?.proof !== "string" || !/^[a-f0-9]{64}$/.test(body.proof) || !["shown", "failed"].includes(body?.outcome)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const expected = createHmac("sha256", secret).update(`push-receipt:${body.id}`).digest();
  if (!timingSafeEqual(expected, Buffer.from(body.proof, "hex"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // This signed, single-job receipt works after logout and grants no account access.
    const now = new Date().toISOString();
    const update = body.outcome === "shown"
      ? { device_received_at: now, device_displayed_at: now, device_error: null }
      : { device_received_at: now, device_error: typeof body.error === "string" ? body.error.slice(0, 80) : "Notification display failed" };
    const { error } = await pushAdmin().from("web_push_jobs").update(update).eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Receipt unavailable" }, { status: 500 }); }
}
