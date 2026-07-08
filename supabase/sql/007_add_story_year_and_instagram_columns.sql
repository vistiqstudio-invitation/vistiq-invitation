-- Adds the small label/year field for each Love Story milestone, and
-- Instagram handles for bride/groom, so the client edit form can capture
-- everything the premium theme is able to display.

alter table public.invitations add column if not exists story_1_year text;
alter table public.invitations add column if not exists story_2_year text;
alter table public.invitations add column if not exists story_3_year text;

alter table public.invitations add column if not exists groom_instagram text;
alter table public.invitations add column if not exists bride_instagram text;
