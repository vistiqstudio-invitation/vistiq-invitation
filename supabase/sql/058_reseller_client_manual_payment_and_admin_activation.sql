-- Manual payment confirmation for reseller client transactions and a single
-- owner-controlled activation gate for every reseller-owned client.
--
-- A reseller can notify the owner that a client claims to have paid, but only
-- an owner can turn the transaction into paid. Payment settlement never
-- publishes an invitation; the owner must activate it from Admin > Undangan.

alter table public.transactions
  add column if not exists owner_confirmed_by uuid references auth.users(id) on delete set null,
  add column if not exists owner_confirmed_at timestamptz;

create index if not exists transactions_owner_confirmed_by_idx
  on public.transactions(owner_confirmed_by)
  where owner_confirmed_by is not null;

-- Owner-only, retry-safe confirmation for a client payment made outside the
-- Midtrans settlement flow (for example, a bank transfer to Vistiq).
-- The row lock ensures two clicks cannot create two settlements. The existing
-- before_reseller_transaction_paid trigger supplies paid_at and the six-day
-- available_at hold exactly once on pending -> paid.
create or replace function public.owner_confirm_reseller_client_payment(p_transaction_id uuid)
returns table (
  transaction_id uuid,
  client_id uuid,
  reseller_id uuid,
  status text,
  already_paid boolean,
  paid_at timestamptz,
  available_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_transaction public.transactions%rowtype;
  v_already_paid boolean := false;
begin
  if public.current_role() is distinct from 'owner' then
    raise exception 'Tidak diizinkan.';
  end if;

  select *
    into v_transaction
    from public.transactions
   where id = p_transaction_id
   for update;

  if not found then
    raise exception 'Transaksi tidak ditemukan.';
  end if;

  if v_transaction.reseller_id is null or v_transaction.client_id is null then
    raise exception 'Transaksi ini bukan transaksi client reseller.';
  end if;

  if v_transaction.status = 'paid' then
    v_already_paid := true;
  elsif v_transaction.status = 'pending' then
    update public.transactions
       set status = 'paid',
           payment_type = coalesce(nullif(payment_type, ''), 'manual_transfer'),
           owner_confirmed_by = coalesce(owner_confirmed_by, auth.uid()),
           owner_confirmed_at = coalesce(owner_confirmed_at, now())
     where id = v_transaction.id;

    select *
      into v_transaction
      from public.transactions
     where id = v_transaction.id;
  else
    raise exception 'Transaksi tidak dapat dikonfirmasi dari status %.', v_transaction.status;
  end if;

  if v_already_paid then
    update public.transactions
       set owner_confirmed_by = coalesce(owner_confirmed_by, auth.uid()),
           owner_confirmed_at = coalesce(owner_confirmed_at, now())
     where id = v_transaction.id;

    select *
      into v_transaction
      from public.transactions
     where id = v_transaction.id;
  end if;

  return query
  select v_transaction.id,
         v_transaction.client_id,
         v_transaction.reseller_id,
         v_transaction.status,
         v_already_paid,
         v_transaction.paid_at,
         v_transaction.available_at;
end;
$$;

revoke all on function public.owner_confirm_reseller_client_payment(uuid) from public, anon;
grant execute on function public.owner_confirm_reseller_client_payment(uuid) to authenticated;

-- Reseller-owned client accounts are always pending until the owner activates
-- the related invitation. This also protects direct REST inserts that bypass
-- the React form.
create or replace function public.enforce_reseller_client_activation_state()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.reseller_id is not null then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists before_reseller_client_activation_state on public.clients;
create trigger before_reseller_client_activation_state
  before insert on public.clients
  for each row execute function public.enforce_reseller_client_activation_state();

-- Resellers may edit client profile details, but never the activation status.
-- Owner updates remain unrestricted.
create or replace function public.guard_clients_privileged_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' then
    if new.reseller_id is distinct from old.reseller_id then
      new.reseller_id := old.reseller_id;
    end if;
    if new.user_id is distinct from old.user_id then
      new.user_id := old.user_id;
    end if;
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_clients_privileged_columns on public.clients;
create trigger guard_clients_privileged_columns
  before update of reseller_id, user_id, status on public.clients
  for each row execute function public.guard_clients_privileged_columns();

-- Every reseller-created invitation is a draft. Payment and package type do
-- not grant publishing rights; only the owner can change is_active.
create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' then
    if new.is_active is distinct from old.is_active then
      new.is_active := old.is_active;
    end if;
    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

-- INSERT has no OLD row, so use a separate guard to force drafts for all
-- non-owner invitation creation paths.
create or replace function public.enforce_reseller_invitation_activation_state()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' then
    new.is_active := false;
  end if;
  return new;
end;
$$;

drop trigger if exists before_invitation_insert_payment_state on public.invitations;
drop trigger if exists before_reseller_invitation_activation_state on public.invitations;
create trigger before_reseller_invitation_activation_state
  before insert on public.invitations
  for each row execute function public.enforce_reseller_invitation_activation_state();

-- The previous payment trigger is intentionally removed. A paid transaction
-- changes the ledger only; the Owner still publishes the invitation manually.
drop trigger if exists on_transaction_paid_activate_invitations on public.transactions;

-- Keep the client status in sync with the Owner's one activation control. The
-- status is informational; public visibility is controlled by invitations.
create or replace function public.sync_client_status_from_owner_invitation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' or new.client_id is null then
    return new;
  end if;

  if new.is_active then
    update public.clients
       set status = 'active'
     where id = new.client_id
       and reseller_id is not null;
  elsif not exists (
    select 1
      from public.invitations i
     where i.client_id = new.client_id
       and i.is_active = true
       and i.id <> new.id
  ) then
    update public.clients
       set status = 'pending'
     where id = new.client_id
       and reseller_id is not null;
  end if;

  return new;
end;
$$;

drop trigger if exists after_owner_invitation_activation_sync_client on public.invitations;
create trigger after_owner_invitation_activation_sync_client
  after insert or update of is_active on public.invitations
  for each row execute function public.sync_client_status_from_owner_invitation();

revoke all on function public.enforce_reseller_client_activation_state() from public, anon, authenticated;
revoke all on function public.guard_clients_privileged_columns() from public, anon, authenticated;
revoke all on function public.guard_invitations_privileged_columns() from public, anon, authenticated;
revoke all on function public.enforce_reseller_invitation_activation_state() from public, anon, authenticated;
revoke all on function public.sync_client_status_from_owner_invitation() from public, anon, authenticated;

-- Reseller payment notices are authenticated-only. The Owner confirmation RPC
-- above is the only path that changes a transaction to paid.
revoke all on function public.confirm_payment_notification(uuid) from public, anon;
grant execute on function public.confirm_payment_notification(uuid) to authenticated;
