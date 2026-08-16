-- Add two optional Love Story entries so wedding invitations can contain
-- between one and five story moments. Existing invitations remain unchanged.
alter table public.invitations
  add column if not exists story_4_year text,
  add column if not exists story_4_title text,
  add column if not exists story_4_desc text,
  add column if not exists story_5_year text,
  add column if not exists story_5_title text,
  add column if not exists story_5_desc text;
