import { motion } from "framer-motion";
import { Camera, Heart, Users, Building2, Waves, Film } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { services } from "@/lib/site-config";

const icons = [Heart, Camera, Users, Building2, Waves, Film];

export function Services() {
  return (
    <section id="services" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Our Services"
          title={<>Sessions designed <em className="text-gradient-gold not-italic">for every story.</em></>}
          description="From intimate couples shoots to full cinematic productions — every session is private, directed, and crafted around you."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 transition-all duration-500 hover:border-gold/60 hover:-translate-y-1"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Icon className="h-8 w-8 text-gold" strokeWidth={1.25} />
                <h3 className="mt-6 font-display text-2xl text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <div className="mt-8 h-px w-12 bg-gold/40 transition-all duration-500 group-hover:w-24" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
