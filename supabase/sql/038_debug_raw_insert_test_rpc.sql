-- Last-resort diagnostic: debug_storage_check() proved the WITH CHECK
-- condition itself evaluates true for this exact client/invitation, yet
-- the real Storage API upload still 403s with an RLS violation. This
-- performs the actual `insert into storage.objects` directly via raw SQL,
-- as the calling user (security invoker, so real RLS applies), to see
-- whether plain Postgres accepts it. Always raises at the end so nothing
-- is ever actually persisted - the raised message tells us whether the
-- insert itself succeeded (real RLS bug is elsewhere, e.g. Storage API
-- layer) or failed with the same error (real RLS bug, keep digging here).

create or replace function public.debug_storage_insert_test(p_invitation_id text)
returns text
language plpgsql
as $$
declare
  test_name text := p_invitation_id || '/debug-test-' || floor(random() * 100000)::text || '.txt';
begin
  insert into storage.objects (bucket_id, name, owner)
  values ('invitation-assets', test_name, auth.uid());

  raise exception 'ROLLBACK_TEST_INSERT_SUCCEEDED';
exception
  when others then
    return sqlerrm;
end;
$$;

grant execute on function public.debug_storage_insert_test(text) to authenticated;
