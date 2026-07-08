// Run once, after supabase/sql/003_fix_user_id_foreign_keys.sql, to finish
// what migrate-legacy-users.mjs couldn't: point clients.user_id /
// resellers.user_id at the new Supabase Auth UUIDs (looked up by email,
// since the accounts already exist in auth.users at this point).
//
//   node --env-file=.env.local scripts/repoint-legacy-user-ids.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const links = [
  { email: "reseller@demo.com", table: "resellers" },
  { email: "client@demo.com", table: "clients" },
];

async function main() {
  const { data: userList, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Failed to list auth users:", listError.message);
    process.exit(1);
  }

  for (const link of links) {
    const user = userList.users.find((u) => u.email === link.email);

    if (!user) {
      console.error(`No auth user found for ${link.email}`);
      continue;
    }

    const { data: rows, error: rowsError } = await supabase
      .from(link.table)
      .select("id, user_id");

    if (rowsError) {
      console.error(`Failed to read ${link.table}:`, rowsError.message);
      continue;
    }

    const staleRow = rows.find((r) => r.user_id !== user.id);

    if (!staleRow) {
      console.log(`${link.table}: nothing to repoint (already linked).`);
      continue;
    }

    const { error: updateError } = await supabase
      .from(link.table)
      .update({ user_id: user.id })
      .eq("id", staleRow.id);

    if (updateError) {
      console.error(`Failed to repoint ${link.table}:`, updateError.message);
    } else {
      console.log(`${link.table}: repointed row ${staleRow.id} -> ${user.id}`);
    }
  }
}

main();
