-- Public invitations need a boolean without granting access to client rows.
create or replace function public.invitation_has_vistiq_footer(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.invitations as invitation
    left join public.clients as client on client.id = invitation.client_id
    where invitation.slug = p_slug
      and invitation.is_active is true
      and (
        invitation.client_id is null
        or (client.id is not null and client.reseller_id is null)
      )
  );
$$;

revoke all on function public.invitation_has_vistiq_footer(text) from public;
grant execute on function public.invitation_has_vistiq_footer(text) to anon, authenticated;
