-- SECURITY FIX (platform-wide audit, real customers are live via paid ads):
--
-- 1. invitations_update (002) checks row ownership but not which columns
--    change - any reseller/client can PATCH their own invitation's
--    is_active straight through the Supabase REST API with their own
--    login token, bypassing the "owner manually activates after
--    confirming payment" gate entirely (the same class of bug 026 fixed
--    for resellers/clients, just never applied to invitations). Locks
--    is_active and client_id (reassigning an invitation to a different
--    client) for non-owner writes, mirroring 026's guard-trigger pattern.
--
-- 2. invitations_select_public / rsvp_wishes_select_public (002) both use
--    `using (true)` - completely unscoped. Anyone, unauthenticated, can
--    GET /rest/v1/invitations?select=* and dump every customer's data
--    including gift bank account numbers, for DRAFT/unpaid invitations
--    too (is_active = false), not just the live ones meant to be public
--    via their slug. Same for rsvp_wishes across every invitation on the
--    platform at once. Scopes both to only the invitation being active -
--    that's the actual intended "public" boundary (a live invitation
--    page is meant to be open to anyone with the link; a draft one
--    someone is still building, or one still awaiting payment
--    confirmation, is not).
--
-- 3. checkout_orders had no policy letting a client read their own row at
--    all (only owner could select). Adds one scoped to auth_user_id, so
--    the client-creates-own-invitation flow (app/client/edit/page.tsx)
--    can check "did I actually come from a completed Midtrans payment?"
--    before deciding whether to auto-activate - the real fix for
--    is_active being set unconditionally true in that flow today, which
--    let clients added manually by a reseller (bank-transfer path, not
--    necessarily paid yet) get an instantly-live invitation.

create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_role() is distinct from 'owner' then
    if new.is_active is distinct from old.is_active then
      new.is_active := old.is_active;
    end if;
    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_invitations_privileged_columns on public.invitations;
create trigger guard_invitations_privileged_columns
  before update on public.invitations
  for each row execute function public.guard_invitations_privileged_columns();

drop policy if exists "invitations_select_public" on public.invitations;
create policy "invitations_select_public"
  on public.invitations for select
  using (
    is_active = true
    or public.current_role() = 'owner'
    or client_id = public.my_client_id()
    or client_id in (
      select id from public.clients where reseller_id = public.my_reseller_id()
    )
  );

drop policy if exists "rsvp_wishes_select_public" on public.rsvp_wishes;
create policy "rsvp_wishes_select_public"
  on public.rsvp_wishes for select
  using (
    exists (
      select 1 from public.invitations i
      where i.id = rsvp_wishes.invitation_id
        and (
          i.is_active = true
          or public.current_role() = 'owner'
          or i.client_id = public.my_client_id()
          or i.client_id in (
            select id from public.clients where reseller_id = public.my_reseller_id()
          )
        )
    )
  );

drop policy if exists "checkout_orders_client_select_own" on public.checkout_orders;
create policy "checkout_orders_client_select_own"
  on public.checkout_orders for select
  to authenticated
  using (auth_user_id = auth.uid());
