-- Corrects the earlier interpretation: active Reseller Brand owners retain
-- control of their own invitations. Standard resellers and clients do not.
-- Payment settlement records payment only; publication is a separate action.
create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  can_manage_activation boolean := false;
begin
  if public.current_role() is distinct from 'owner' then
    select exists (
      select 1 from public.clients c
      join public.resellers r on r.id = c.reseller_id
      where c.id = old.client_id
        and r.id = public.my_reseller_id()
        and r.package = 'reseller_brand'
        and r.status = 'active'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
    ) into can_manage_activation;
    if new.is_active is distinct from old.is_active and not can_manage_activation then
      new.is_active := old.is_active;
    end if;
    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

-- Cover INSERT as well as UPDATE, including paid clients, null client IDs,
-- direct REST requests and upserts. Clients never self-publish.
create or replace function public.enforce_reseller_invitation_payment_state()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  can_manage_activation boolean := false;
begin
  if public.current_role() = 'owner' then return new; end if;
  select exists (
    select 1 from public.clients c
    join public.resellers r on r.id = c.reseller_id
    where c.id = new.client_id
      and r.id = public.my_reseller_id()
      and r.package = 'reseller_brand'
      and r.status = 'active'
      and r.brand_active = true
      and (r.brand_expires_at is null or r.brand_expires_at > now())
  ) into can_manage_activation;
  if not can_manage_activation then new.is_active := false; end if;
  return new;
end;
$$;

drop trigger if exists on_transaction_paid_activate_invitations on public.transactions;

revoke all on function public.guard_invitations_privileged_columns() from public, anon, authenticated;
revoke all on function public.enforce_reseller_invitation_payment_state() from public, anon, authenticated;

