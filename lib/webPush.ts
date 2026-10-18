import "server-only";

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export function pushAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Konfigurasi notifikasi belum lengkap.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function pushConfigured() {
  return Boolean(process.env.WEB_PUSH_PUBLIC_KEY && process.env.WEB_PUSH_PRIVATE_KEY && process.env.WEB_PUSH_WEBHOOK_SECRET);
}

export function validPushEndpoint(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port
      && ["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com"].includes(url.hostname);
  } catch { return false; }
}

export function validPushKey(value: unknown, length: number) {
  return typeof value === "string" && /^[A-Za-z0-9_-]+$/.test(value) && Buffer.from(value, "base64url").length === length;
}

export async function deliverPush(endpoint: string, keys: { p256dh: string; auth: string }, payload: { title: string; body: string; url: string; tag: string; receipt?: { id: string; proof: string } }) {
  if (!validPushEndpoint(endpoint)) throw new Error("Invalid push provider");
  return webpush.sendNotification({ endpoint, keys }, JSON.stringify(payload), {
    TTL: 86400,
    urgency: "high",
    timeout: 5000,
    vapidDetails: {
      subject: "https://www.vistiqinvitation.com",
      publicKey: process.env.WEB_PUSH_PUBLIC_KEY!,
      privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
    },
  });
}
