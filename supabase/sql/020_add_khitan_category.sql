-- Adds a third invitation category, "khitan" (circumcision celebration),
-- alongside 'wedding' and 'aqiqah' (see 019_add_aqiqah_category.sql).
--
-- No new columns needed - khitan invitations reuse the exact same generic
-- columns aqiqah already added: baby_name (the child being celebrated),
-- father_name/mother_name, birth_date/birth_place (optional context),
-- aqiqah_date/aqiqah_time/aqiqah_location (reused generically as "the
-- occasion's date/time/location" - not aqiqah-specific despite the column
-- name), plus the existing cover_photo/gallery/gift columns.

alter table public.invitations
  drop constraint if exists invitations_category_check;

alter table public.invitations
  add constraint invitations_category_check
  check (category in ('wedding', 'aqiqah', 'khitan'));
