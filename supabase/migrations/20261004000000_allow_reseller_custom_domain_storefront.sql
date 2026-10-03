-- Standard Reseller accounts can use custom domains too. Resolve both active
-- Reseller and active Mitra Brand tenants while preserving subscription checks.
create or replace function public.get_reseller_by_custom_domain(p_domain text)
returns table (reseller_id uuid)
language sql
security definer
stable
set search_path = public
as $$
  select r.id
  from public.resellers r
  where (
      lower(r.custom_domain) = lower(trim(trailing '.' from p_domain))
      or lower(r.free_subdomain || '.vistiqinvitation.com') = lower(trim(trailing '.' from p_domain))
    )
    and (r.custom_domain_status = 'active' or r.free_subdomain is not null)
    and r.status = 'active'
    and (
      r.package = 'reseller'
      or (
        r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
      )
    )
  limit 1;
$$;

revoke all on function public.get_reseller_by_custom_domain(text) from public;
grant execute on function public.get_reseller_by_custom_domain(text) to anon, authenticated, service_role;

-- Keep the public storefront neutral when no explicit brand name is set, and
-- never expose storefront data for inactive or unsupported account types.
create or replace function public.get_reseller_storefront_by_key(p_key text)
returns table (
  brand_name text,
  logo_url text,
  brand_color text,
  starting_price numeric,
  wedding_price numeric,
  khitan_price numeric,
  graduation_price numeric,
  aqiqah_price numeric,
  birthday_price numeric,
  wedding_premium_price numeric,
  wedding_motion_price numeric,
  wedding_luxury_art_price numeric,
  wedding_regular_price numeric,
  wedding_adat_price numeric,
  wedding_no_photo_price numeric,
  whatsapp text
)
language sql
security definer
stable
set search_path = public
as $$
  select
    coalesce(nullif(trim(r.brand_name), ''), nullif(trim(r.name), ''), 'Undangan Digital'),
    r.logo_url,
    r.brand_color,
    r.starting_price,
    r.wedding_price,
    r.khitan_price,
    r.graduation_price,
    r.aqiqah_price,
    r.birthday_price,
    r.wedding_premium_price,
    r.wedding_motion_price,
    r.wedding_luxury_art_price,
    r.wedding_regular_price,
    r.wedding_adat_price,
    r.wedding_no_photo_price,
    coalesce(nullif(r.landing_whatsapp, ''), nullif(r.whatsapp, ''))
  from public.resellers r
  where (r.id::text = p_key or lower(r.landing_slug) = lower(p_key))
    and r.status = 'active'
    and (
      r.package = 'reseller'
      or (
        r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
      )
    )
  limit 1;
$$;

revoke all on function public.get_reseller_storefront_by_key(text) from public;
grant execute on function public.get_reseller_storefront_by_key(text) to anon, authenticated, service_role;
