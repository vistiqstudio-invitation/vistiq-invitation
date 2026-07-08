-- EMERGENCY FIX: app_users is currently readable by anyone via the public
-- anon key (no RLS), leaking plaintext passwords for owner/reseller/client
-- accounts. Run this immediately in Supabase Dashboard > SQL Editor.

alter table public.app_users enable row level security;

-- Revoke the blanket access the anon/authenticated roles get by default.
revoke all on public.app_users from anon, authenticated;

-- No policies are created here on purpose: with RLS enabled and no policy,
-- PostgREST (anon key) can no longer read or write this table at all.
-- Only the service_role key (server-side only, never shipped to the client)
-- bypasses RLS. This buys time until auth is migrated to Supabase Auth
-- (see 002_profiles_and_auth_migration.sql).
