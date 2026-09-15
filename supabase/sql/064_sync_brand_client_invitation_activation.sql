-- Keep a Mitra Brand client's account and invitations active together.
-- Existing mismatches are repaired, and future invitations inherit the
-- active state when they belong to an active Mitra Brand client.

-- The legacy guards used the application role only. Server-side activation
-- runs as service_role, so the guard silently restored is_active to its old
-- value even though the API returned success.
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

  if exists (
    select 1
    from public.clients c
    join public.resellers r on r.id = c.reseller_id
    where c.id = new.client_id
      and c.status = 'active'
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
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.clients c
    join public.resellers r on r.id = c.reseller_id
    where c.id = new.client_id
      and c.status = 'active'
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

revoke all on function public.activate_new_brand_client_invitation() from public, anon, authenticated;

drop trigger if exists activate_new_brand_client_invitation on public.invitations;
create trigger activate_new_brand_client_invitation
before insert or update of client_id on public.invitations
for each row
execute function public.activate_new_brand_client_invitation();

update public.invitations i
set is_active = true
where i.is_active is distinct from true
  and exists (
    select 1
    from public.clients c
    join public.resellers r on r.id = c.reseller_id
    where c.id = i.client_id
      and c.status = 'active'
      and r.package = 'reseller_brand'
      and r.status = 'active'
      and r.brand_active = true
      and (r.brand_expires_at is null or r.brand_expires_at > now())
  );
