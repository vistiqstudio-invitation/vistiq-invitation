-- SECURITY FIX, part 2 of the platform audit (032 was part 1).
--
-- Auditing 032's own effect turned up something worse: a full sweep of
-- pg_policies (select tablename, policyname, cmd, qual from pg_policies
-- where schemaname = 'public' and qual = 'true') showed several tables
-- still carry OLDER policies - never defined in any file in this folder,
-- so presumably created by hand in the Supabase Table Editor UI before
-- this project adopted SQL migrations - that grant unconditional public
-- SELECT (`qual: true`). Postgres combines multiple permissive policies
-- for the same command with OR, so these kept overriding every
-- properly-scoped policy this project's migrations ever defined for the
-- same table, completely unnoticed:
--
--   clients      "public read clients"       - every client's name, email, whatsapp
--   resellers    "public read resellers"     - every reseller's name, whatsapp, commission_percent
--   transactions "public read transactions"  - every commission/sale record
--   rsvp_wishes  "Allow public read wishes"  - bypassed 032's own is_active scoping
--   rsvp_wishes  "public read rsvp wishes"   - same
--   rsvp         "read rsvp"                 - legacy/unused table, cleaned for completeness
--   wishes       "read wishes"               - legacy/unused table, cleaned for completeness
--   bank_accounts "read bank accounts"       - table has zero references in the app code,
--                                               appears to predate the current schema
--                                               (bank info now lives as columns on
--                                               invitations); dropping the policy is
--                                               harmless either way.
--   gallery      "read gallery"              - same as bank_accounts, zero code references,
--                                               predates gallery_1..6/gallery_photos columns
--                                               on invitations.
--
-- Every table below already has a correctly-scoped replacement policy
-- from an earlier migration (clients_select/resellers_select in 002,
-- transactions_select_reseller in 012, rsvp_wishes_select_public/
-- invitations_select_public as tightened by 032) - dropping these just
-- removes the unconditional-access policy riding alongside them.
--
-- Verified externally post-fix via raw REST calls with the anon key
-- (bypassing the JS SDK entirely) that bulk reads on clients/resellers/
-- transactions now return empty, an inactive invitation is no longer
-- readable, and an active invitation + its wishes still are.

drop policy if exists "read bank accounts" on public.bank_accounts;
drop policy if exists "public read clients" on public.clients;
drop policy if exists "read gallery" on public.gallery;
drop policy if exists "public read resellers" on public.resellers;
drop policy if exists "read rsvp" on public.rsvp;
drop policy if exists "Allow public read wishes" on public.rsvp_wishes;
drop policy if exists "public read rsvp wishes" on public.rsvp_wishes;
drop policy if exists "public read transactions" on public.transactions;
drop policy if exists "read wishes" on public.wishes;
