-- Store one public catalog price for each invitation occasion.
alter table public.resellers
  add column if not exists wedding_price numeric,
  add column if not exists khitan_price numeric,
  add column if not exists graduation_price numeric,
  add column if not exists aqiqah_price numeric,
  add column if not exists birthday_price numeric;

-- Preserve an existing configured storefront price as the initial value.
update public.resellers
set wedding_price = coalesce(wedding_price, starting_price),
    khitan_price = coalesce(khitan_price, starting_price),
    graduation_price = coalesce(graduation_price, starting_price),
    aqiqah_price = coalesce(aqiqah_price, starting_price),
    birthday_price = coalesce(birthday_price, starting_price)
where starting_price is not null;

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
  whatsapp text
)
language sql
security definer
stable
set search_path = public
as $$
  select r.brand_name, r.logo_url, r.brand_color, r.starting_price,
         r.wedding_price, r.khitan_price, r.graduation_price,
         r.aqiqah_price, r.birthday_price, r.whatsapp
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
