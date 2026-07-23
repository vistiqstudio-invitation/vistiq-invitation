-- Temporary diagnostic RPC to see exactly what auth.uid()/current_role()/
-- my_client_id()/my_reseller_id() resolve to for a REAL logged-in session,
-- since upload still fails with an RLS violation after 035 despite every
-- static check (policy exists, permissive, data ownership correct) passing.
-- Safe to drop once the upload bug is found - read-only, returns only the
-- caller's own identity, no data leak risk.

create or replace function public.debug_my_context()
returns table (
  uid uuid,
  role_claim text,
  app_role text,
  client_id uuid,
  reseller_id uuid
)
language sql
security definer
stable
set search_path = public
as $$
  select
    auth.uid(),
    auth.role(),
    public.current_role(),
    public.my_client_id(),
    public.my_reseller_id();
$$;

grant execute on function public.debug_my_context() to authenticated;
