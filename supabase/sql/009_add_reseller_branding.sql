-- Adds white-label branding fields to resellers. A reseller can set their
-- own brand name / logo / accent color, which shows on their clients'
-- public invitation pages (footer, page title) instead of "Vistiq
-- Invitation". brand_active gates the feature behind the paid package -
-- the reseller can fill the fields in any time, but they only take effect
-- once an owner flips brand_active on (after manual WhatsApp payment,
-- same pattern as the rest of the order flow).

alter table public.resellers add column if not exists brand_name text;
alter table public.resellers add column if not exists logo_url text;
alter table public.resellers add column if not exists brand_color text;
alter table public.resellers add column if not exists brand_active boolean not null default false;

-- The existing "resellers_update" RLS policy (002) lets a reseller update
-- their own row, which would let them flip brand_active on themselves
-- without paying for the package. RLS can't restrict individual columns,
-- so enforce it with a trigger instead: only an owner can change
-- brand_active; anyone else's update silently keeps the previous value.
create or replace function public.guard_reseller_brand_active()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.brand_active is distinct from old.brand_active
     and public.current_role() is distinct from 'owner' then
    new.brand_active := old.brand_active;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_reseller_brand_active on public.resellers;
create trigger guard_reseller_brand_active
  before update on public.resellers
  for each row execute function public.guard_reseller_brand_active();
