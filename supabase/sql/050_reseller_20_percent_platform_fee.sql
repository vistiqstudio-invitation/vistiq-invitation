-- New Reseller model:
-- - join fee is handled in lib/paymentPackages.ts (Rp59.000 once)
-- - standard Reseller can sell without a client-count limit
-- - standard Reseller keeps 80% of each tracked client transaction
-- - the remaining 20% is the Vistiq platform fee
--
-- The legacy column name `commission_percent` is preserved for compatibility;
-- for standard Reseller it now represents the reseller share (80%), not a
-- promotional commission rate.

alter table public.resellers
  alter column commission_percent set default 80;

update public.resellers
set commission_percent = 80
where package = 'reseller'
  and commission_percent is distinct from 80;

update public.resellers
set commission_percent = 100
where package = 'reseller_brand'
  and commission_percent is distinct from 100;

comment on column public.resellers.commission_percent is
  'Reseller share of a tracked client transaction. Standard reseller = 80% (20% platform fee); reseller_brand = 100%.';

create or replace function public.create_reseller_sale_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reseller_package text;
  reseller_share_percent numeric;
  sale_amount numeric := 149000;
begin
  if new.reseller_id is null then
    return new;
  end if;

  select package,
         coalesce(commission_percent, case when package = 'reseller' then 80 else 100 end)
    into reseller_package, reseller_share_percent
    from public.resellers
    where id = new.reseller_id;

  if reseller_package = 'reseller' then
    reseller_share_percent := 80;

    insert into public.transactions (client_id, reseller_id, amount, commission, status)
    values (
      new.id,
      new.reseller_id,
      sale_amount,
      round(sale_amount * reseller_share_percent / 100.0),
      'pending'
    );
  end if;

  return new;
end;
$$;
