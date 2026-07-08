// One-off migration: recreates the legacy plaintext-password app_users rows
// as real Supabase Auth users, then repoints clients.user_id / resellers.user_id
// at the new auth UUIDs. Run once, locally, after applying
// supabase/sql/002_profiles_and_rls.sql.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (server-only secret,
// never prefixed with NEXT_PUBLIC_). Run with:
//   node --env-file=.env.local scripts/migrate-legacy-users.mjs

import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const legacyAccounts = [
  {
    oldId: "7fe31cf1-ed17-4321-bea4-3ed4abc76f11",
    email: "owner@vistiq.id",
    role: "owner",
    name: "Owner Vistiq",
    table: null,
  },
  {
    oldId: "7707dffd-7729-492e-97fb-1bef931ff0b6",
    email: "owner@vistiq.com",
    role: "owner",
    name: "Owner Vistiq (2)",
    table: null,
  },
  {
    oldId: "5752f345-80c6-4c90-8d4d-a3a3b2fcb4cb",
    email: "reseller@demo.com",
    role: "reseller",
    name: "Reseller Demo",
    table: "resellers",
  },
  {
    oldId: "c3cec2a3-8569-41fe-958e-5649e782c82e",
    email: "client@demo.com",
    role: "client",
    name: "Client Demo",
    table: "clients",
  },
];

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url");
}

async function main() {
  const results = [];

  for (const account of legacyAccounts) {
    const password = generatePassword();

    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password,
      email_confirm: true,
      user_metadata: { role: account.role, name: account.name },
    });

    if (error) {
      console.error(`Failed to create ${account.email}:`, error.message);
      continue;
    }

    const newId = data.user.id;

    if (account.table) {
      const { error: updateError } = await supabase
        .from(account.table)
        .update({ user_id: newId })
        .eq("user_id", account.oldId);

      if (updateError) {
        console.error(
          `Failed to repoint ${account.table}.user_id for ${account.email}:`,
          updateError.message
        );
      }
    }

    results.push({ email: account.email, role: account.role, password, newId });
  }

  console.log("\n=== New credentials (save these now, shown once) ===");
  for (const r of results) {
    console.log(`${r.role.padEnd(9)} ${r.email.padEnd(20)} ${r.password}`);
  }
  console.log(
    "\nNext: drop the old app_users table once you've confirmed login works with these credentials."
  );
}

main();
