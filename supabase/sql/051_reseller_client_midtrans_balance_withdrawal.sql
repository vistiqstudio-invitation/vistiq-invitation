alter table public.clients
  add column if not exists sale_price numeric(12,0) not null default 100000;

alter table public.transactions
  add column if not exists midtrans_order_id text,
  add column if not exists midtrans_redirect_url text,
  add column if not exists payment_link_expires_at timestamptz,
  add column if not exists payment_type text,
  add column if not exists midtrans_transaction_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists available_at timestamptz;

create unique index if not exists transactions_midtrans_order_id_key
  on public.transactions(midtrans_order_id)
  where midtrans_order_id is not null;

alter table public.resellers
  add column if not exists bank_name text,
  add column if not exists bank_account_number text,
  add column if not exists bank_account_holder text;

create table if not exists public.reseller_withdrawals (
  id uuid primary key default gen_random_uuid(),
  reseller_id uuid not null references public.resellers(id) on delete cascade,
  amount numeric(12,0) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','paid','rejected')),
  bank_name text not null,
  bank_account_number text not null,
  bank_account_holder text not null,
  requested_at timestamptz not null default now(),
  paid_at timestamptz,
  rejected_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.transactions
  add column if not exists withdrawal_id uuid references public.reseller_withdrawals(id) on delete set null;

create index if not exists transactions_withdrawal_id_idx on public.transactions(withdrawal_id);
create index if not exists reseller_withdrawals_reseller_id_idx on public.reseller_withdrawals(reseller_id, requested_at desc);

alter table public.reseller_withdrawals enable row level security;

drop policy if exists reseller_withdrawals_select on public.reseller_withdrawals;
create policy reseller_withdrawals_select on public.reseller_withdrawals
for select to authenticated
using (
  public.current_role() = 'owner'
  or reseller_id = public.my_reseller_id()
);

create or replace function public.create_reseller_sale_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reseller_package text;
  reseller_share numeric := 80;
  sale_amount numeric;
begin
  if new.reseller_id is null then return new; end if;
  select package into reseller_package from public.resellers where id = new.reseller_id;
  if reseller_package = 'reseller' then
    sale_amount := greatest(coalesce(new.sale_price, 100000), 1);
    insert into public.transactions (client_id, reseller_id, amount, commission, status)
    values (new.id, new.reseller_id, sale_amount, round(sale_amount * reseller_share / 100.0), 'pending');
  end if;
  return new;
end;
$$;

create or replace function public.set_reseller_transaction_hold_period()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    new.paid_at := coalesce(new.paid_at, now());
    new.available_at := coalesce(new.available_at, now() + interval '6 days');
  end if;
  return new;
end;
$$;

drop trigger if exists before_reseller_transaction_paid on public.transactions;
create trigger before_reseller_transaction_paid
before update on public.transactions
for each row execute function public.set_reseller_transaction_hold_period();

create or replace function public.enforce_reseller_invitation_payment_state()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reseller_package text;
  has_paid boolean := false;
begin
  if new.client_id is null then return new; end if;
  select r.package into reseller_package
  from public.clients c join public.resellers r on r.id = c.reseller_id
  where c.id = new.client_id;
  if reseller_package = 'reseller' then
    select exists(select 1 from public.transactions t where t.client_id = new.client_id and t.status = 'paid') into has_paid;
    if not has_paid then new.is_active := false; end if;
  end if;
  return new;
end;
$$;

drop trigger if exists before_invitation_insert_payment_state on public.invitations;
create trigger before_invitation_insert_payment_state
before insert on public.invitations
for each row execute function public.enforce_reseller_invitation_payment_state();

create or replace function public.request_reseller_withdrawal(
  p_bank_name text,
  p_account_number text,
  p_account_holder text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reseller_id uuid;
  v_withdrawal_id uuid;
  v_amount numeric;
begin
  v_reseller_id := public.my_reseller_id();
  if v_reseller_id is null then raise exception 'Akun reseller tidak ditemukan.'; end if;
  if nullif(trim(p_bank_name), '') is null or nullif(trim(p_account_number), '') is null or nullif(trim(p_account_holder), '') is null then
    raise exception 'Data rekening wajib dilengkapi.';
  end if;
  select coalesce(sum(t.commission), 0) into v_amount
  from public.transactions t
  where t.reseller_id = v_reseller_id and t.status = 'paid' and t.available_at is not null and t.available_at <= now() and t.withdrawal_id is null;
  if v_amount <= 0 then raise exception 'Belum ada saldo yang bisa ditarik.'; end if;
  insert into public.reseller_withdrawals (reseller_id, amount, bank_name, bank_account_number, bank_account_holder)
  values (v_reseller_id, v_amount, trim(p_bank_name), trim(p_account_number), trim(p_account_holder))
  returning id into v_withdrawal_id;
  update public.transactions t set withdrawal_id = v_withdrawal_id
  where t.reseller_id = v_reseller_id and t.status = 'paid' and t.available_at is not null and t.available_at <= now() and t.withdrawal_id is null;
  update public.resellers set bank_name = trim(p_bank_name), bank_account_number = trim(p_account_number), bank_account_holder = trim(p_account_holder)
  where id = v_reseller_id;
  return v_withdrawal_id;
end;
$$;

grant execute on function public.request_reseller_withdrawal(text, text, text) to authenticated;

create or replace function public.owner_update_reseller_withdrawal(
  p_withdrawal_id uuid,
  p_status text,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_role() <> 'owner' then raise exception 'Tidak diizinkan.'; end if;
  if p_status not in ('paid','rejected') then raise exception 'Status pencairan tidak valid.'; end if;
  if p_status = 'paid' then
    update public.reseller_withdrawals set status = 'paid', paid_at = now(), rejected_at = null, notes = p_notes
    where id = p_withdrawal_id and status = 'pending';
  else
    update public.reseller_withdrawals set status = 'rejected', rejected_at = now(), paid_at = null, notes = p_notes
    where id = p_withdrawal_id and status = 'pending';
    update public.transactions set withdrawal_id = null where withdrawal_id = p_withdrawal_id;
  end if;
end;
$$;

grant execute on function public.owner_update_reseller_withdrawal(uuid, text, text) to authenticated;
