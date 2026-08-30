-- Ensure the reseller-owned client status guard is attached to the table.
-- This is separate from 058 so existing databases receive the trigger even
-- when 058 has already been applied.

drop trigger if exists guard_clients_privileged_columns on public.clients;
create trigger guard_clients_privileged_columns
  before update of reseller_id, user_id, status on public.clients
  for each row execute function public.guard_clients_privileged_columns();
