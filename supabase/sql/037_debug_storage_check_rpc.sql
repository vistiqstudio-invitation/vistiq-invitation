-- Replicates the exact EXISTS condition inside
-- "invitation_photos_upload_client" (031), but as a callable function that
-- runs WITHOUT security definer (i.e. as the calling user, same RLS context
-- a storage policy actually evaluates under) - unlike my_client_id() etc
-- which are security definer and bypass RLS on clients/profiles entirely.
-- The theory: the storage policy's EXISTS subquery reads public.invitations
-- and public.clients directly, so THEIR OWN RLS policies apply to the
-- calling user too, not just the top-level check. This isolates whether
-- the invitation row itself, the joined client row, or the final combined
-- condition is what's actually failing.

create or replace function public.debug_storage_check(p_invitation_id text)
returns table (
  invitation_visible boolean,
  client_visible_via_join boolean,
  final_check boolean
)
language sql
stable
set search_path = public
as $$
  select
    exists(
      select 1 from public.invitations i
      where i.id::text = p_invitation_id
    ) as invitation_visible,
    exists(
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = p_invitation_id
    ) as client_visible_via_join,
    exists(
      select 1 from public.invitations i
      join public.clients c on c.id = i.client_id
      where i.id::text = p_invitation_id
        and c.user_id = auth.uid()
    ) as final_check;
$$;

grant execute on function public.debug_storage_check(text) to authenticated;
