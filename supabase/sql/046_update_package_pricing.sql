-- Package pricing restructure (homepage "Pilih Paket" now shows 4 tiers):
--   Client:         Rp149.000 -> Rp99.000 (one-time)
--   Reseller:       stays Rp149.000 (one-time), commission 30% -> 40%
--   Reseller Brand: Rp99.000/bulan -> Rp59.000/bulan
--   Affiliate:      unchanged (free, 10% commission, see 045) - just gets a
--                    visible card on the homepage now, no backend change.
--
-- This migration only touches the two places the OLD numbers were baked
-- into the database (the sale_amount used for reseller-initiated client
-- sales, and existing resellers' commission_percent). The actual Midtrans
-- checkout amount lives in lib/paymentPackages.ts (code change, not SQL).

-- 1. sale_amount mirrors the Client package price - see 018 for the
--    original version of this function.
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

-- 2. Retroactive commission bump for existing plain-Reseller accounts
--    (owner decision: applies to everyone currently on the 30% default,
--    not just new signups). Deliberately scoped to package = 'reseller'
--    and the exact old default (30) so any reseller the owner manually
--    set to a custom rate is left untouched.
update public.resellers
set commission_percent = 40
where package = 'reseller'
  and commission_percent = 30;
