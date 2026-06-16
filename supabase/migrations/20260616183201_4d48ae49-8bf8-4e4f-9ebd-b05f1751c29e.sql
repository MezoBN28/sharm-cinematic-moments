
DROP POLICY "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 120
    AND char_length(phone) BETWEEN 4 AND 40
    AND char_length(email) BETWEEN 5 AND 200
    AND char_length(hotel_name) BETWEEN 1 AND 200
    AND char_length(preferred_time) BETWEEN 1 AND 40
    AND guests BETWEEN 1 AND 50
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND (service_type IS NULL OR char_length(service_type) <= 80)
  );
