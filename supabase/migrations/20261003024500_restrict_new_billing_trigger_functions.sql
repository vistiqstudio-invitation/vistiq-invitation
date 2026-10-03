-- Trigger functions are invoked internally by PostgreSQL and must not be
-- exposed as executable RPC functions to anonymous or authenticated users.
revoke all on function public.create_reseller_sale_transaction() from public, anon, authenticated;
grant execute on function public.create_reseller_sale_transaction() to service_role;

revoke all on function public.set_reseller_transaction_hold_period() from public, anon, authenticated;
grant execute on function public.set_reseller_transaction_hold_period() to service_role;
