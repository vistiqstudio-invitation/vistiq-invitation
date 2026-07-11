-- Lets a reseller see their own commission ledger, and automates the
-- "komisi otomatis 30%" requirement: whenever a reseller on the plain
-- 'reseller' package (not 'reseller_brand', which keeps 100% and pays
-- Vistiq a flat monthly fee instead) adds a new client, a transactions
-- row is created for that sale automatically - no manual bookkeeping.

-- ---------------------------------------------------------------------
-- 1. Reseller can read (not write) their own transactions.
--    Owner keeps full read/write via the existing transactions_owner_all
--    policy - this just adds an extra permissive SELECT policy for
--    resellers, scoped to their own reseller_id.
-- ---------------------------------------------------------------------
drop policy if exists "transactions_select_reseller" on public.transactions;
create policy "transactions_select_reseller"
  on public.transactions for select
  using (reseller_id = public.my_reseller_id());

-- ---------------------------------------------------------------------
-- 2. Auto-create a commission transaction when a reseller adds a client.
--    Rp 99.000 mirrors the flat "Client" package price on the homepage -
--    every theme costs the same for the end customer, so the sale amount
--    doesn't depend on which theme (package_name) was chosen.
--    SECURITY DEFINER so it can insert into transactions even though the
--    reseller themselves has no direct insert grant on that table.
-- ---------------------------------------------------------------------
create or replace function public.create_reseller_sale_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reseller_package text;
  reseller_commission numeric;
  sale_amount numeric := 99000;
begin
  if new.reseller_id is null then
    return new;
  end if;

  select package, coalesce(commission_percent, 0)
    into reseller_package, reseller_commission
    from public.resellers
    where id = new.reseller_id;

  if reseller_package = 'reseller' then
    insert into public.transactions (client_id, reseller_id, amount, commission, status)
    values (new.id, new.reseller_id, sale_amount, round(sale_amount * reseller_commission / 100.0), 'pending');
  end if;

  return new;
end;
$$;

drop trigger if exists on_client_created_reseller_sale on public.clients;
create trigger on_client_created_reseller_sale
  after insert on public.clients
  for each row execute function public.create_reseller_sale_transaction();
