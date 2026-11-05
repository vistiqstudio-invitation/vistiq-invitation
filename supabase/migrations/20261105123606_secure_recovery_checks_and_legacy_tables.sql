-- Keep historical invitation data and asset chunks out of the public Data API.
alter table public.invitation_media_r2_backup_20261016 enable row level security;
revoke all on public.invitation_media_r2_backup_20261016 from public, anon, authenticated;
alter table public.theme_asset_chunks enable row level security;
revoke all on public.theme_asset_chunks from public, anon, authenticated;
-- The existing SECURITY DEFINER get_theme_asset_base64 RPC remains available
-- to serve public theme assets, without granting direct table writes.

create or replace function public.get_verified_media_cleanup_status()
returns table (name text, bytes bigint, referenced boolean, source_exists boolean)
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
  select m.name, m.bytes,
    exists(select 1 from live_data d where pg_catalog.strpos(d.document,m.source_url)>0),
    exists(select 1 from storage.objects o where o.bucket_id='invitation-assets' and o.name=m.name)
  from vistiq_recovery_20261105.verified_media m;
end;
$refs$;
revoke all on function public.get_verified_media_cleanup_status() from public, anon;
grant execute on function public.get_verified_media_cleanup_status() to authenticated;
