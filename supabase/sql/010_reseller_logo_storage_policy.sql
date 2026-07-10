-- Lets a reseller upload their own white-label logo into the
-- invitation-assets bucket, under resellers/<their reseller id>/...
-- The existing client photo-upload policy on this bucket only covers
-- paths owned by a client's invitation, so logo uploads to a
-- resellers/... path were being rejected with no matching policy.

drop policy if exists "reseller_upload_own_logo" on storage.objects;
create policy "reseller_upload_own_logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'resellers'
    and (storage.foldername(name))[2] = (
      select id::text from public.resellers where user_id = auth.uid()
    )
  );

drop policy if exists "reseller_update_own_logo" on storage.objects;
create policy "reseller_update_own_logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'resellers'
    and (storage.foldername(name))[2] = (
      select id::text from public.resellers where user_id = auth.uid()
    )
  );
