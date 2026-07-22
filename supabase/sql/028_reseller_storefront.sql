-- Reseller Brand keeps 100% and sets their own price, but sharing the
-- public /demo page (Vistiq's own catalog) sent every "Order" click to
-- Vistiq's WhatsApp instead of the reseller's - the reseller was
-- completely cut out of their own leads. This gives each Reseller Brand a
-- public, shareable storefront that shows a price THEY set and routes
-- "Order" to THEIR whatsapp number.

alter table public.resellers add column if not exists starting_price numeric;

-- Public/anon-readable, but only exposes the handful of fields needed for
-- a promo page (never commission_percent, status, user_id, etc.), and only
-- for a reseller who is actually on the paid, activated Reseller Brand
-- tier - not a general "look up any reseller's phone number" endpoint.
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
    and status = 'active'
  limit 1;
$$;

revoke all on function public.get_reseller_storefront(uuid) from public;
grant execute on function public.get_reseller_storefront(uuid) to anon, authenticated;
