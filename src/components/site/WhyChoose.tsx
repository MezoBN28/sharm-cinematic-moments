import { motion } from "framer-motion";
import { Award, Sparkles, Zap, Wand2, UserCheck } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { whyChoose } from "@/lib/site-config";
import img from "@/assets/gallery-1.png.asset.json";

const icons = [Award, Sparkles, Zap, Wand2, UserCheck];

export function WhyChoose() {
  return (
    <section id="why" className="relative overflow-hidden bg-gradient-onyx py-28 md:py-36">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why Choose Us"
          title={<>The Sharm Cinematic <em className="text-gradient-gold not-italic">difference.</em></>}
        />

        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
          {whyChoose.map((w, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group flex flex-col items-center bg-card p-8 text-center transition-colors hover:bg-card/60"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 transition-all group-hover:border-gold group-hover:shadow-gold-glow">
                  <Icon className="h-7 w-7 text-gold" strokeWidth={1.25} />
                </div>
                <h3 className="mt-6 font-display text-xl text-foreground">{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
