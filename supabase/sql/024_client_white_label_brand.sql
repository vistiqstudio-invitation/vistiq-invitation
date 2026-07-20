-- Lets a logged-in client read only the public white-label identity of the
-- reseller that owns their account. No commission or private reseller data
-- is exposed.
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
     and nullif(trim(r.brand_name), '') is not null
   limit 1;
$$;

revoke all on function public.get_my_client_brand() from public;
revoke all on function public.get_my_client_brand() from anon;
grant execute on function public.get_my_client_brand() to authenticated;
