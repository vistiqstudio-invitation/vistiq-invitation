-- ROOT CAUSE FOUND after extensive debugging (see the session's debug_*
-- RPCs): every storage.objects policy that does a raw JOIN/SELECT against
-- another RLS-protected table (invitations/clients/resellers) inside its
-- WITH CHECK silently fails the insert, even when the exact same boolean
-- expression evaluates to true as a plain SELECT run in the same
-- transaction/auth context right before it. This is a Postgres RLS
-- nested-policy-evaluation issue, not a logic bug in any of these
-- policies - confirmed by a bisection test where a trivial WITH CHECK
-- with zero cross-table references succeeded while the real one, with
-- identical inputs, failed.
--
-- The fix: never touch an RLS-protected table directly from inside a
-- storage.objects policy. Route every such check through a SECURITY
-- DEFINER function instead (same pattern current_role()/my_client_id()/
-- my_reseller_id() already use) - those bypass RLS internally by design,
-- which sidesteps this Postgres behavior entirely rather than working
-- around it.
--
-- This explains BOTH bugs chased this session: the reseller upload
-- failure (013's policy has the same raw-join pattern as 031's) and the
-- client upload failure that 031 was supposed to fix but didn't, because
-- restoring the policy's *text* didn't change that its *shape* was the
-- thing silently failing.

create or replace function public.owns_invitation(p_invitation_id text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1 from public.invitations i
    where i.id::text = p_invitation_id
      and (
        public.current_role() = 'owner'
        or i.client_id = public.my_client_id()
        or i.client_id in (
          select id from public.clients where reseller_id = public.my_reseller_id()
        )
      )
  );
$$;

grant execute on function public.owns_invitation(text) to authenticated;

-- 031: client's own invitation photo/music upload
drop policy if exists "invitation_photos_upload_client" on storage.objects;
create policy "invitation_photos_upload_client"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and public.owns_invitation((storage.foldername(name))[1])
  );

drop policy if exists "invitation_photos_update_client" on storage.objects;
create policy "invitation_photos_update_client"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invitation-assets'
    and public.owns_invitation((storage.foldername(name))[1])
  );

-- 013: reseller uploading photos for their own clients' invitations
drop policy if exists "invitation_photos_upload_reseller" on storage.objects;
create policy "invitation_photos_upload_reseller"
  on storage.objects for insert
  with check (
    bucket_id = 'invitation-assets'
    and public.owns_invitation((storage.foldername(name))[1])
  );

drop policy if exists "invitation_photos_update_reseller" on storage.objects;
create policy "invitation_photos_update_reseller"
  on storage.objects for update
  using (
    bucket_id = 'invitation-assets'
    and public.owns_invitation((storage.foldername(name))[1])
  );

-- 029: client uploading draft photos before their invitation row exists
drop policy if exists "client_upload_own_draft" on storage.objects;
create policy "client_upload_own_draft"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'clients'
    and (storage.foldername(name))[2] = public.my_client_id()::text
  );

-- 010: reseller uploading their own white-label logo
drop policy if exists "reseller_upload_own_logo" on storage.objects;
create policy "reseller_upload_own_logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'resellers'
    and (storage.foldername(name))[2] = public.my_reseller_id()::text
  );

drop policy if exists "reseller_update_own_logo" on storage.objects;
create policy "reseller_update_own_logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'resellers'
    and (storage.foldername(name))[2] = public.my_reseller_id()::text
  );
