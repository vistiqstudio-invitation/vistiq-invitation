-- Consolidates every value the WITH CHECK clause depends on, captured at
-- the exact moment right before the real insert attempt, in the exact
-- same function/transaction - leaves nothing to assumption about whether
-- auth.uid() or storage.foldername() behave differently in this context
-- than they did in the earlier, separate debug calls.

create or replace function public.debug_full_insert_context(p_invitation_id text)
returns jsonb
language plpgsql
as $$
declare
  test_name text := p_invitation_id || '/debug-test-' || floor(random() * 100000)::text || '.txt';
  v_uid uuid;
  v_folder text;
  v_exists boolean;
  v_insert_error text;
  v_simple_insert_error text;
begin
  v_uid := auth.uid();
  v_folder := (storage.foldername(test_name))[1];

  select exists(
    select 1 from public.invitations i
    join public.clients c on c.id = i.client_id
    where i.id::text = (storage.foldername(test_name))[1]
      and c.user_id = auth.uid()
  ) into v_exists;

  begin
    insert into storage.objects (bucket_id, name, owner)
    values ('invitation-assets', test_name, auth.uid());
    v_insert_error := 'SUCCEEDED';
    raise exception 'ROLLBACK_TEST_INSERT_SUCCEEDED';
  exception
    when others then
      if v_insert_error is null then
        v_insert_error := sqlerrm;
      end if;
  end;

  begin
    insert into storage.objects (bucket_id, name)
    values ('invitation-assets', 'debug-test-only/manual-check-' || floor(random() * 100000)::text || '.txt');
    v_simple_insert_error := 'SUCCEEDED';
    raise exception 'ROLLBACK_TEST_INSERT_SUCCEEDED';
  exception
    when others then
      if v_simple_insert_error is null then
        v_simple_insert_error := sqlerrm;
      end if;
  end;

  return jsonb_build_object(
    'test_name', test_name,
    'uid', v_uid,
    'folder', v_folder,
    'exists_check', v_exists,
    'insert_result', v_insert_error,
    'simple_insert_result', v_simple_insert_error,
    'current_user', current_user,
    'session_user', session_user,
    'current_role_setting', current_setting('role', true)
  );
end;
$$;

grant execute on function public.debug_full_insert_context(text) to authenticated;
