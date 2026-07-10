-- Tracks which of the two paid reseller tiers a reseller is on:
-- 'reseller'       - Rp 149.000/bulan, sells under the Vistiq Invitation
--                    brand, earns commission_percent (30%) per sale.
-- 'reseller_brand' - Rp 299.000/bulan, white-label (own brand_name/logo/
--                    color, gated by brand_active - see 009), keeps 100%
--                    of what they charge their own clients.
--
-- The Rp 99.000 "Client" package (someone who just wants one invitation,
-- not a reseller) has no reseller row at all - it's a plain clients row
-- created directly by the owner, so it isn't represented here.

alter table public.resellers add column if not exists package text not null default 'reseller';

alter table public.resellers drop constraint if exists resellers_package_check;
alter table public.resellers add constraint resellers_package_check
  check (package in ('reseller', 'reseller_brand'));
