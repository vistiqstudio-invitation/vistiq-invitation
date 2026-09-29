-- The database owns payment timestamps for both Midtrans webhooks and status sync.
create or replace function public.set_reseller_transaction_hold_period()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    new.paid_at := coalesce(old.paid_at, new.paid_at, now());
    new.available_at := new.paid_at + interval '24 hours';
  end if;
  return new;
end;
$$;

-- Keep the existing protection against duplicate/out-of-order payment updates.
-- Unwithdrawn commissions may move earlier to the new 24-hour deadline only.
create or replace function public.keep_paid_transaction_settled()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if old.status = 'paid' then
    new.status := 'paid';
    new.paid_at := old.paid_at;
    if old.withdrawal_id is null and old.paid_at is not null then
      new.available_at := least(old.available_at, old.paid_at + interval '24 hours');
    else
      new.available_at := old.available_at;
    end if;
    if old.payment_type is not null then
      new.payment_type := old.payment_type;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists before_reseller_transaction_paid on public.transactions;
create trigger before_reseller_transaction_paid
before update on public.transactions
for each row execute function public.set_reseller_transaction_hold_period();

drop trigger if exists before_reseller_transaction_paid_settled on public.transactions;
create trigger before_reseller_transaction_paid_settled
before update on public.transactions
for each row execute function public.keep_paid_transaction_settled();

-- Shorten existing holds without altering requested/paid withdrawals or inventing
-- payment timestamps for legacy records that have no payment evidence.
update public.transactions
set available_at = least(available_at, paid_at + interval '24 hours')
where status = 'paid'
  and withdrawal_id is null
  and paid_at is not null
  and (available_at is null or available_at > paid_at + interval '24 hours');
