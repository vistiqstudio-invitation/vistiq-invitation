import { NextResponse } from "next/server";
import { putR2Object } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = `health/r2-${Date.now()}.txt`;
  try {
    const publicUrl = await putR2Object(key, Buffer.from("vistiq-r2-ok"), "text/plain");
    const check = await fetch(publicUrl, { cache: "no-store" });
    const body = await check.text();
    if (!check.ok || body !== "vistiq-r2-ok") {
      return NextResponse.json({ ok: false, publicUrl, status: check.status }, { status: 502 });
    }
    return NextResponse.json({ ok: true, publicUrl });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "R2 test failed" }, { status: 500 });
  }
}
