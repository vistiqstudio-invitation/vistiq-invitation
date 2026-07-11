-- Lets a reseller upload cover/groom/bride/gallery photos for invitations
-- that belong to their own clients (used by the new "Lengkapi Data" full
-- editor in the reseller dashboard). Mirrors whatever policy already lets
-- a client upload to their own invitation's folder, but scoped through
-- clients.reseller_id instead of clients.user_id. Owner is included too
-- for completeness.

drop policy if exists "invitation_photos_upload_reseller" on storage.objects;
create policy "invitation_photos_upload_reseller"
  on storage.objects for insert
  with check (
    bucket_id = 'invitation-assets'
    and exists (
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = (storage.foldername(name))[1]
        and (public.current_role() = 'owner' or c.reseller_id = public.my_reseller_id())
    )
  );

drop policy if exists "invitation_photos_update_reseller" on storage.objects;
create policy "invitation_photos_update_reseller"
  on storage.objects for update
  using (
    bucket_id = 'invitation-assets'
    and exists (
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = (storage.foldername(name))[1]
        and (public.current_role() = 'owner' or c.reseller_id = public.my_reseller_id())
    )
  );
