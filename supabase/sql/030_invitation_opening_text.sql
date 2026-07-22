-- Lets reseller/client/admin override each invitation's opening greeting
-- block (eyebrow + title paragraph + courtesy description + verse/quote).
-- All nullable: null means "use this theme's own hardcoded default text",
-- which every theme component already falls back to.
alter table public.invitations
  add column if not exists opening_greeting text,
  add column if not exists opening_title text,
  add column if not exists opening_description text,
  add column if not exists opening_quote text,
  add column if not exists opening_quote_source text;
