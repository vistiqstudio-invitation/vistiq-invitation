-- Run once in Supabase SQL Editor before enabling Midtrans checkout in production.
create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  package_id text not null check (package_id in ('client','reseller','reseller-brand')),
  package_name text not null,
  amount bigint not null check (amount > 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  status text not null default 'pending',
  payment_type text,
  transaction_id text,
  raw_notification jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.checkout_orders enable row level security;
drop policy if exists "checkout_orders_owner_select" on public.checkout_orders;
create policy "checkout_orders_owner_select" on public.checkout_orders
  for select using (public.current_role() = 'owner');

create index if not exists checkout_orders_created_at_idx on public.checkout_orders (created_at desc);
create index if not exists checkout_orders_status_idx on public.checkout_orders (status);
