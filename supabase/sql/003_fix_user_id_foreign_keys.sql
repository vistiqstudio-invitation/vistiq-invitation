-- resellers.user_id / clients.user_id currently have a foreign key pointing
-- at the legacy public.app_users table. Now that real accounts live in
-- auth.users (via Supabase Auth), repoint these FKs there so
-- migrate-legacy-users.mjs / repoint-legacy-user-ids.mjs can update user_id
-- to the new auth UUIDs.
--
-- `not valid` skips checking existing rows (which still hold the old
-- app_users ids) at creation time; they'll satisfy the constraint once
-- repoint-legacy-user-ids.mjs updates them.

alter table public.resellers drop constraint if exists resellers_user_id_fkey;
alter table public.resellers
  add constraint resellers_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null
  not valid;

alter table public.clients drop constraint if exists clients_user_id_fkey;
alter table public.clients
  add constraint clients_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null
  not valid;
