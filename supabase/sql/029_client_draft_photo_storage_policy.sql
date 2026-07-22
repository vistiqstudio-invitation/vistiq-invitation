-- A client self-creating their own invitation (new /client/edit "buat
-- undangan" flow) needs to upload photos BEFORE the invitation row exists,
-- so there's no invitation id yet to scope the storage path to. Mirrors
-- 013's reseller-drafts approach: uploads land under
-- clients/<their own client id>/drafts/... until the invitation is saved,
-- same pattern already used for resellers (010) and reseller invitation
-- drafts (013).

create policy "client_upload_own_draft"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = 'clients'
    and (storage.foldername(name))[2] = (
      select id::text from public.clients where user_id = auth.uid()
    )
  );
