-- Run once after 022_midtrans_checkout_orders.sql.
alter table public.checkout_orders
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists provision_status text not null default 'pending',
  add column if not exists provision_error text,
  add column if not exists account_created_at timestamptz,
  add column if not exists invite_sent_at timestamptz;

alter table public.checkout_orders
  drop constraint if exists checkout_orders_provision_status_check;

alter table public.checkout_orders
  add constraint checkout_orders_provision_status_check
  check (provision_status in ('pending', 'provisioning', 'completed', 'email_failed', 'failed'));

create unique index if not exists checkout_orders_auth_user_id_idx
  on public.checkout_orders(auth_user_id)
  where auth_user_id is not null;

create or replace function public.claim_checkout_provision(target_order_id text)
returns table (
  order_id text,
  package_id text,
  package_name text,
  customer_name text,
  customer_email text,
  customer_phone text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.checkout_orders as orders
     set provision_status = 'provisioning',
         provision_error = null,
         updated_at = now()
   where orders.order_id = target_order_id
     and orders.status = 'paid'
     and orders.auth_user_id is null
     and orders.provision_status in ('pending', 'failed')
  returning orders.order_id, orders.package_id, orders.package_name,
            orders.customer_name, orders.customer_email, orders.customer_phone;
end;
$$;

revoke all on function public.claim_checkout_provision(text) from public;
revoke all on function public.claim_checkout_provision(text) from anon;
revoke all on function public.claim_checkout_provision(text) from authenticated;
grant execute on function public.claim_checkout_provision(text) to service_role;
