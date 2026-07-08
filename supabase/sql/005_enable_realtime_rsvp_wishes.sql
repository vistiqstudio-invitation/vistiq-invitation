-- Enables Supabase Realtime broadcasts for new RSVP/wish submissions so
-- the invitation page's RSVP counts and wishes list update live.
alter publication supabase_realtime add table public.rsvp_wishes;
