-- Optional display/call name for khitan invitations.
-- The existing baby_name remains the full legal/formal name; null keeps the
-- existing theme fallback (last word of the full name) for older invitations.
alter table public.invitations
  add column if not exists child_nickname text;
