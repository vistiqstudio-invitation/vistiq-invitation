-- Owner-only, idempotent confirmation for reseller client transactions that
-- were paid outside the automatic Midtrans flow.
--
-- This RPC deliberately only settles the existing transaction. It does not
-- create another transaction, commission, balance, package, or invitation
-- record. The existing before_reseller_transaction_paid trigger remains the
-- single place that fills paid_at and available_at.

create or replace function public.owner_confirm_transaction_payment(p_transaction_id uuid)
returns table (
  transaction_id uuid,
  status text,
  paid_at timestamptz,
  available_at timestamptz,
  already_paid boolean
)
language plpgsql
security invoker
set search_path = public
as $function$
declare
  v_transaction public.transactions%rowtype;
begin
  if public.current_role() is distinct from 'owner' then
    raise exception 'Tidak diizinkan.';
  end if;

  -- Lock the row so two Owner requests cannot both settle the same payment.
  select t.*
    into v_transaction
    from public.transactions as t
   where t.id = p_transaction_id
   for update;

  if not found then
    raise exception 'Transaksi tidak ditemukan.';
  end if;

  -- A retry is a successful no-op. This makes the RPC safe for refreshes,
  -- double-clicks, and network retries after the first request committed.
  if v_transaction.status = 'paid' then
    return query
    select v_transaction.id,
           v_transaction.status,
           v_transaction.paid_at,
           v_transaction.available_at,
           true;
    return;
  end if;

  if v_transaction.status is distinct from 'pending' then
    raise exception 'Transaksi dengan status % tidak dapat dikonfirmasi.',
      coalesce(v_transaction.status, 'NULL');
  end if;

  -- The existing BEFORE UPDATE trigger fills the payment timestamps when the
  -- status transitions to paid. No other payment-side effect is introduced.
  update public.transactions as t
     set status = 'paid'
   where t.id = v_transaction.id
     and t.status = 'pending';

  if not found then
    raise exception 'Transaksi berubah sebelum dikonfirmasi. Silakan refresh.';
  end if;

  return query
  select t.id,
         t.status,
         t.paid_at,
         t.available_at,
         false
    from public.transactions as t
   where t.id = v_transaction.id;
end;
$function$;

revoke all on function public.owner_confirm_transaction_payment(uuid)
  from public, anon, authenticated;
grant execute on function public.owner_confirm_transaction_payment(uuid)
  to authenticated;
