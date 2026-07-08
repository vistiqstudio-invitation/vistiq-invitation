-- rsvp_wishes never had an invitation_id column, so RSVPs/wishes from
-- different invitations could never be scoped to the invitation they
-- belong to. Add it (nullable, since 1 existing demo row predates this).

alter table public.rsvp_wishes
  add column if not exists invitation_id bigint references public.invitations (id) on delete cascade;

create index if not exists rsvp_wishes_invitation_id_idx
  on public.rsvp_wishes (invitation_id);
