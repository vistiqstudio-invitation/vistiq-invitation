-- The client's login email only ever lived in auth.users (linked via
-- clients.user_id), which a reseller's session can't read directly (auth
-- schema isn't exposed via the REST API). The new reseller "Daftar Client"
-- page needs to show each client's email without a service-role lookup, so
-- store it directly on the row going forward and backfill existing rows.

alter table public.clients add column if not exists email text;

update public.clients c
set email = u.email
from auth.users u
where c.user_id = u.id
  and c.email is null;
