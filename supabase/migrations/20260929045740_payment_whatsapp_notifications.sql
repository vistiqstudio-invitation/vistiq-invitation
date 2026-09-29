-- WhatsApp remains disabled until the owner verifies the API sender/template.
create table public.payment_whatsapp_settings (
  id integer primary key default 1 check (id = 1),
  enabled boolean not null default false,
  sender text not null default '6281371338032',
  recipient text not null default '6281261581332',
  updated_at timestamptz not null default now(),
  check (sender ~ '^62[0-9]{8,13}$' and recipient ~ '^62[0-9]{8,13}$' and sender <> recipient)
);
insert into public.payment_whatsapp_settings (id) values (1);

create table public.payment_whatsapp_outbox (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  customer_name text not null,
  amount numeric not null check (amount > 0),
  payment_type text not null,
  recipient text not null,
  status text not null default 'queued' check (status in ('queued','processing','accepted','failed','unknown')),
  attempts integer not null default 0,
  claim_token uuid,
  claimed_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payment_whatsapp_outbox_queue_idx on public.payment_whatsapp_outbox (created_at) where status = 'queued';
alter table public.payment_whatsapp_settings enable row level security;
alter table public.payment_whatsapp_outbox enable row level security;
revoke all on public.payment_whatsapp_settings, public.payment_whatsapp_outbox from public, anon, authenticated;
grant all on public.payment_whatsapp_settings, public.payment_whatsapp_outbox to service_role;

create schema if not exists private;
create or replace function private.enqueue_payment_whatsapp()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  recipient_number text;
  order_number text;
  payer_name text;
begin
  if new.status is distinct from 'paid' or old.status = 'paid' then return new; end if;
  select recipient into recipient_number from public.payment_whatsapp_settings where id=1 and enabled;
  if recipient_number is null then return new; end if;
  if tg_table_name = 'checkout_orders' then
    if new.transaction_id is null or new.payment_type is null or new.payment_type = 'manual' then return new; end if;
    order_number := new.order_id;
    payer_name := new.customer_name;
  else
    if new.midtrans_order_id is null or new.midtrans_transaction_id is null or new.payment_type is null or new.payment_type = 'manual' then return new; end if;
    order_number := new.midtrans_order_id;
    select name into payer_name from public.clients where id = new.client_id;
  end if;
  if order_number not like 'VSTQ-%' then return new; end if;
  insert into public.payment_whatsapp_outbox (order_id, customer_name, amount, payment_type, recipient)
  values (order_number, coalesce(nullif(payer_name,''),'Pelanggan Vistiq'), new.amount, new.payment_type, recipient_number)
  on conflict (order_id) do nothing;
  return new;
end;
$$;
revoke all on function private.enqueue_payment_whatsapp() from public, anon, authenticated;
create trigger enqueue_checkout_payment_whatsapp after update on public.checkout_orders
for each row execute function private.enqueue_payment_whatsapp();
create trigger enqueue_reseller_payment_whatsapp after update on public.transactions
for each row execute function private.enqueue_payment_whatsapp();

create or replace function public.claim_payment_whatsapp_jobs(p_limit integer default 3)
returns setof public.payment_whatsapp_outbox language plpgsql security invoker set search_path = '' as $$
begin
  if not exists(select 1 from public.payment_whatsapp_settings where id=1 and enabled) then return; end if;
  -- A worker interrupted after sending has an uncertain result. Do not resend it automatically.
  update public.payment_whatsapp_outbox set status='unknown', last_error='Worker interrupted; check WhatsApp before resending', updated_at=now()
  where status='processing' and claimed_at < now()-interval '10 minutes';
  return query
    with next_jobs as (
      select id from public.payment_whatsapp_outbox where status='queued'
      order by created_at for update skip locked limit least(greatest(p_limit,1),3)
    )
    update public.payment_whatsapp_outbox j set status='processing', attempts=attempts+1,
      claim_token=gen_random_uuid(), claimed_at=now(), updated_at=now()
    from next_jobs where j.id=next_jobs.id returning j.*;
end;
$$;
revoke all on function public.claim_payment_whatsapp_jobs(integer) from public, anon, authenticated;
grant execute on function public.claim_payment_whatsapp_jobs(integer) to service_role;
