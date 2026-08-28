-- Only temporary tables are written. Existing profiles/clients supply read-only fixtures.
begin;
create temporary table activation_cases (label text, actor uuid, target uuid, allowed boolean) on commit drop;
insert into activation_cases
select 'reseller_own', r.user_id, c.id, false
from public.resellers r join public.profiles p on p.id=r.user_id join public.clients c on c.reseller_id=r.id
where r.package='reseller' and p.role='reseller' limit 1;
insert into activation_cases
select 'brand_own', r.user_id, c.id, true
from public.resellers r join public.profiles p on p.id=r.user_id join public.clients c on c.reseller_id=r.id
where r.package='reseller_brand' and r.status='active' and r.brand_active and (r.brand_expires_at is null or r.brand_expires_at>now()) and p.role='reseller' limit 1;
insert into activation_cases
select 'brand_foreign', b.actor, s.target, false from activation_cases b cross join activation_cases s where b.label='brand_own' and s.label='reseller_own';
insert into activation_cases
select 'client_own', c.user_id, c.id, false from public.clients c join public.profiles p on p.id=c.user_id where p.role='client' limit 1;
insert into activation_cases
select 'owner', p.id, c.target, true from public.profiles p cross join activation_cases c where p.role='owner' and c.label='reseller_own' limit 1;
insert into activation_cases select 'no_user', null, target, false from activation_cases where label='reseller_own';
create temporary table activation_probe (id integer primary key, client_id uuid, is_active boolean, note text) on commit drop;
create trigger probe_insert before insert on activation_probe for each row execute function public.enforce_reseller_invitation_payment_state();
create trigger probe_update before update on activation_probe for each row execute function public.guard_invitations_privileged_columns();
grant select on activation_cases to authenticated;
grant select,insert,update,delete on activation_probe to authenticated;
set local role authenticated;
do $$
declare
  testcase record;
  actual boolean;
  actual_client uuid;
  actual_note text;
begin
  if (select count(*) from activation_cases) <> 6 then raise exception 'Missing verification fixtures'; end if;
  for testcase in select * from activation_cases loop
    perform set_config('request.jwt.claim.sub', coalesce(testcase.actor::text,''),true);
    perform set_config('request.jwt.claims', json_build_object('sub',testcase.actor,'role','authenticated')::text,true);
    insert into activation_probe values(1,testcase.target,true,'initial');
    select is_active into actual from activation_probe where id=1;
    if actual is distinct from testcase.allowed then raise exception 'INSERT assertion failed: %',testcase.label; end if;
    delete from activation_probe;
    insert into activation_probe values(1,testcase.target,false,'initial');
    update activation_probe set is_active=true, note='edited' where id=1;
    select is_active,note into actual,actual_note from activation_probe where id=1;
    if actual is distinct from testcase.allowed then raise exception 'UPDATE assertion failed: %',testcase.label; end if;
    if actual_note <> 'edited' then raise exception 'Content edit assertion failed: %',testcase.label; end if;
    update activation_probe set client_id=null where id=1;
    select client_id into actual_client from activation_probe where id=1;
    if testcase.label='owner' then
      if actual_client is not null then raise exception 'Owner reassignment failed'; end if;
    elsif actual_client is distinct from testcase.target then raise exception 'Client reassignment bypass: %',testcase.label;
    end if;
    delete from activation_probe;
    insert into activation_probe values(1,null,true,'null client');
    select is_active into actual from activation_probe where id=1;
    if actual is distinct from (testcase.label='owner') then raise exception 'NULL client assertion failed: %',testcase.label; end if;
    delete from activation_probe;
  end loop;
end;
$$;
reset role;
select label, 'PASS: insert, update, content edit, client ownership, null client' as result from activation_cases order by label;
commit;
