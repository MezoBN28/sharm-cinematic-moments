
-- 1. PRIVILEGE_ESCALATION: explicit admin-only write policies on user_roles
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. REALTIME_DATA_LEAK: restrict realtime.messages to admins
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins only realtime" ON realtime.messages;
CREATE POLICY "Admins only realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. INSECURE_FUNCTION: drop the public.has_role duplicate
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
