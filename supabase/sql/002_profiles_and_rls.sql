-- Sets up real role-based access control on top of Supabase Auth:
-- 1. `profiles` table links auth.users -> role (owner/reseller/client)
-- 2. Helper functions (security definer) so RLS policies can check the
--    caller's role/linked rows without recursive-RLS problems
-- 3. RLS policies on clients/resellers/invitations/wishes/rsvp/transactions
--
-- Run this in Supabase Dashboard > SQL Editor, after 001_emergency_lockdown.

-- ---------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'reseller', 'client')),
  name text,
  whatsapp text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- New auth users get a profile row automatically. Role/name/whatsapp are
-- passed in at signUp time via options.data (raw_user_meta_data).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'client'),
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'whatsapp'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. Helper functions used inside RLS policies below
-- ---------------------------------------------------------------------
create or replace function public.current_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.my_client_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.clients where user_id = auth.uid() limit 1;
$$;

create or replace function public.my_reseller_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.resellers where user_id = auth.uid() limit 1;
$$;

-- ---------------------------------------------------------------------
-- 3. resellers
-- ---------------------------------------------------------------------
alter table public.resellers enable row level security;

drop policy if exists "resellers_select" on public.resellers;
create policy "resellers_select"
  on public.resellers for select
  using (public.current_role() = 'owner' or user_id = auth.uid());

drop policy if exists "resellers_insert_owner" on public.resellers;
create policy "resellers_insert_owner"
  on public.resellers for insert
  with check (public.current_role() = 'owner');

drop policy if exists "resellers_update" on public.resellers;
create policy "resellers_update"
  on public.resellers for update
  using (public.current_role() = 'owner' or user_id = auth.uid())
  with check (public.current_role() = 'owner' or user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 4. clients
-- ---------------------------------------------------------------------
alter table public.clients enable row level security;

drop policy if exists "clients_select" on public.clients;
create policy "clients_select"
  on public.clients for select
  using (
    public.current_role() = 'owner'
    or user_id = auth.uid()
    or reseller_id = public.my_reseller_id()
  );

drop policy if exists "clients_insert" on public.clients;
create policy "clients_insert"
  on public.clients for insert
  with check (
    public.current_role() = 'owner'
    or reseller_id = public.my_reseller_id()
  );

drop policy if exists "clients_update" on public.clients;
create policy "clients_update"
  on public.clients for update
  using (
    public.current_role() = 'owner'
    or reseller_id = public.my_reseller_id()
    or user_id = auth.uid()
  )
  with check (
    public.current_role() = 'owner'
    or reseller_id = public.my_reseller_id()
    or user_id = auth.uid()
  );

-- ---------------------------------------------------------------------
-- 5. invitations (public wedding pages - readable by anyone via slug)
-- ---------------------------------------------------------------------
alter table public.invitations enable row level security;

drop policy if exists "invitations_select_public" on public.invitations;
create policy "invitations_select_public"
  on public.invitations for select
  using (true);

drop policy if exists "invitations_insert" on public.invitations;
create policy "invitations_insert"
  on public.invitations for insert
  with check (
    public.current_role() = 'owner'
    or client_id = public.my_client_id()
    or client_id in (
      select id from public.clients where reseller_id = public.my_reseller_id()
    )
  );

drop policy if exists "invitations_update" on public.invitations;
create policy "invitations_update"
  on public.invitations for update
  using (
    public.current_role() = 'owner'
    or client_id = public.my_client_id()
    or client_id in (
      select id from public.clients where reseller_id = public.my_reseller_id()
    )
  )
  with check (
    public.current_role() = 'owner'
    or client_id = public.my_client_id()
    or client_id in (
      select id from public.clients where reseller_id = public.my_reseller_id()
    )
  );

drop policy if exists "invitations_delete_owner" on public.invitations;
create policy "invitations_delete_owner"
  on public.invitations for delete
  using (public.current_role() = 'owner');

-- ---------------------------------------------------------------------
-- 6. wishes (public guestbook - anyone can read/post, no edit/delete)
-- ---------------------------------------------------------------------
alter table public.wishes enable row level security;

drop policy if exists "wishes_select_public" on public.wishes;
create policy "wishes_select_public"
  on public.wishes for select
  using (true);

drop policy if exists "wishes_insert_public" on public.wishes;
create policy "wishes_insert_public"
  on public.wishes for insert
  with check (true);

drop policy if exists "wishes_delete_owner" on public.wishes;
create policy "wishes_delete_owner"
  on public.wishes for delete
  using (public.current_role() = 'owner');

-- ---------------------------------------------------------------------
-- 7. rsvp (same public read/write shape as wishes)
-- ---------------------------------------------------------------------
alter table public.rsvp enable row level security;

drop policy if exists "rsvp_select_public" on public.rsvp;
create policy "rsvp_select_public"
  on public.rsvp for select
  using (true);

drop policy if exists "rsvp_insert_public" on public.rsvp;
create policy "rsvp_insert_public"
  on public.rsvp for insert
  with check (true);

drop policy if exists "rsvp_delete_owner" on public.rsvp;
create policy "rsvp_delete_owner"
  on public.rsvp for delete
  using (public.current_role() = 'owner');

-- ---------------------------------------------------------------------
-- 7b. rsvp_wishes (the table actually read by the admin/client dashboards -
--     kept alongside rsvp/wishes above since both exist in this database;
--     unifying them is a data-model cleanup for later, not a security fix)
-- ---------------------------------------------------------------------
alter table public.rsvp_wishes enable row level security;

drop policy if exists "rsvp_wishes_select_public" on public.rsvp_wishes;
create policy "rsvp_wishes_select_public"
  on public.rsvp_wishes for select
  using (true);

drop policy if exists "rsvp_wishes_insert_public" on public.rsvp_wishes;
create policy "rsvp_wishes_insert_public"
  on public.rsvp_wishes for insert
  with check (true);

drop policy if exists "rsvp_wishes_delete_owner" on public.rsvp_wishes;
create policy "rsvp_wishes_delete_owner"
  on public.rsvp_wishes for delete
  using (public.current_role() = 'owner');

-- ---------------------------------------------------------------------
-- 8. transactions (financial ledger - owner only for now)
-- ---------------------------------------------------------------------
alter table public.transactions enable row level security;

drop policy if exists "transactions_owner_all" on public.transactions;
create policy "transactions_owner_all"
  on public.transactions for all
  using (public.current_role() = 'owner')
  with check (public.current_role() = 'owner');
