import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { services } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

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
  const navigate = useNavigate();
  const { t } = useI18n();

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
    void fetch("/api/public/notify-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    }).catch(() => {});
    form.reset();
    navigate({ to: "/thank-you" });
  }

  const field =
    "w-full rounded-sm border border-gold/20 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-md focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";
  const label = "block text-[0.65rem] uppercase tracking-[0.3em] text-gold mb-2";

  return (
    <section id="booking" className="relative bg-background py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,var(--gold)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,var(--gold-deep)_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow={t("book.eyebrow")}
          title={<>{t("book.titleA")} <em className="text-gradient-gold not-italic">{t("book.titleB")}</em></>}
          description={t("book.desc")}
        />

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl border border-gold/25 bg-card/30 p-8 shadow-luxe backdrop-blur-2xl md:p-12"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in oklab, var(--gold) 6%, transparent), transparent 60%)",
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={label}>{t("book.fullName")}</label>
              <input name="full_name" required maxLength={120} className={field} placeholder={t("book.fullName")} />
            </div>
            <div>
              <label className={label}>{t("book.phone")}</label>
              <input name="phone" required maxLength={40} className={field} placeholder="+20 ..." />
            </div>
            <div>
              <label className={label}>{t("book.emailAddr")}</label>
              <input name="email" type="email" required maxLength={200} className={field} placeholder="you@example.com" />
            </div>
            <div>
              <label className={label}>{t("book.hotel")}</label>
              <input name="hotel_name" required maxLength={200} className={field} placeholder="Four Seasons, Rixos, etc." />
            </div>
            <div>
              <label className={label}>{t("book.date")}</label>
              <input name="preferred_date" type="date" required className={field} />
            </div>
            <div>
              <label className={label}>{t("book.time")}</label>
              <select name="preferred_time" required className={field} defaultValue="Sunset">
                <option>Sunrise</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Sunset</option>
                <option>Evening</option>
              </select>
            </div>
            <div>
              <label className={label}>{t("book.guests")}</label>
              <input name="guests" type="number" min={1} max={50} defaultValue={2} required className={field} />
            </div>
            <div>
              <label className={label}>{t("book.service")}</label>
              <select name="service_type" className={field} defaultValue="">
                <option value="">{t("book.serviceSelect")}</option>
                {services.map((s) => (
                  <option key={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={label}>{t("book.notes")}</label>
              <textarea name="notes" rows={4} maxLength={2000} className={field} placeholder={t("book.notesPh")} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full rounded-full bg-gradient-gold py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? t("book.sending") : t("book.submit")}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
