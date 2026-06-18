import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(1).max(120),
  phone: z.string().min(1).max(40),
  email: z.string().email().max(200),
  hotel_name: z.string().min(1).max(200),
  preferred_date: z.string().min(1).max(40),
  preferred_time: z.string().min(1).max(40),
  guests: z.number().int().min(1).max(50),
  service_type: z.string().max(80).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

// Public booking-notification fan-out.
// Posts the booking to a Zapier webhook (which handles email + WhatsApp).
// Configure secret ZAPIER_BOOKING_WEBHOOK_URL. Endpoint is best-effort and
// never blocks the user's booking confirmation.
export const Route = createFileRoute("/api/public/notify-booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = payloadSchema.safeParse(body);
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400 });
        }

        const zapUrl = process.env.ZAPIER_BOOKING_WEBHOOK_URL;
        const notifyEmail = "sharmcinematic@gmail.com";
        const notifyWhatsapp = "+201123738569";

        if (!zapUrl) {
          // Not configured yet — accept silently so the form still succeeds.
          return Response.json({ ok: true, delivered: false });
        }

        try {
          await fetch(zapUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...parsed.data,
              notify_email: notifyEmail,
              notify_whatsapp: notifyWhatsapp,
              source: "sharmcinematic.website",
              received_at: new Date().toISOString(),
            }),
          });
        } catch {
          // Swallow — booking already saved; this is best-effort.
        }
        return Response.json({ ok: true, delivered: true });
      },
    },
  },
});
