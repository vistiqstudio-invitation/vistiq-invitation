-- Optional short/display names for wedding couple sections.
-- Existing invitations keep the current first-name fallback when these are empty.
alter table public.invitations
  add column if not exists groom_nickname text,
  add column if not exists bride_nickname text;
