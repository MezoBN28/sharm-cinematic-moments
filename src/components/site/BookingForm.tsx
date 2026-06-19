import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { services } from "@/lib/site-config";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(4).max(40),
  email: z.string().trim().email().max(200),
  hotel_name: z.string().trim().min(2).max(200),
  preferred_date: z.string().min(4),
  preferred_time: z.string().min(1).max(40),
  guests: z.coerce.number().int().min(1).max(50),
  service_type: z.string().max(80).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export function BookingForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error("Please check your details", {
        description: parsed.error.issues[0]?.message,
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("bookings")
      .insert({
        ...parsed.data,
        service_type: parsed.data.service_type || null,
        notes: parsed.data.notes || null,
      });
    setLoading(false);
    if (error) {
      toast.error("Booking failed", { description: error.message });
      return;
    }
    // Fire-and-forget notification (Zapier → email + WhatsApp)
    void fetch("/api/public/notify-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    }).catch(() => {});
    toast.success("Booking received", {
      description: "We'll be in touch shortly to confirm your session.",
    });
    form.reset();
  }

  const field =
    "w-full rounded-sm border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";
  const label = "block text-[0.65rem] uppercase tracking-[0.3em] text-gold mb-2";

  return (
    <section id="booking" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="Reserve Your Session"
          title={<>Book your <em className="text-gradient-gold not-italic">cinematic experience.</em></>}
          description="Tell us about your stay. We'll personally confirm date, location, and details within hours."
        />

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-sm border border-border bg-card p-8 shadow-luxe md:p-12"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={label}>Full Name</label>
              <input name="full_name" required maxLength={120} className={field} placeholder="Your full name" />
            </div>
            <div>
              <label className={label}>Phone Number</label>
              <input name="phone" required maxLength={40} className={field} placeholder="+20 ..." />
            </div>
            <div>
              <label className={label}>Email Address</label>
              <input name="email" type="email" required maxLength={200} className={field} placeholder="you@example.com" />
            </div>
            <div>
              <label className={label}>Hotel Name</label>
              <input name="hotel_name" required maxLength={200} className={field} placeholder="Four Seasons, Rixos, etc." />
            </div>
            <div>
              <label className={label}>Preferred Date</label>
              <input name="preferred_date" type="date" required className={field} />
            </div>
            <div>
              <label className={label}>Preferred Time</label>
              <select name="preferred_time" required className={field} defaultValue="Sunset">
                <option>Sunrise</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Sunset</option>
                <option>Evening</option>
              </select>
            </div>
            <div>
              <label className={label}>Number of Guests</label>
              <input name="guests" type="number" min={1} max={50} defaultValue={2} required className={field} />
            </div>
            <div>
              <label className={label}>Service Type</label>
              <select name="service_type" className={field} defaultValue="">
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={label}>Notes</label>
              <textarea name="notes" rows={4} maxLength={2000} className={field} placeholder="Anything we should know? Special moments, locations, ideas..." />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full rounded-full bg-gradient-gold py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Request Booking"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
