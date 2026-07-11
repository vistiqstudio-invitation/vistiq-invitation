-- SECURITY FIX for 016's confirm_payment_notification().
--
-- The authorization check used `owning_reseller_id <> public.my_reseller_id()`.
-- In SQL, `x <> NULL` evaluates to NULL (not TRUE), and an `IF ... THEN`
-- treats NULL as "don't run this branch" - same as FALSE. Since
-- my_reseller_id() returns NULL for anyone who isn't authenticated as a
-- reseller (including a fully anonymous caller using only the public anon
-- key), the exception branch was silently skipped and the UPDATE ran
-- anyway. In practice this meant *anyone* could call this RPC over the
-- public REST API and mark any transaction as "confirmed by reseller",
-- with no login required. Confirmed via direct testing and reverted the
-- one row it affected before this fix shipped.
--
-- Fix: use IS DISTINCT FROM, which always returns TRUE/FALSE and never
-- NULL, so NULL my_reseller_id() correctly fails the check.

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

  if owning_reseller_id is null
     or owning_reseller_id is distinct from public.my_reseller_id() then
    raise exception 'Not authorized to confirm this transaction.';
  end if;

  update public.transactions
  set reseller_confirmed_at = now()
  where id = p_transaction_id;
end;
$$;
