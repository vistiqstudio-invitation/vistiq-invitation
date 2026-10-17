-- Mitra Brand now uses the same Rp20.000 Midtrans activation flow as
-- standard Reseller accounts. Existing live invitations stay live; only
-- future/inactive invitations require a successful activation payment.

update public.resellers
set billing_model = 'per_invitation'
where package = 'reseller_brand'
  and billing_model is distinct from 'per_invitation';

-- Remove the legacy Mitra Brand behavior that automatically published a new
-- invitation as soon as it was attached to an active brand client.
drop trigger if exists activate_new_brand_client_invitation on public.invitations;

-- New invitations created from reseller dashboards must remain drafts until
-- the trusted server activates them after a successful Midtrans settlement.
create or replace function public.enforce_reseller_invitation_activation_state()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('postgres', 'service_role')
     or public.current_role() = 'owner' then
    return new;
  end if;

  new.is_active := false;
  return new;
end;
$$;

-- Prevent both standard Reseller and Mitra Brand browser sessions from
-- bypassing the payment gate by directly changing is_active.
create or replace function public.guard_invitations_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('postgres', 'service_role')
     and public.current_role() is distinct from 'owner' then
    if new.is_active is distinct from old.is_active then
      new.is_active := old.is_active;
    end if;
    if new.client_id is distinct from old.client_id then
      new.client_id := old.client_id;
    end if;
  end if;
  return new;
end;
$$;

-- Reuse the existing transaction trigger. It now accepts both standard
-- Reseller and an active Mitra Brand account using per-invitation billing.
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
