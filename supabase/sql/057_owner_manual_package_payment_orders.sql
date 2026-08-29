-- Owner-managed package payments for reseller accounts created manually.
--
-- These orders intentionally stay in checkout_orders so the existing Owner
-- revenue calculation (paid checkout_orders + paid client transactions)
-- includes them exactly once. They must not be inserted into transactions:
-- that table is the reseller's client-sale/commission ledger.

alter table public.checkout_orders
  add column if not exists reseller_id uuid references public.resellers(id) on delete set null,
  add column if not exists order_source text not null default 'midtrans',
  add column if not exists confirmed_by uuid references auth.users(id) on delete set null,
  add column if not exists confirmed_at timestamptz,
  add column if not exists settlement_applied_at timestamptz;

alter table public.checkout_orders
  drop constraint if exists checkout_orders_order_source_check;

alter table public.checkout_orders
  add constraint checkout_orders_order_source_check
  check (order_source in ('midtrans', 'owner_manual'));

create index if not exists checkout_orders_reseller_id_idx
  on public.checkout_orders (reseller_id, created_at desc)
  where reseller_id is not null;

create index if not exists checkout_orders_confirmed_by_idx
  on public.checkout_orders (confirmed_by)
  where confirmed_by is not null;

-- A reseller may have only one open manual package order at a time. This
-- prevents a double-click or repeated admin request from creating two unpaid
-- rows for the same account. Once the row is paid, the next Brand renewal can
-- create a new order.
create unique index if not exists checkout_orders_manual_pending_reseller_idx
  on public.checkout_orders (reseller_id)
  where reseller_id is not null
    and order_source = 'owner_manual'
    and status = 'pending';

-- The confirmation RPC uses SECURITY INVOKER and therefore needs an UPDATE
-- policy. The policy is still Owner-only; reseller/client sessions cannot
-- update checkout orders through the Data API.
drop policy if exists "checkout_orders_owner_update" on public.checkout_orders;
create policy "checkout_orders_owner_update" on public.checkout_orders
  for update to authenticated
  using (public.current_role() = 'owner')
  with check (public.current_role() = 'owner');

-- Keep a settled order settled even if a late provider notification or an
-- accidental direct update tries to downgrade it. Provisioning fields remain
-- editable because account provisioning may finish after payment settlement.
create or replace function public.keep_paid_checkout_order_settled()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if old.status = 'paid' then
    new.status := 'paid';
    new.paid_at := coalesce(old.paid_at, new.paid_at, now());
    new.payment_type := coalesce(old.payment_type, new.payment_type);
    new.confirmed_by := coalesce(old.confirmed_by, new.confirmed_by);
    new.confirmed_at := coalesce(old.confirmed_at, new.confirmed_at);
    new.settlement_applied_at := coalesce(old.settlement_applied_at, new.settlement_applied_at);

    -- The financial identity of a paid manual order is immutable.
    new.order_source := old.order_source;
    new.reseller_id := old.reseller_id;
    new.package_id := old.package_id;
    new.package_name := old.package_name;
    new.amount := old.amount;
    new.customer_name := old.customer_name;
    new.customer_email := old.customer_email;
    new.customer_phone := old.customer_phone;
  end if;
  return new;
end;
$$;

drop trigger if exists before_checkout_order_settled on public.checkout_orders;
create trigger before_checkout_order_settled
before update on public.checkout_orders
for each row execute function public.keep_paid_checkout_order_settled();

revoke all on function public.keep_paid_checkout_order_settled() from public, anon, authenticated;

-- Confirm a manually-created package payment and apply package entitlement.
-- The row lock plus settlement_applied_at guard makes retries safe:
-- - pending -> paid applies the entitlement once;
-- - paid + settled returns already_paid without extending again;
-- - a paid row with a missing settlement marker is completed atomically.
create or replace function public.owner_confirm_package_payment(p_checkout_order_id uuid)
returns table (
  checkout_order_id uuid,
  order_id text,
  status text,
  already_paid boolean,
  brand_expires_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_order public.checkout_orders%rowtype;
  v_reseller public.resellers%rowtype;
  v_now timestamptz := now();
  v_already_paid boolean := false;
  v_apply_settlement boolean := false;
begin
  if public.current_role() is distinct from 'owner' then
    raise exception 'Tidak diizinkan.';
  end if;

  select *
    into v_order
    from public.checkout_orders
   where id = p_checkout_order_id
   for update;

  if not found then
    raise exception 'Order paket tidak ditemukan.';
  end if;

  if v_order.order_source is distinct from 'owner_manual'
     or v_order.package_id not in ('reseller', 'reseller-brand') then
    raise exception 'Order ini bukan order paket manual Owner.';
  end if;

  if v_order.status = 'paid' then
    v_already_paid := true;
    v_apply_settlement := v_order.settlement_applied_at is null;
  elsif v_order.status = 'pending' then
    v_apply_settlement := true;
  else
    raise exception 'Order tidak dapat dikonfirmasi dari status %.', v_order.status;
  end if;

  if v_order.reseller_id is null then
    raise exception 'Order paket manual belum terhubung ke akun reseller.';
  end if;

  select *
    into v_reseller
    from public.resellers
   where id = v_order.reseller_id
   for update;

  if not found then
    raise exception 'Akun reseller untuk order tidak ditemukan.';
  end if;

  if (v_order.package_id = 'reseller-brand' and v_reseller.package is distinct from 'reseller_brand')
     or (v_order.package_id = 'reseller' and v_reseller.package is distinct from 'reseller') then
    raise exception 'Paket akun reseller tidak cocok dengan order.';
  end if;

  if v_order.package_id = 'reseller-brand' then
    if v_apply_settlement then
      -- Existing Brand accounts with active=true and no expiry are the
      -- grandfathered lifetime accounts. A payment row is still recorded,
      -- but confirming it must not accidentally convert lifetime access into
      -- a monthly expiry.
      if v_reseller.brand_expires_at is null
         and v_reseller.brand_active = true then
        update public.resellers
           set brand_active = true
         where id = v_reseller.id;
      else
        update public.resellers
           set brand_active = true,
               brand_expires_at = greatest(
                 coalesce(v_reseller.brand_expires_at, v_now),
                 v_now
               ) + interval '1 month'
         where id = v_reseller.id;
      end if;

      select r.brand_expires_at
        into v_reseller.brand_expires_at
        from public.resellers as r
       where r.id = v_reseller.id;
    end if;
  end if;

  update public.checkout_orders
     set status = 'paid',
         payment_type = coalesce(nullif(payment_type, ''), 'manual_transfer'),
         paid_at = coalesce(paid_at, v_now),
         confirmed_by = coalesce(confirmed_by, auth.uid()),
         confirmed_at = coalesce(confirmed_at, v_now),
         settlement_applied_at = coalesce(settlement_applied_at, v_now),
         updated_at = v_now
   where id = v_order.id;

  return query
  select v_order.id,
         v_order.order_id,
         'paid'::text,
         v_already_paid,
         case when v_order.package_id = 'reseller-brand'
              then v_reseller.brand_expires_at
              else null
          end;
end;
$$;

revoke all on function public.owner_confirm_package_payment(uuid) from public, anon;
grant execute on function public.owner_confirm_package_payment(uuid) to authenticated;
