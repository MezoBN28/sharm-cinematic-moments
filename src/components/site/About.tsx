import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import img from "@/assets/gallery-2.jpg";

export function About() {
  return (
    <section id="about" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -left-4 -top-4 h-full w-full rounded-sm border border-gold/40" />
          <img
            src={img}
            loading="lazy"
            width={1280}
            height={1024}
            alt="Cinematic photography session at a luxury Sharm El Sheikh resort"
            className="relative h-[520px] w-full rounded-sm object-cover shadow-luxe"
          />
        </motion.div>

        <div>
          <SectionHeader
            eyebrow="About Sharm Cinematic"
            title={<>Memories crafted <em className="text-gradient-gold not-italic">like cinema.</em></>}
            description="Sharm Cinematic is a private photography service dedicated to guests of Sharm El Sheikh's most prestigious hotels and resorts. We come to you — directing intimate, cinematic sessions that transform your stay into a film you'll relive forever."
            align="left"
          />
          <div className="grid grid-cols-2 gap-6 pt-2">
            {[
              { k: "500+", v: "Sessions Delivered" },
              { k: "30+", v: "Resort Partners" },
              { k: "72h", v: "Average Delivery" },
              { k: "5★", v: "Guest Rating" },
            ].map((s) => (
              <div key={s.v} className="border-l border-gold/40 pl-4">
                <div className="font-display text-4xl text-gradient-gold">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
