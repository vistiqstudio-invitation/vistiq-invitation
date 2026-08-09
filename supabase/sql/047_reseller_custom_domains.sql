-- Automatic custom domains for active Reseller Brand tenants.
alter table public.resellers
  add column if not exists custom_domain text,
  add column if not exists custom_domain_status text not null default 'not_configured',
  add column if not exists custom_domain_verified_at timestamptz,
  add column if not exists custom_domain_error text;

alter table public.resellers drop constraint if exists resellers_custom_domain_status_check;
alter table public.resellers add constraint resellers_custom_domain_status_check
  check (custom_domain_status in ('not_configured', 'pending_dns', 'active', 'error'));

create unique index if not exists resellers_custom_domain_unique
  on public.resellers (lower(custom_domain)) where custom_domain is not null;

-- Domain lifecycle fields may only be written by the trusted server route
-- (service role), never directly by a reseller through the browser client.
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
  end if;
  return new;
end;
$$;

drop trigger if exists guard_reseller_custom_domain_columns on public.resellers;
create trigger guard_reseller_custom_domain_columns
  before update on public.resellers
  for each row execute function public.guard_reseller_custom_domain_columns();

create or replace function public.get_reseller_by_custom_domain(p_domain text)
returns table (reseller_id uuid)
language sql
security definer
stable
set search_path = public
as $$
  select r.id
  from public.resellers r
  where lower(r.custom_domain) = lower(trim(trailing '.' from p_domain))
    and r.custom_domain_status = 'active'
    and r.package = 'reseller_brand'
    and r.brand_active = true
    and r.status = 'active'
    and (r.brand_expires_at is null or r.brand_expires_at > now())
  limit 1;
$$;

revoke all on function public.get_reseller_by_custom_domain(text) from public;
grant execute on function public.get_reseller_by_custom_domain(text) to anon, authenticated;
