alter table public.invitations
  drop constraint if exists invitations_category_check;

alter table public.invitations
  add constraint invitations_category_check
  check (category in ('wedding', 'aqiqah', 'khitan', 'birthday'));

comment on column public.invitations.category is
  'Invitation occasion: wedding, aqiqah, khitan, or birthday. Birthday reuses the child, parent, event, gallery, and gift columns.';
