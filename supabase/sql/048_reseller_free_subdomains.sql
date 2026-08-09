-- Free automatic subdomains for active Reseller Brand tenants.
alter table public.resellers add column if not exists free_subdomain text;

create unique index if not exists resellers_free_subdomain_unique
  on public.resellers (lower(free_subdomain)) where free_subdomain is not null;

alter table public.resellers drop constraint if exists resellers_free_subdomain_format_check;
alter table public.resellers add constraint resellers_free_subdomain_format_check
  check (free_subdomain is null or free_subdomain ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$');

-- Extend the existing lifecycle guard so browsers cannot assign their own subdomain.
create or replace function public.guard_reseller_custom_domain_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    new.custom_domain := old.custom_domain;
    new.custom_domain_status := old.custom_domain_status;
    new.custom_domain_verified_at := old.custom_domain_verified_at;
    new.custom_domain_error := old.custom_domain_error;
    new.free_subdomain := old.free_subdomain;
  end if;
  return new;
end;
$$;

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
    and r.package = 'reseller_brand'
    and r.brand_active = true
    and r.status = 'active'
    and (r.brand_expires_at is null or r.brand_expires_at > now())
  limit 1;
$$;

revoke all on function public.get_reseller_by_custom_domain(text) from public;
grant execute on function public.get_reseller_by_custom_domain(text) to anon, authenticated;
