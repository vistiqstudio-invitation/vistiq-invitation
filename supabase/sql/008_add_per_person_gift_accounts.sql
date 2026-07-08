-- Supports one gift/bank account per person (groom + bride) instead of a
-- single shared account. The old gift_bank_name/gift_account_number/
-- gift_account_name (and legacy bank_name/bank_account/bank_holder)
-- columns are kept as-is and treated as the groom's account by the
-- normalizer if groom_bank_name is empty, so existing data isn't lost.

alter table public.invitations add column if not exists groom_bank_name text;
alter table public.invitations add column if not exists groom_bank_account text;
alter table public.invitations add column if not exists groom_bank_holder text;

alter table public.invitations add column if not exists bride_bank_name text;
alter table public.invitations add column if not exists bride_bank_account text;
alter table public.invitations add column if not exists bride_bank_holder text;
