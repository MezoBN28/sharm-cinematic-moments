import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(4).max(40),
  email: z.string().trim().email().max(200),
  hotel_name: z.string().trim().min(2).max(200),
  preferred_date: z.string().min(1).max(40),
  preferred_time: z.string().min(1).max(40),
  guests: z.number().int().min(1).max(50),
  service_type: z.string().max(80).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      ...data,
      service_type: data.service_type || null,
      notes: data.notes || null,
    };
    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert(payload)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);

    // Best-effort Zapier notification — only fired for a verified inserted booking.
    const zapUrl = process.env.ZAPIER_BOOKING_WEBHOOK_URL;
    if (zapUrl && inserted?.id) {
      try {
        await fetch(zapUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: inserted.id,
            ...payload,
            notify_email: "sharmcinematic@gmail.com",
            notify_whatsapp: "+201123738569",
            source: "sharmcinematic.website",
            received_at: new Date().toISOString(),
          }),
        });
      } catch {
        // Swallow — booking already saved.
      }
    }
    return { ok: true, id: inserted?.id ?? null };
  });
