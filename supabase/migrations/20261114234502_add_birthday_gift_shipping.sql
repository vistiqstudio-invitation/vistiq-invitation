alter table public.invitations
  add column if not exists birthday_gift_recipient text,
  add column if not exists birthday_gift_address text;
alter table public.invitations add constraint invitations_birthday_gift_complete check (
  (birthday_gift_recipient is null and birthday_gift_address is null)
  or (
    birthday_gift_recipient is not null and birthday_gift_address is not null
    and length(btrim(birthday_gift_recipient)) between 1 and 120
    and length(btrim(birthday_gift_address)) between 1 and 800
  )
);
