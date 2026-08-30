-- Keep the legacy reseller notification RPC available to signed-in resellers
-- while removing its unnecessary anonymous/public execute grants.

revoke all on function public.confirm_payment_notification(uuid) from public, anon;
grant execute on function public.confirm_payment_notification(uuid) to authenticated;
