import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { testimonials } from "@/lib/site-config";

export function Testimonials() {
  return (
    <section className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Kind Words"
          title={<>Stories from <em className="text-gradient-gold not-italic">our guests.</em></>}
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative rounded-sm border border-border bg-card p-10"
            >
              <Quote className="absolute -top-4 left-8 h-10 w-10 rounded-full bg-card p-2 text-gold" />
              <blockquote className="font-display text-xl italic leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 border-t border-border pt-4">
                <div className="font-display text-lg text-gradient-gold">{t.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t.from}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
