-- Reseller custom landing-page slug
alter table public.resellers
  add column if not exists landing_slug text;

create unique index if not exists resellers_landing_slug_unique
  on public.resellers (lower(landing_slug))
  where landing_slug is not null;

alter table public.resellers
  drop constraint if exists resellers_landing_slug_format;

alter table public.resellers
  add constraint resellers_landing_slug_format
  check (
    landing_slug is null
    or landing_slug ~ '^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$'
  );

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
set search_path = public
as $$
  select
    r.brand_name, r.logo_url, r.brand_color, r.starting_price,
    r.wedding_price, r.khitan_price, r.graduation_price, r.aqiqah_price, r.birthday_price,
    r.wedding_premium_price, r.wedding_motion_price, r.wedding_luxury_art_price,
    r.wedding_regular_price, r.wedding_adat_price, r.wedding_no_photo_price,
    coalesce(nullif(r.landing_whatsapp, ''), nullif(r.whatsapp, '')) as whatsapp
  from public.resellers r
  where r.id::text = p_key or lower(r.landing_slug) = lower(p_key)
  limit 1;
$$;

grant execute on function public.get_reseller_storefront_by_key(text) to anon, authenticated;
