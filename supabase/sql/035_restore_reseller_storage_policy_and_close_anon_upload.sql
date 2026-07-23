-- Part 1: "invitation_photos_upload_reseller" / "invitation_photos_update_reseller"
-- (originally added in 013) turned out to be entirely missing from production -
-- a pg_policies sweep of storage.objects showed every other storage policy this
-- project ever defined, but not these two. Re-creating (idempotent) is what
-- fixes "Upload gagal: new row violates row-level security policy" that a
-- reseller hit on both photo and music uploads at /reseller/invitations/[id].

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

-- Part 2: SECURITY FIX. The same pg_policies sweep that found the missing
-- reseller policies above also turned up two policies never defined in any
-- migration file in this project - "Public upload invitation assets" (INSERT)
-- and "Public update invitation assets" (UPDATE), both granted to the `anon`
-- role with with_check = (bucket_id = 'invitation-assets') and NO other
-- condition. That let anyone on the internet, without logging in, upload new
-- files into this bucket or overwrite any existing file in it (any client's
-- cover/gallery/music, any reseller's logo) at any path they guessed or
-- enumerated. Every real upload path in the app code (client/edit,
-- admin/reseller invitation editors) sits behind an authenticated,
-- role-checked dashboard route and is already covered by the properly-scoped
-- policies above plus 010/021/029/031 - nothing in the app needs anonymous
-- write access to this bucket, so these are dropped outright.

drop policy if exists "Public upload invitation assets" on storage.objects;
drop policy if exists "Public update invitation assets" on storage.objects;
