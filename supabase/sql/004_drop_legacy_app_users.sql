-- app_users held plaintext passwords and is fully superseded by
-- Supabase Auth + public.profiles. Nothing in the codebase reads it
-- anymore (confirmed via grep) and access has been locked since
-- 001_emergency_lockdown_app_users.sql. Safe to drop.

drop table if exists public.app_users;
