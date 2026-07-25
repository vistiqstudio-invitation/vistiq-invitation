-- Reseller Brand switches from a one-time "pay once, lifetime" purchase to
-- a Rp149.000/month subscription (theme updates, promo content, etc. every
-- month) - EXCEPT the first 10 buyers from the launch promo, who keep
-- their lifetime access as an early-adopter reward. Billing itself stays
-- fully manual (no Midtrans recurring/auto-charge integration): a
-- reseller's dashboard shows their remaining days and, once expired, a
-- "hubungi admin untuk perpanjang" notice; the owner manually extends
-- brand_expires_at after confirming a manual payment.
--
-- brand_expires_at = null means "no expiry" (lifetime) - every existing
-- reseller_brand row today gets this for free since the column defaults
-- to null, which is exactly the "grandfather the first 10" behavior we
-- want with zero backfill needed.

alter table public.resellers
  add column if not exists brand_expires_at timestamptz;

-- 1. Owner-only column, same protected class as brand_active/package/etc.
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
    if new.brand_expires_at is distinct from old.brand_expires_at then
      new.brand_expires_at := old.brand_expires_at;
    end if;
  end if;
  return new;
end;
$$;

-- 2. Client-facing brand lookup (dashboard) - stop showing white-label
-- branding once the subscription has lapsed.
create or replace function public.get_my_client_brand()
returns table (
  brand_name text,
  logo_url text,
  brand_color text
)
language sql
security definer
stable
set search_path = public
as $$
  select r.brand_name, r.logo_url, r.brand_color
    from public.clients c
    join public.resellers r on r.id = c.reseller_id
   where c.user_id = auth.uid()
     and r.package = 'reseller_brand'
     and r.brand_active = true
     and (r.brand_expires_at is null or r.brand_expires_at > now())
     and nullif(trim(r.brand_name), '') is not null
   limit 1;
$$;

-- 3. Public storefront - same expiry gate.
create or replace function public.get_reseller_storefront(p_reseller_id uuid)
returns table (
  brand_name text,
  logo_url text,
  brand_color text,
  starting_price numeric,
  whatsapp text
)
language sql
security definer
stable
set search_path = public
as $$
  select brand_name, logo_url, brand_color, starting_price, whatsapp
  from public.resellers
  where id = p_reseller_id
    and package = 'reseller_brand'
    and brand_active = true
    and (brand_expires_at is null or brand_expires_at > now())
    and status = 'active'
  limit 1;
$$;

-- 4. Reseller Brand self-activation (042) - a lapsed subscription loses
-- the self-service is_active toggle, falls back to owner-only again.
create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_reseller_brand_owner boolean;
begin
  if public.current_role() is distinct from 'owner' then
    select exists (
      select 1 from public.clients c
      join public.resellers r on r.id = c.reseller_id
      where c.id = old.client_id
        and r.id = public.my_reseller_id()
        and r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
    ) into is_reseller_brand_owner;

    if new.is_active is distinct from old.is_active and not is_reseller_brand_owner then
      new.is_active := old.is_active;
    end if;

    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists "invitations_delete_reseller_brand" on public.invitations;
create policy "invitations_delete_reseller_brand"
  on public.invitations for delete
  using (
    exists (
      select 1 from public.clients c
      join public.resellers r on r.id = c.reseller_id
      where c.id = invitations.client_id
        and r.id = public.my_reseller_id()
        and r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
    )
  );
