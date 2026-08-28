-- All reseller-created invitations are activated exclusively by Vistiq owners.
-- A successful client payment may still activate the invitation through the
-- owner-controlled transaction/Midtrans flow, but resellers cannot change
-- invitations.is_active directly, regardless of package.
create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security definer
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

-- Standard Resellers can use their own name/logo/color. Reseller Brand keeps
-- its paid activation and expiry gates. Custom/subdomains remain restricted
-- to Reseller Brand by the existing domain RPCs and API routes.
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
     and r.status = 'active'
     and (
       r.package = 'reseller'
       or (
         r.package = 'reseller_brand'
         and r.brand_active = true
         and (r.brand_expires_at is null or r.brand_expires_at > now())
       )
     )
     and nullif(trim(r.brand_name), '') is not null
   limit 1;
$$;

revoke all on function public.get_my_client_brand() from public;
revoke all on function public.get_my_client_brand() from anon;
grant execute on function public.get_my_client_brand() to authenticated;

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
  select r.brand_name, r.logo_url, r.brand_color, r.starting_price, r.whatsapp
  from public.resellers r
  where r.id = p_reseller_id
    and r.status = 'active'
    and (
      r.package = 'reseller'
      or (
        r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
      )
    )
    and nullif(trim(r.brand_name), '') is not null
  limit 1;
$$;

revoke all on function public.get_reseller_storefront(uuid) from public;
grant execute on function public.get_reseller_storefront(uuid) to anon, authenticated;
