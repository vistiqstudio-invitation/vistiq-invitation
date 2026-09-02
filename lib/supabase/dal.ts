import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "owner" | "reseller" | "client" | "affiliate";

export type SessionProfile = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  whatsapp: string | null;
};

const LOGIN_PATH = "/login";

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, whatsapp")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile.role as UserRole,
    name: profile.name,
    whatsapp: profile.whatsapp,
  };
}

export async function requireRole(
  allowedRoles: UserRole[]
): Promise<SessionProfile> {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect(LOGIN_PATH);
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect(LOGIN_PATH);
  }

  return profile;
}

/**
 * Client dashboards are released only after the Owner activates the client.
 * Resellers use their own dashboard to edit and preview drafts before payment.
 */
export async function requireActiveClient(): Promise<SessionProfile> {
  const profile = await requireRole(["client"]);
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("status")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (client?.status !== "active") {
    redirect("/login?client=pending");
  }

  return profile;
}
