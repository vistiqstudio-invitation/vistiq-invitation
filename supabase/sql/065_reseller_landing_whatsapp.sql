-- Let each reseller use a dedicated WhatsApp number for storefront leads
-- without changing the WhatsApp number attached to their account.
alter table public.resellers
  add column if not exists landing_whatsapp text;

drop function if exists public.get_reseller_storefront(uuid);

create function public.get_reseller_storefront(p_reseller_id uuid)
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
  select r.brand_name, r.logo_url, r.brand_color, r.starting_price,
         r.wedding_price, r.khitan_price, r.graduation_price,
         r.aqiqah_price, r.birthday_price,
         r.wedding_premium_price, r.wedding_motion_price,
         r.wedding_luxury_art_price, r.wedding_regular_price,
         r.wedding_adat_price, r.wedding_no_photo_price,
         coalesce(nullif(trim(r.landing_whatsapp), ''), r.whatsapp) as whatsapp
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
