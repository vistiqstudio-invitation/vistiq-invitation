-- Vistiq Affiliate: self-registration, owner approval, referrals and payouts.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('owner', 'reseller', 'client', 'affiliate'));

create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  whatsapp text not null,
  promotion_channel text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  application_id uuid unique references public.affiliate_applications(id) on delete set null,
  name text not null,
  email text not null unique,
  whatsapp text not null,
  referral_code text not null unique,
  commission_percent numeric not null default 30 check (commission_percent between 0 and 100),
  bank_name text,
  account_number text,
  account_name text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

alter table public.checkout_orders
  add column if not exists affiliate_id uuid references public.affiliates(id) on delete set null,
  add column if not exists referral_code text;

create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  checkout_order_id uuid not null unique references public.checkout_orders(id) on delete cascade,
  order_id text not null,
  package_id text not null,
  sale_amount bigint not null,
  commission_amount bigint not null,
  status text not null default 'held'
    check (status in ('held', 'available', 'requested', 'paid', 'cancelled')),
  available_at timestamptz not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.affiliate_withdrawals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  amount bigint not null check (amount >= 100000),
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid', 'rejected')),
  admin_note text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.affiliate_applications enable row level security;
alter table public.affiliates enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.affiliate_withdrawals enable row level security;

create policy "affiliate_applications_owner_select" on public.affiliate_applications
  for select using (public.current_role() = 'owner');
create policy "affiliates_owner_or_self_select" on public.affiliates
  for select using (public.current_role() = 'owner' or user_id = auth.uid());
create policy "affiliates_self_update" on public.affiliates
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "affiliate_commissions_owner_or_self_select" on public.affiliate_commissions
  for select using (
    public.current_role() = 'owner' or affiliate_id in
      (select id from public.affiliates where user_id = auth.uid())
  );
create policy "affiliate_withdrawals_owner_or_self_select" on public.affiliate_withdrawals
  for select using (
    public.current_role() = 'owner' or affiliate_id in
      (select id from public.affiliates where user_id = auth.uid())
  );

create index if not exists affiliates_referral_code_idx on public.affiliates(referral_code);
create index if not exists affiliate_commissions_affiliate_idx
  on public.affiliate_commissions(affiliate_id, created_at desc);
create index if not exists affiliate_withdrawals_affiliate_idx
  on public.affiliate_withdrawals(affiliate_id, requested_at desc);

create or replace function public.refresh_affiliate_commissions()
returns void language sql security definer set search_path = public as $$
  update public.affiliate_commissions
     set status = 'available'
   where status = 'held' and available_at <= now();
$$;
revoke all on function public.refresh_affiliate_commissions() from public, anon;
grant execute on function public.refresh_affiliate_commissions() to authenticated, service_role;

create or replace function public.guard_affiliate_privileged_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.current_role() is distinct from 'owner' then
    new.user_id := old.user_id;
    new.application_id := old.application_id;
    new.email := old.email;
    new.referral_code := old.referral_code;
    new.commission_percent := old.commission_percent;
    new.status := old.status;
  end if;
  return new;
end;
$$;
drop trigger if exists guard_affiliate_privileged_columns on public.affiliates;
create trigger guard_affiliate_privileged_columns
  before update on public.affiliates
  for each row execute function public.guard_affiliate_privileged_columns();
