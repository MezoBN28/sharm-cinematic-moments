import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import g1 from "@/assets/gallery-1.png.asset.json";
import g2 from "@/assets/gallery-2.jpg.asset.json";
import g3 from "@/assets/gallery-3.png.asset.json";
import g4 from "@/assets/gallery-4.png.asset.json";
import g5 from "@/assets/gallery-5.jpg.asset.json";
import g9 from "@/assets/gallery-9.jpg.asset.json";
import g10 from "@/assets/gallery-10.jpg.asset.json";
import g11 from "@/assets/gallery-11.jpg.asset.json";
import g12 from "@/assets/gallery-12.jpg.asset.json";
import g13 from "@/assets/gallery-13.jpg.asset.json";
import g14 from "@/assets/gallery-14.jpg.asset.json";
import g15 from "@/assets/gallery-15.jpg.asset.json";
import g16 from "@/assets/gallery-16.jpg.asset.json";
import g17 from "@/assets/gallery-17.jpg.asset.json";
import g18 from "@/assets/gallery-18.jpg.asset.json";
import g19 from "@/assets/gallery-19.jpg.asset.json";
import g20 from "@/assets/gallery-20.jpg.asset.json";
import hero from "@/assets/hero.png.asset.json";

type Cat = "all" | "performance" | "lifestyle" | "dining" | "resort";

const items: { src: string; cat: Exclude<Cat, "all">; alt: string; tall?: boolean }[] = [
  { src: g1.url, cat: "performance", alt: "Neon lit performer cinematic portrait", tall: true },
  { src: hero.url, cat: "resort", alt: "Aerial view of luxury Sharm El Sheikh resort at sunset" },
  { src: g9.url, cat: "lifestyle", alt: "Luxury hotel breakfast in bed lifestyle portrait", tall: true },
  { src: g10.url, cat: "lifestyle", alt: "Editorial beach portrait at golden hour" },
  { src: g11.url, cat: "lifestyle", alt: "Flying yellow dress cinematic seaside shoot", tall: true },
  { src: g12.url, cat: "lifestyle", alt: "Black and white editorial portrait in luxury car" },
  { src: g13.url, cat: "performance", alt: "Red studio portrait of dancer in black dress", tall: true },
  { src: g14.url, cat: "performance", alt: "Cage performer under red stage lights" },
  { src: g15.url, cat: "performance", alt: "Trio of dancers in desert at sunrise", tall: true },
  { src: g16.url, cat: "performance", alt: "Desert editorial portrait seated among Sharm mountains" },
  { src: g17.url, cat: "performance", alt: "Sequined desert fashion pose against open sky", tall: true },
  { src: g18.url, cat: "lifestyle", alt: "Luxury white deck fashion portrait by the sea" },
  { src: g19.url, cat: "performance", alt: "Stage dance performance at a Sharm resort event", tall: true },
  { src: g20.url, cat: "lifestyle", alt: "Elegant resort balcony portrait with designer handbag" },
  { src: g3.url, cat: "lifestyle", alt: "Aerial acrobatic performance under stage lights", tall: true },
  { src: g5.url, cat: "dining", alt: "Chef performing fire show at fine dining restaurant" },
  { src: g4.url, cat: "dining", alt: "Cinematic cocktail on dark marble", tall: true },
  { src: g2.url, cat: "lifestyle", alt: "Bloody Mary cocktail with herbs and ice" },
];

const filters: { key: Cat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "resort", label: "Resort" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "dining", label: "Dining" },
  { key: "performance", label: "Performance" },
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
          description="A curated selection of cinematic frames captured across Sharm El Sheikh."
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
