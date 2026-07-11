-- invitations.client_id has never had a real foreign key to clients.id -
-- it's just a plain uuid column that happens to hold matching values.
-- lib/invitation.ts's getInvitationBySlug() relies on PostgREST's
-- relationship embedding (`clients:client_id(...)`) to pull reseller brand
-- info for the public invitation page, and that embed syntax requires a
-- declared FK to resolve. Without it, PostgREST returns PGRST200 and the
-- whole query errors out, which getInvitationBySlug() treats as "not
-- found" - so every single invitation's public/preview page 404s.
-- Verified no orphaned client_id values exist before adding this.

alter table public.invitations
  add constraint invitations_client_id_fkey
  foreign key (client_id) references public.clients (id) on delete set null;
