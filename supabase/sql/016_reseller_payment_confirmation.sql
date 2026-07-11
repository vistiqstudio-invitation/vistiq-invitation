-- Payment is a manual bank transfer straight to the owner's account, so the
-- system has no way to detect it automatically (see 015). This adds the
-- other half: a reseller-facing "Konfirmasi Sudah Bayar" button that just
-- notifies the owner in-app that a client claims to have paid. It does NOT
-- flip transactions.status or activate anything by itself - the owner
-- still verifies the transfer landed and marks it "Dibayar" themselves in
-- admin/transactions, which is what actually triggers activation (015).
--
-- A SECURITY DEFINER function is used instead of widening reseller UPDATE
-- access on transactions (they still only have SELECT via
-- transactions_select_reseller from migration 012) - this keeps the write
-- surface to exactly "set my own transaction's confirmed timestamp".

alter table public.transactions
  add column if not exists reseller_confirmed_at timestamptz;

create or replace function public.confirm_payment_notification(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owning_reseller_id uuid;
begin
  select reseller_id into owning_reseller_id
  from public.transactions
  where id = p_transaction_id;

  if owning_reseller_id is null or owning_reseller_id <> public.my_reseller_id() then
    raise exception 'Not authorized to confirm this transaction.';
  end if;

  update public.transactions
  set reseller_confirmed_at = now()
  where id = p_transaction_id;
end;
$$;

grant execute on function public.confirm_payment_notification(uuid) to authenticated;
