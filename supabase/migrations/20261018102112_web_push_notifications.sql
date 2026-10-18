-- Device registrations and delivery queue are server-only; signing secrets never
-- appear in pg_net headers or bodies. Existing payment writes remain independent.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

create table public.web_push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index web_push_subscriptions_user_idx on public.web_push_subscriptions(user_id);
create table public.web_push_jobs (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null references public.web_push_subscriptions(endpoint) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_role text not null check (recipient_role in ('owner','reseller')),
  event_key text not null,
  title text not null,
  body text not null,
  url text not null check (url ~ '^/(admin|reseller)(/|$)'),
  status text not null default 'pending' check (status in ('pending','processing','sent','failed')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  claimed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  unique(endpoint,event_key)
);
create index web_push_jobs_pending_idx on public.web_push_jobs(available_at,created_at) where status='pending';
create index web_push_jobs_processing_idx on public.web_push_jobs(claimed_at) where status='processing';
create index web_push_jobs_user_idx on public.web_push_jobs(user_id);
create index web_push_jobs_device_created_idx on public.web_push_jobs(endpoint,created_at);
create table public.web_push_wakeups (nonce uuid primary key, created_at timestamptz not null default now());
create index web_push_wakeups_created_idx on public.web_push_wakeups(created_at);

alter table public.web_push_subscriptions enable row level security;
alter table public.web_push_jobs enable row level security;
alter table public.web_push_wakeups enable row level security;
revoke all on public.web_push_subscriptions, public.web_push_jobs, public.web_push_wakeups from public, anon, authenticated;
grant all on public.web_push_subscriptions, public.web_push_jobs, public.web_push_wakeups to service_role;

create schema if not exists private;
create table private.web_push_config (id boolean primary key default true check(id), signing_secret text not null);
alter table private.web_push_config enable row level security;
revoke all on private.web_push_config from public, anon, authenticated, service_role;

create function private.wake_web_push_worker() returns void
language plpgsql security definer set search_path='' as $$
declare
  secret_value text;
  wake_nonce uuid := gen_random_uuid();
  wake_time bigint := floor(extract(epoch from clock_timestamp()));
  proof text;
begin
  if not exists(select 1 from public.web_push_jobs where (status='pending' and available_at<=now()) or (status='processing' and claimed_at<now()-interval '2 minutes')) then return; end if;
  select signing_secret into secret_value from private.web_push_config where id;
  if secret_value is null then return; end if;
  delete from public.web_push_wakeups where created_at<now()-interval '5 minutes';
  insert into public.web_push_wakeups(nonce) values(wake_nonce);
  proof := encode(extensions.hmac(wake_nonce::text || ':' || wake_time::text, secret_value, 'sha256'),'hex');
  perform net.http_post(
    url:='https://www.vistiqinvitation.com/api/push/dispatch',
    body:=jsonb_build_object('nonce',wake_nonce,'timestamp',wake_time,'signature',proof),
    headers:='{"Content-Type":"application/json"}'::jsonb,
    timeout_milliseconds:=15000
  );
end;
$$;
revoke all on function private.wake_web_push_worker() from public, anon, authenticated;

create function private.wake_web_push_after_insert() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  perform private.wake_web_push_worker();
  return null;
exception when others then
  raise warning 'Push wakeup deferred to retry worker';
  return null;
end;
$$;
revoke all on function private.wake_web_push_after_insert() from public, anon, authenticated;
create trigger web_push_jobs_wakeup after insert on public.web_push_jobs for each statement execute function private.wake_web_push_after_insert();

create function private.enqueue_web_push(p_event text,p_title text,p_body text,p_reseller uuid,p_owner_url text)
returns void language sql security invoker set search_path='' as $$
  insert into public.web_push_jobs(endpoint,user_id,recipient_role,event_key,title,body,url)
  select s.endpoint,s.user_id,p.role,p_event,p_title,p_body,
    case when p.role='owner' then p_owner_url else '/reseller/invitations' end
  from public.web_push_subscriptions s join public.profiles p on p.id=s.user_id
  where p.role='owner' or (p.role='reseller' and exists(
    select 1 from public.resellers r where r.id=p_reseller and r.user_id=s.user_id and r.status='active'
  ))
  on conflict(endpoint,event_key) do nothing;
$$;
revoke all on function private.enqueue_web_push(text,text,text,uuid,text) from public, anon, authenticated;

-- These private trigger functions are not callable through the Data API.
-- The original table's existing RLS/owner checks authorize the originating write.
create function private.enqueue_order_web_push() returns trigger
language plpgsql security definer set search_path='' as $$
declare
  title_value text;
  body_value text;
begin
  if tg_op='UPDATE' and (new.status is distinct from 'paid' or old.status='paid') then return new; end if;
  title_value := case when new.status='paid' then 'Pembayaran berhasil' else 'Pesanan baru' end;
  body_value := case when new.status='paid' then 'Pembayaran baru berhasil diterima. Buka dashboard untuk melihat detail.' else 'Ada pesanan baru. Buka dashboard untuk melihat detail.' end;
  perform private.enqueue_web_push(tg_table_name || ':' || new.id::text || ':' || new.status,title_value,body_value,new.reseller_id,'/admin/transactions');
  return new;
exception when others then
  raise warning 'Push notification could not be queued';
  return new;
end;
$$;
revoke all on function private.enqueue_order_web_push() from public, anon, authenticated;
create trigger checkout_web_push after insert or update of status on public.checkout_orders for each row execute function private.enqueue_order_web_push();
create trigger transaction_web_push after insert or update of status on public.transactions for each row execute function private.enqueue_order_web_push();

create function private.enqueue_client_web_push() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.reseller_id is null then return new; end if;
  perform private.enqueue_web_push('client:' || new.id::text,'Client baru','Ada client baru dari reseller. Buka dashboard untuk melihat detail.',new.reseller_id,'/admin/clients');
  return new;
exception when others then
  raise warning 'Client push notification could not be queued';
  return new;
end;
$$;
revoke all on function private.enqueue_client_web_push() from public, anon, authenticated;
create trigger client_web_push after insert on public.clients for each row execute function private.enqueue_client_web_push();

create function public.claim_web_push_jobs(p_limit integer default 10)
returns setof public.web_push_jobs language plpgsql security invoker set search_path='' as $$
begin
  update public.web_push_jobs set status=case when attempts>=5 then 'failed' else 'pending' end
  where status='processing' and claimed_at<now()-interval '2 minutes';
  update public.web_push_jobs set status='failed',last_error='Notification expired'
  where status='pending' and created_at<now()-interval '1 day';
  return query with pending as (
    select id from public.web_push_jobs where status='pending' and available_at<=now() and attempts<5
    order by created_at for update skip locked limit least(greatest(p_limit,1),10)
  ) update public.web_push_jobs j set status='processing',attempts=j.attempts+1,claimed_at=now()
    from pending where j.id=pending.id returning j.*;
end;
$$;
revoke all on function public.claim_web_push_jobs(integer) from public, anon, authenticated;
grant execute on function public.claim_web_push_jobs(integer) to service_role;

select cron.schedule('vistiq-web-push-retry','* * * * *','select private.wake_web_push_worker();');
select cron.schedule('vistiq-web-push-cleanup','30 2 * * *',
  $$delete from public.web_push_jobs where created_at<now()-interval '7 days' and status in ('sent','failed'); delete from public.web_push_wakeups where created_at<now()-interval '5 minutes';$$);
