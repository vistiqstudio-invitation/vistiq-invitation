-- Reseller Brand resellers keep 100% of what they charge their own client
-- (no commission, unlike the flat-fee 'reseller' package - see
-- 012_reseller_sales_and_commission.sql / 018_update_client_price_to_149k.sql).
-- Until now there was nowhere to actually record what price they chose, so
-- their dashboard could only show aspirational copy. This lets them set and
-- edit their own client-facing price per invitation.
alter table public.invitations add column if not exists client_price numeric;

comment on column public.invitations.client_price is
  'Price the reseller charges their own client for this invitation, set by the reseller themselves. Only used by reseller_brand package resellers (who keep 100%, no commission tracked in transactions). Null/unset for everything else.';
