-- Affiliate commission was wrongly set to 30% in three places (the DB
-- column default, the approval insert in app/api/admin/affiliates/route.ts,
-- and the webhook that creates affiliate_commissions rows) - it should be
-- 10%, same rate mentioned everywhere on the marketing/dashboard copy.
-- Zero affiliate_commissions rows exist yet (confirmed before writing this),
-- so correcting existing affiliates.commission_percent here doesn't touch
-- any already-computed/paid-out commission.

alter table public.affiliates alter column commission_percent set default 10;

-- guard_affiliate_privileged_columns (043) reverts any change to
-- commission_percent unless current_role() = 'owner', which reads
-- profiles.role via auth.uid() - running this UPDATE from the SQL Editor
-- has no auth.uid() at all, so the trigger silently reverts it back to 30
-- before the row is written. Disable it for just this one correction.
alter table public.affiliates disable trigger guard_affiliate_privileged_columns;
update public.affiliates set commission_percent = 10 where commission_percent = 30;
alter table public.affiliates enable trigger guard_affiliate_privileged_columns;
