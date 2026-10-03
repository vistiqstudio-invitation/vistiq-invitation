-- New commercial model:
-- - Every reseller that already exists at migration time keeps the legacy model.
-- - Every reseller created afterwards pays Rp20.000 per invitation activation.

alter table public.resellers
  add column if not exists billing_model text;

update public.resellers
set billing_model = 'legacy_commission'
where billing_model is null;

alter table public.resellers
  alter column billing_model set default 'per_invitation',
  alter column billing_model set not null;

alter table public.resellers
  drop constraint if exists resellers_billing_model_check;

alter table public.resellers
  add constraint resellers_billing_model_check
  check (billing_model in ('legacy_commission', 'per_invitation'));

alter table public.transactions
  add column if not exists transaction_type text,
  add column if not exists invitation_id bigint;

update public.transactions
set transaction_type = 'legacy_client_sale'
where transaction_type is null;

alter table public.transactions
  alter column transaction_type set default 'legacy_client_sale',
  alter column transaction_type set not null;

alter table public.transactions
  drop constraint if exists transactions_transaction_type_check;

alter table public.transactions
  add constraint transactions_transaction_type_check
  check (transaction_type in ('legacy_client_sale', 'invitation_activation'));

alter table public.transactions
  drop constraint if exists transactions_invitation_id_fkey;

alter table public.transactions
  add constraint transactions_invitation_id_fkey
  foreign key (invitation_id) references public.invitations(id) on delete set null;

create unique index if not exists transactions_one_activation_per_invitation_idx
  on public.transactions (invitation_id)
  where transaction_type = 'invitation_activation' and invitation_id is not null;

create index if not exists transactions_reseller_type_created_idx
  on public.transactions (reseller_id, transaction_type, created_at desc);

create or replace function public.create_reseller_sale_transaction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reseller_package text;
  reseller_billing_model text;
  reseller_share numeric := 80;
  sale_amount numeric;
begin
  if new.reseller_id is null then
    return new;
  end if;

  select r.package, r.billing_model
    into reseller_package, reseller_billing_model
    from public.resellers r
   where r.id = new.reseller_id;

  if reseller_package = 'reseller'
     and reseller_billing_model = 'legacy_commission' then
    sale_amount := greatest(coalesce(new.sale_price, 100000), 1);

    insert into public.transactions (
      client_id, reseller_id, amount, commission, status, transaction_type
    ) values (
      new.id, new.reseller_id, sale_amount,
      round(sale_amount * reseller_share / 100.0), 'pending', 'legacy_client_sale'
    );
  end if;

  return new;
end;
$$;

create or replace function public.enforce_reseller_invitation_activation_state()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('postgres', 'service_role')
     or public.current_role() = 'owner' then
    return new;
  end if;

  if exists (
    select 1
      from public.clients c
      join public.resellers r on r.id = c.reseller_id
     where c.id = new.client_id
       and c.status = 'active'
       and r.billing_model = 'legacy_commission'
       and r.package = 'reseller_brand'
       and r.status = 'active'
       and r.brand_active = true
       and (r.brand_expires_at is null or r.brand_expires_at > now())
  ) then
    new.is_active := true;
  else
    new.is_active := false;
  end if;

  return new;
end;
$$;

create or replace function public.activate_new_brand_client_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
      from public.clients c
      join public.resellers r on r.id = c.reseller_id
     where c.id = new.client_id
       and c.status = 'active'
       and r.billing_model = 'legacy_commission'
       and r.package = 'reseller_brand'
       and r.status = 'active'
       and r.brand_active = true
       and (r.brand_expires_at is null or r.brand_expires_at > now())
  ) then
    new.is_active := true;
  end if;

  return new;
end;
$$;

create or replace function public.set_reseller_transaction_hold_period()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    new.paid_at := coalesce(old.paid_at, new.paid_at, now());
    if new.transaction_type = 'legacy_client_sale' then
      new.available_at := new.paid_at + interval '24 hours';
    else
      new.available_at := null;
      new.commission := 0;
    end if;
  end if;
  return new;
end;
$$;

create schema if not exists private;

create or replace function private.activate_paid_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_client_id uuid;
begin
  if new.transaction_type <> 'invitation_activation'
     or new.status <> 'paid'
     or old.status is not distinct from 'paid' then
    return new;
  end if;

  if new.amount <> 20000 or new.commission <> 0 or new.invitation_id is null then
    raise exception 'Data pembayaran aktivasi undangan tidak valid.';
  end if;

  select i.client_id
    into target_client_id
    from public.invitations i
    join public.clients c on c.id = i.client_id
    join public.resellers r on r.id = c.reseller_id
   where i.id = new.invitation_id
     and c.id = new.client_id
     and r.id = new.reseller_id
     and r.billing_model = 'per_invitation'
     and r.status = 'active'
     and (
       r.package = 'reseller'
       or (
         r.package = 'reseller_brand'
         and r.brand_active = true
         and (r.brand_expires_at is null or r.brand_expires_at > now())
       )
     )
   for update of i;

  if target_client_id is null then
    raise exception 'Undangan tidak memenuhi syarat aktivasi.';
  end if;

  update public.invitations
     set is_active = true
   where id = new.invitation_id;

  update public.clients
     set status = 'active'
   where id = target_client_id;

  return new;
end;
$$;

drop trigger if exists activate_paid_invitation on public.transactions;
create trigger activate_paid_invitation
after update of status on public.transactions
for each row execute function private.activate_paid_invitation();

revoke all on function private.activate_paid_invitation() from public, anon, authenticated;
grant execute on function private.activate_paid_invitation() to service_role;

-- Trigger functions never need to be callable through the Data API.
revoke all on function public.create_reseller_sale_transaction() from public, anon, authenticated;
grant execute on function public.create_reseller_sale_transaction() to service_role;

revoke all on function public.set_reseller_transaction_hold_period() from public, anon, authenticated;
grant execute on function public.set_reseller_transaction_hold_period() to service_role;

comment on column public.resellers.billing_model is
  'legacy_commission preserves the previous commercial rules; per_invitation charges Rp20.000 for each invitation activation.';
comment on column public.transactions.transaction_type is
  'Separates grandfathered reseller client sales from new invitation activation payments.';
