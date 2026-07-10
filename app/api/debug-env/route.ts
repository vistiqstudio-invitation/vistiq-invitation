import "server-only";

import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/supabase/dal";

// Temporary diagnostic route - owner-only, doesn't expose secret values,
// just enough shape info to tell whether SUPABASE_SERVICE_ROLE_KEY is
// actually reaching this server at runtime. Safe to delete once the env
// var issue is resolved.
export async function GET() {
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const relevantKeys = Object.keys(process.env)
    .filter((k) => k.includes("SUPABASE"))
    .sort();

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV || null,
    supabaseRelatedKeysPresent: relevantKeys,
    serviceRoleKey: {
      present: Boolean(serviceKey),
      length: serviceKey ? serviceKey.length : 0,
      looksLikeJwt: serviceKey ? serviceKey.startsWith("eyJ") : false,
    },
  });
}
