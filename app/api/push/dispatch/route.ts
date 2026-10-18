import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deliverPush, pushAdmin, pushConfigured } from "@/lib/webPush";

export const runtime = "nodejs";
export const maxDuration = 60;

type Job = { id: string; endpoint: string; user_id: string; recipient_role: string; event_key: string; title: string; body: string; url: string; attempts: number };

export async function POST(request: Request) {
  if (!pushConfigured()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const timestamp = Number(body?.timestamp);
  const nonce = body?.nonce;
  const signature = body?.signature;
  if (!Number.isSafeInteger(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 120 || typeof nonce !== "string" || !/^[0-9a-f-]{36}$/i.test(nonce) || typeof signature !== "string" || !/^[a-f0-9]{64}$/.test(signature)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const expected = createHmac("sha256", process.env.WEB_PUSH_WEBHOOK_SECRET!).update(`${nonce}:${timestamp}`).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const admin = pushAdmin();
    // Consume the signed wakeup once. No reusable secret travels through pg_net.
    const { data: wakeup, error: wakeError } = await admin.from("web_push_wakeups").delete().eq("nonce", nonce).gte("created_at", new Date(Date.now() - 120_000).toISOString()).select("nonce");
    if (wakeError) throw wakeError;
    if (!wakeup?.length) return NextResponse.json({ error: "Expired wakeup" }, { status: 401 });
    const { data, error } = await admin.rpc("claim_web_push_jobs", { p_limit: 10 });
    if (error) throw error;
    const jobs = (data ?? []) as Job[];
    for (let offset = 0; offset < jobs.length; offset += 5) {
      await Promise.all(jobs.slice(offset, offset + 5).map(async (job) => {
        const { data: subscription, error: subError } = await admin.from("web_push_subscriptions").select("user_id,p256dh,auth").eq("endpoint", job.endpoint).maybeSingle();
        let status = "sent";
        let lastError: string | null = null;
        try {
          if (subError) throw subError;
          if (!subscription) { await admin.from("web_push_jobs").delete().eq("id", job.id); return; }
          if (subscription.user_id !== job.user_id) { await admin.from("web_push_jobs").delete().eq("id", job.id); return; }
          const { data: profile } = await admin.from("profiles").select("role").eq("id", subscription.user_id).maybeSingle();
          if (!profile || profile.role !== job.recipient_role || !["owner", "reseller"].includes(profile.role)) { await admin.from("web_push_jobs").delete().eq("id", job.id); return; }
          if (profile.role === "reseller") {
            const { data: reseller } = await admin.from("resellers").select("status").eq("user_id", subscription.user_id).maybeSingle();
            if (reseller?.status !== "active") { await admin.from("web_push_jobs").delete().eq("id", job.id); return; }
          }
          const proof = createHmac("sha256", process.env.WEB_PUSH_WEBHOOK_SECRET!).update(`push-receipt:${job.id}`).digest("hex");
          await deliverPush(job.endpoint, { p256dh: subscription.p256dh, auth: subscription.auth }, { title: job.title, body: job.body, url: job.url, tag: job.event_key, receipt: { id: job.id, proof } });
        } catch (failure) {
          const code = Number((failure as { statusCode?: number })?.statusCode);
          if (code === 404 || code === 410) { await admin.from("web_push_subscriptions").delete().eq("endpoint", job.endpoint); return; }
          status = job.attempts >= 5 || (code >= 400 && code < 500 && code !== 429) ? "failed" : "pending";
          lastError = Number.isFinite(code) && code > 0 ? `Push provider HTTP ${code}` : "Push delivery temporarily unavailable";
        }
        const { error: finishError } = await admin.from("web_push_jobs").update({ status, last_error: lastError, available_at: new Date(Date.now() + 30_000 * 2 ** Math.min(job.attempts, 4)).toISOString() }).eq("id", job.id).eq("attempts", job.attempts).eq("status", "processing");
        if (finishError) console.error("web_push_job_finish_failed", job.id);
      }));
    }
    return NextResponse.json({ processed: jobs.length });
  } catch { console.error("web_push_dispatch_failed"); return NextResponse.json({ error: "Delivery queue unavailable" }, { status: 500 }); }
}
