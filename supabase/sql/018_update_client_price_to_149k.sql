-- Client package price raised from Rp 99.000 to Rp 149.000 (was already the
-- "before discount" price shown on /demo - this just makes it the real,
-- non-promo price everywhere). This only touches the sale_amount used to
-- auto-create a reseller's commission transaction (012) - the app/page.tsx
-- and app/demo/page.tsx price displays are updated separately in code.

create or replace function public.create_reseller_sale_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reseller_package text;
  reseller_commission numeric;
  sale_amount numeric := 149000;
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
