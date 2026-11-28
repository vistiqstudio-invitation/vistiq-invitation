-- Mitra Brand is retired from registration. Existing brand accounts keep
-- lifetime access and pay the same Rp20.000 activation fee as Reseller.
-- Restore accounts blocked by the retired subscription expiry, while keeping
-- other pending/inactive administrative statuses as they are.
update public.resellers
set status = case
      when status = 'inactive' and brand_active = true
           and brand_expires_at <= now() then 'active'
      else status
    end,
    billing_model = 'per_invitation',
    commission_percent = 0,
    brand_expires_at = null
where package = 'reseller_brand';

-- Reject reintroducing monthly expiry or free activation through old code.
alter table public.resellers
  add constraint resellers_legacy_brand_lifetime_activation_check
  check (package <> 'reseller_brand' or (
    billing_model is not distinct from 'per_invitation'
    and brand_expires_at is null
  ));
