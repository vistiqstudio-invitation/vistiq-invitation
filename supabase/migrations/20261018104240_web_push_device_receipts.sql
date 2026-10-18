-- Provider acceptance is separate from the service worker processing a push.
alter table public.web_push_jobs
  add column device_received_at timestamptz,
  add column device_displayed_at timestamptz,
  add column device_error text;
