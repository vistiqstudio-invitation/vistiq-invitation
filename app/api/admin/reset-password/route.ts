import "server-only";

import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getSessionProfile } from "@/lib/supabase/dal";

const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generatePassword() {
  return Array.from({ length: 16 }, () => PASSWORD_ALPHABET[crypto.randomInt(PASSWORD_ALPHABET.length)]).join("");
}

// Sets a new password directly (bypassing the reset-email flow entirely),
// so the owner can hand it to a customer over WhatsApp when Supabase's
// transactional email fails or never arrives - the same pattern already
// used by /api/admin/create-reseller for initial account creation.
export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const profile = await getSessionProfile();
  if (!profile || profile.role !== "owner") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !PUBLIC_ANON_KEY) {
    return NextResponse.json({ error: "Env var belum diset di server." }, { status: 500 });
  }

  const body = await request.json();
  const userId = String(body.userId || "").trim();
  if (!userId) {
    return NextResponse.json({ error: "userId wajib diisi." }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const password = generatePassword();
  const { data: updated, error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });

  if (error || !updated.user) {
    return NextResponse.json({ error: error?.message || "Gagal mengubah password." }, { status: 400 });
  }

  // Verify with the same public Auth credentials that the login page uses.
  // Only return a temporary password when Supabase actually accepts it.
  const verifyClient = createServiceClient(SUPABASE_URL, PUBLIC_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: verified, error: verificationError } = await verifyClient.auth.signInWithPassword({
    email: updated.user.email || "",
    password,
  });

  if (verificationError || verified.user?.id !== updated.user.id) {
    return NextResponse.json(
      { error: "Password diubah, tetapi verifikasi login gagal. Hubungi admin sebelum mencoba reset lagi." },
      { status: 502 }
    );
  }

  await verifyClient.auth.signOut();
  return NextResponse.json({ email: updated.user.email, password });
}
