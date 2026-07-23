-- 029 only let a client upload to the DRAFT path (clients/<id>/drafts/...)
-- used before their invitation row exists. Once the invitation is created
-- and the client goes back to /client/edit to change a photo, the upload
-- path switches to {invitationId}/... (see uploadToStorage in
-- app/client/edit/page.tsx) - a path no policy covered, so every re-upload
-- after first creation silently failed with "Upload gagal. Cek policy
-- Storage Supabase." Mirrors 013's reseller pattern, scoped through
-- clients.user_id instead of clients.reseller_id.

drop policy if exists "invitation_photos_upload_client" on storage.objects;
create policy "invitation_photos_upload_client"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and exists (
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = (storage.foldername(name))[1]
        and c.user_id = auth.uid()
    )
  );

drop policy if exists "invitation_photos_update_client" on storage.objects;
create policy "invitation_photos_update_client"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invitation-assets'
    and exists (
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = (storage.foldername(name))[1]
        and c.user_id = auth.uid()
    )
  );
