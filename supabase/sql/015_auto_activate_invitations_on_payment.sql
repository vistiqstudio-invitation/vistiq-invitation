-- Reseller-created invitations now default to inactive (is_active = false)
-- until payment is confirmed - see app/reseller/invitations/page.tsx, which
-- no longer lets the reseller flip that switch themselves. Payment is a
-- manual bank transfer to the owner's account, confirmed by the owner in
-- app/admin/transactions/page.tsx (status dropdown -> "Dibayar"). This
-- trigger is what turns that one click into "every invitation for that
-- client is now live" automatically, instead of the owner having to jump
-- to the invitations page and flip each one by hand.
--
-- Admin/owner can still manually activate or deactivate any invitation at
-- any time from admin/invitations - that path is untouched.

create or replace function public.activate_invitations_on_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'paid'
     and old.status is distinct from 'paid'
     and new.client_id is not null then
    update public.invitations
    set is_active = true
    where client_id = new.client_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_transaction_paid_activate_invitations on public.transactions;
create trigger on_transaction_paid_activate_invitations
  after update on public.transactions
  for each row execute function public.activate_invitations_on_payment();
