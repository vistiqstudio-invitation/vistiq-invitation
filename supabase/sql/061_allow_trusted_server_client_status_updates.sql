-- Allow authenticated server-side administration to update protected client fields.
-- Browser roles remain guarded and cannot bypass the reseller/client ownership flow.

create or replace function public.guard_clients_privileged_columns()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
begin
  if current_user not in ('postgres', 'service_role')
     and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
     and public.current_role() is distinct from 'owner' then
    if new.reseller_id is distinct from old.reseller_id then
      new.reseller_id := old.reseller_id;
    end if;
    if new.user_id is distinct from old.user_id then
      new.user_id := old.user_id;
    end if;
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$function$;
