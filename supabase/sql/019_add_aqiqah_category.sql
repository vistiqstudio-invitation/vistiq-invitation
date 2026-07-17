-- Adds support for a second invitation category ("aqiqah") alongside the
-- existing wedding invitations, on the SAME `invitations` table (matching
-- this table's existing pattern of accumulating nullable columns rather
-- than splitting into per-category tables - see the comment atop
-- lib/invitation.ts normalizeInvitation()).
--
-- 'wedding' rows (the existing default) keep using groom_*/bride_*/
-- akad_*/resepsi_* columns as before. 'aqiqah' rows use the new columns
-- below instead, and reuse the existing generic columns that already work
-- for either category: slug, theme, is_active, cover_photo, gallery_photos/
-- gallery_1..6, music_url, maps_url, youtube_url, and the neutral
-- gift_bank_name/gift_account_number/gift_account_name columns (aqiqah has
-- one kado account, not a per-person pair like groom_bank_*/bride_bank_*).

alter table public.invitations
  add column if not exists category text not null default 'wedding';

alter table public.invitations
  add constraint invitations_category_check
  check (category in ('wedding', 'aqiqah'));

alter table public.invitations
  add column if not exists baby_name text,
  add column if not exists baby_gender text check (baby_gender in ('L', 'P')),
  add column if not exists father_name text,
  add column if not exists mother_name text,
  add column if not exists birth_date date,
  add column if not exists birth_place text,
  add column if not exists aqiqah_date date,
  add column if not exists aqiqah_time text,
  add column if not exists aqiqah_location text;
