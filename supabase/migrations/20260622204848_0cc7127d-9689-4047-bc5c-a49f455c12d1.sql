
CREATE TABLE public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  full_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.get_review_booking(_id uuid)
RETURNS TABLE(full_name text, already_reviewed boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.full_name,
         EXISTS(SELECT 1 FROM public.reviews r WHERE r.booking_id = b.id) AS already_reviewed
  FROM public.bookings b
  WHERE b.id = _id;
$$;
GRANT EXECUTE ON FUNCTION public.get_review_booking(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_review(_booking_id uuid, _rating int, _comment text)
RETURNS public.reviews
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_name text;
  v_row public.reviews;
BEGIN
  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'invalid_rating';
  END IF;
  SELECT full_name INTO v_name FROM public.bookings WHERE id = _booking_id;
  IF v_name IS NULL THEN
    RAISE EXCEPTION 'booking_not_found';
  END IF;
  IF EXISTS(SELECT 1 FROM public.reviews WHERE booking_id = _booking_id) THEN
    RAISE EXCEPTION 'already_reviewed';
  END IF;
  IF _comment IS NOT NULL AND char_length(_comment) > 2000 THEN
    RAISE EXCEPTION 'comment_too_long';
  END IF;
  INSERT INTO public.reviews(booking_id, full_name, rating, comment)
  VALUES (_booking_id, v_name, _rating, NULLIF(btrim(_comment), ''))
  RETURNING * INTO v_row;
  UPDATE public.bookings SET status = 'completed'
    WHERE id = _booking_id AND status <> 'completed';
  RETURN v_row;
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_review(uuid, int, text) TO anon, authenticated;
