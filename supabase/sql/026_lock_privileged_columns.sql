-- SECURITY FIX: resellers_update (002) and clients_update (002) let a
-- reseller/client update their OWN row via the public anon/authenticated
-- key, with no restriction on WHICH columns change. The only existing
-- guard (009's guard_reseller_brand_active) protects just brand_active.
--
-- This means, today, any authenticated reseller can call the Supabase
-- REST API directly (no app code involved - just their own valid login
-- token, which is exactly what we're now handing out to real signups via
-- paid ads) and:
--   update resellers set commission_percent = 999999 where id = <their own id>
-- then insert a client row themselves (also permitted by clients_insert),
-- which fires create_reseller_sale_transaction() (012) and creates a
-- fraudulent, wildly-inflated "pending" commission transaction that shows
-- up in the owner's admin/transactions ledger, hoping to get approved.
--
-- Separately, a client can reassign clients.reseller_id to an arbitrary
-- value on their own row (clients_update's WITH CHECK only re-verifies
-- user_id = auth.uid(), not that reseller_id is unchanged), letting them
-- silently move themselves off their real reseller's client list.
--
-- Fix: extend the trigger-guard pattern already used for brand_active to
-- also lock commission_percent/package/status/user_id on resellers, and
-- reseller_id/user_id on clients - non-owner writes to those columns are
-- silently reverted to their previous value instead of failing outright,
-- consistent with 009's approach.

drop trigger if exists guard_reseller_brand_active on public.resellers;
drop function if exists public.guard_reseller_brand_active();

create or replace function public.guard_reseller_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' then
    if new.brand_active is distinct from old.brand_active then
      new.brand_active := old.brand_active;
    end if;
    if new.commission_percent is distinct from old.commission_percent then
      new.commission_percent := old.commission_percent;
    end if;
    if new.package is distinct from old.package then
      new.package := old.package;
    end if;
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
    if new.user_id is distinct from old.user_id then
      new.user_id := old.user_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_reseller_privileged_columns on public.resellers;
create trigger guard_reseller_privileged_columns
  before update on public.resellers
  for each row execute function public.guard_reseller_privileged_columns();

create or replace function public.guard_clients_privileged_columns()
returns trigger
language plpgsql
security definer
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
  end if;
  return new;
end;
$$;

drop trigger if exists guard_clients_privileged_columns on public.clients;
create trigger guard_clients_privileged_columns
  before update on public.clients
  for each row execute function public.guard_clients_privileged_columns();
