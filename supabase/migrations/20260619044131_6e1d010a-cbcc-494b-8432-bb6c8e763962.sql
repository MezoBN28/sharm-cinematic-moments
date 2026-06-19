-- Remove bootstrap admin assignment so no future user can auto-become admin
DROP TRIGGER IF EXISTS bootstrap_first_admin_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.bootstrap_first_admin() CASCADE;