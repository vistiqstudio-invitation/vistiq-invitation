create or replace function public.check_verified_media_cleanup_refs()
returns table (name text, bytes bigint, referenced boolean)
language plpgsql security definer set search_path = '' as $refs$
begin
if auth.uid() is null or public."current_role"() is distinct from 'owner' then
raise exception 'Owner access required' using errcode='42501';
end if;
return query
with live_data as (
select pg_catalog.to_jsonb(i)::text as document from public.invitations i
union all select pg_catalog.to_jsonb(r)::text from public.resellers r
union all select pg_catalog.to_jsonb(g)::text from public.gallery g
union all select pg_catalog.to_jsonb(b)::text from public.bank_accounts b
)
select m.name,m.bytes,exists(select 1 from live_data d where pg_catalog.strpos(d.document,m.source_url)>0)
from vistiq_recovery_20261105.verified_media m;
end;
$refs$;
revoke all on function public.check_verified_media_cleanup_refs() from public,anon;
grant execute on function public.check_verified_media_cleanup_refs() to authenticated;
create trigger normalize_verified_reseller_media before insert or update on public.resellers
for each row execute function vistiq_recovery_20261105.normalize_verified_invitation_media();
create trigger normalize_verified_gallery_media before insert or update on public.gallery
for each row execute function vistiq_recovery_20261105.normalize_verified_invitation_media();
create trigger normalize_verified_bank_media before insert or update on public.bank_accounts
for each row execute function vistiq_recovery_20261105.normalize_verified_invitation_media();
