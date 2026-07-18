-- The 013 policy only lets an owner upload invitation photos when the
-- invitation has a client_id that joins to a client row (INNER JOIN), so
-- it silently fails for invitations the owner creates directly in
-- /admin/invitations without assigning a client ("Tanpa client - dibuat
-- manual"). This adds an owner-only policy with no join requirement, so
-- the owner can upload/update photos for any invitation folder.

drop policy if exists "invitation_photos_upload_owner" on storage.objects;
create policy "invitation_photos_upload_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'invitation-assets'
    and public.current_role() = 'owner'
  );

drop policy if exists "invitation_photos_update_owner" on storage.objects;
create policy "invitation_photos_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'invitation-assets'
    and public.current_role() = 'owner'
  );
