import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";

type Cat = "all" | "couples" | "honeymoon" | "family" | "resort" | "beach";

const items: { src: string; cat: Exclude<Cat, "all">; alt: string; tall?: boolean }[] = [
  { src: g1, cat: "couples", alt: "Couple at sunset", tall: true },
  { src: g2, cat: "honeymoon", alt: "Honeymoon at infinity pool" },
  { src: g3, cat: "family", alt: "Family on beach", tall: true },
  { src: g4, cat: "resort", alt: "Resort architecture" },
  { src: g5, cat: "beach", alt: "Silhouette on beach", tall: true },
  { src: g6, cat: "honeymoon", alt: "Bride by the Red Sea", tall: true },
  { src: g7, cat: "beach", alt: "Underwater snorkeling" },
  { src: g8, cat: "family", alt: "Children playing at sunset", tall: true },
];

const filters: { key: Cat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "couples", label: "Couples" },
  { key: "honeymoon", label: "Honeymoon" },
  { key: "family", label: "Family" },
  { key: "resort", label: "Resort" },
  { key: "beach", label: "Beach" },
];

export function Portfolio() {
  const [cat, setCat] = useState<Cat>("all");
  const [active, setActive] = useState<string | null>(null);

  const visible = items.filter((i) => cat === "all" || i.cat === cat);

  return (
    <section id="portfolio" className="relative bg-gradient-onyx py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Portfolio"
          title={<>A gallery of <em className="text-gradient-gold not-italic">light & story.</em></>}
          description="A curated selection of cinematic frames from sessions across Sharm El Sheikh."
        />

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setCat(f.key)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                cat === f.key
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-gold/60 hover:text-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((i) => (
              <motion.button
                layout
                key={i.src}
                onClick={() => setActive(i.src)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group relative overflow-hidden rounded-sm bg-card shadow-luxe ${
                  i.tall ? "row-span-2 aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img
                  src={i.src}
                  alt={i.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">
                    {i.cat}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-onyx/95 p-6 backdrop-blur-xl"
          >
            <button
              className="absolute right-6 top-6 rounded-full border border-gold/40 p-3 text-gold hover:bg-gold/10"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X />
            </button>
            <motion.img
              key={active}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={active}
              alt="Selected portfolio image"
              className="max-h-[90vh] max-w-[92vw] rounded-sm object-contain shadow-luxe"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
