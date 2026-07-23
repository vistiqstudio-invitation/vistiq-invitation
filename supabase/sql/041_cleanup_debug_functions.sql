-- Removes every temporary diagnostic RPC/policy added while chasing the
-- storage.objects nested-RLS bug fixed in 040. All debugging is done;
-- these serve no ongoing purpose and callable RPCs left lying around are
-- just needless surface area.

drop function if exists public.debug_my_context();
drop function if exists public.debug_storage_check(text);
drop function if exists public.debug_storage_insert_test(text);
drop function if exists public.debug_full_insert_context(text);
drop policy if exists "debug_test_always_true" on storage.objects;
