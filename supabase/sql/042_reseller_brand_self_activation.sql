-- Reseller Brand (white-label, package = 'reseller_brand') resellers pay
-- Vistiq 100% upfront for the tier itself and keep 100% of what they charge
-- their own end clients - unlike a commission-split reseller, there's no
-- "did the client actually pay the reseller" question for Vistiq/owner to
-- gate before an invitation goes live. Lets a Reseller Brand reseller whose
-- brand_active is true (owner-approved, see 009/admin/resellers toggle)
-- activate/deactivate invitations for their OWN clients themselves, same
-- control the admin invitations page already has. Ordinary commission
-- resellers are unaffected - they still go through owner confirmation
-- (admin/transactions or admin/invitations), same as before 032.
--
-- client_id reassignment stays owner-only for everyone - this migration
-- only widens the is_active branch of 032's guard trigger.

create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_reseller_brand_owner boolean;
begin
  if public.current_role() is distinct from 'owner' then
    select exists (
      select 1 from public.clients c
      join public.resellers r on r.id = c.reseller_id
      where c.id = old.client_id
        and r.id = public.my_reseller_id()
        and r.package = 'reseller_brand'
        and r.brand_active = true
    ) into is_reseller_brand_owner;

    if new.is_active is distinct from old.is_active and not is_reseller_brand_owner then
      new.is_active := old.is_active;
    end if;

    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

-- DELETE had no reseller path at all (invitations_delete_owner is
-- owner-only) - adds one scoped identically to the activation check above,
-- so a Reseller Brand reseller can also remove their own client's
-- invitation from their own dashboard.
drop policy if exists "invitations_delete_reseller_brand" on public.invitations;
create policy "invitations_delete_reseller_brand"
  on public.invitations for delete
  using (
    exists (
      select 1 from public.clients c
      join public.resellers r on r.id = c.reseller_id
      where c.id = invitations.client_id
        and r.id = public.my_reseller_id()
        and r.package = 'reseller_brand'
        and r.brand_active = true
    )
  );
