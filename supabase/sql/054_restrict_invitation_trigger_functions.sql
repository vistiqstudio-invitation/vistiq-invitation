-- These functions are trigger implementation details, not public RPCs.
-- Removing direct execution closes a route that could otherwise expose
-- privileged SECURITY DEFINER code through the Data API.
revoke all on function public.guard_invitations_privileged_columns() from public, anon, authenticated;
revoke all on function public.activate_invitations_on_payment() from public, anon, authenticated;
revoke all on function public.enforce_reseller_invitation_payment_state() from public, anon, authenticated;
