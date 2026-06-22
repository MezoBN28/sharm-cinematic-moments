import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const idSchema = z.object({ id: z.string().uuid() });

export const getReviewBooking = createServerFn({ method: "GET" })
  .inputValidator((data) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("full_name")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("lookup_failed");
    if (!booking) return null;
    const { count, error: revErr } = await supabaseAdmin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("booking_id", data.id);
    if (revErr) throw new Error("lookup_failed");
    return {
      full_name: booking.full_name as string,
      already_reviewed: (count ?? 0) > 0,
    };
  });

const submitSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error: bErr } = await supabaseAdmin
      .from("bookings")
      .select("full_name")
      .eq("id", data.booking_id)
      .maybeSingle();
    if (bErr) throw new Error("lookup_failed");
    if (!booking) throw new Error("booking_not_found");

    const { count } = await supabaseAdmin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("booking_id", data.booking_id);
    if ((count ?? 0) > 0) throw new Error("already_reviewed");

    const trimmed = data.comment?.trim() || null;
    const { error: insErr } = await supabaseAdmin.from("reviews").insert({
      booking_id: data.booking_id,
      full_name: booking.full_name as string,
      rating: data.rating,
      comment: trimmed,
    });
    if (insErr) throw new Error("insert_failed");

    await supabaseAdmin
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", data.booking_id)
      .neq("status", "completed");

    return { ok: true };
  });
