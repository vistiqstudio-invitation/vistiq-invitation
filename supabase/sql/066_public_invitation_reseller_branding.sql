-- Expose only the active brand identity needed by a published invitation.
-- This avoids relying on nested reseller reads that anonymous visitors cannot access under RLS.
create or replace function public.get_invitation_brand_by_slug(p_slug text)
returns table (
  brand_name text,
  logo_url text,
  brand_color text
)
language sql
security definer
stable
set search_path = public
as $$
  select r.brand_name, r.logo_url, r.brand_color
  from public.invitations i
  join public.clients c on c.id = i.client_id
  join public.resellers r on r.id = c.reseller_id
  where i.slug = p_slug
    and coalesce(i.is_active, false) = true
    and r.status = 'active'
    and nullif(trim(r.brand_name), '') is not null
    and (
      r.package = 'reseller'
      or (
        r.package = 'reseller_brand'
        and r.brand_active = true
        and (r.brand_expires_at is null or r.brand_expires_at > now())
      )
    )
  limit 1;
$$;

revoke all on function public.get_invitation_brand_by_slug(text) from public;
grant execute on function public.get_invitation_brand_by_slug(text) to anon, authenticated;
