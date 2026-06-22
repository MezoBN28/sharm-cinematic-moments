
DROP FUNCTION IF EXISTS public.get_review_booking(uuid);
DROP FUNCTION IF EXISTS public.submit_review(uuid, integer, text);

DROP POLICY IF EXISTS "Anyone can record a visit" ON public.visitor_events;
CREATE POLICY "Anyone can record a visit" ON public.visitor_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    path IS NOT NULL
    AND char_length(path) BETWEEN 1 AND 500
    AND (session_id IS NULL OR char_length(session_id) BETWEEN 1 AND 100)
  );
