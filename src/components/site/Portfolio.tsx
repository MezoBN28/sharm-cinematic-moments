import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
  const [cat, setCat] = useState<Cat>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = useMemo(() => items.filter((i) => cat === "all" || i.cat === cat), [cat]);
  const active = activeIndex != null ? visible[activeIndex] : null;

  const next = useCallback(() => {
    setActiveIndex((idx) => (idx == null ? null : (idx + 1) % visible.length));
  }, [visible.length]);
  const prev = useCallback(() => {
    setActiveIndex((idx) => (idx == null ? null : (idx - 1 + visible.length) % visible.length));
  }, [visible.length]);

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, next, prev]);

  return (
    <section id="portfolio" className="relative bg-gradient-onyx py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={t("portfolio.eyebrow")}
          title={<>{t("portfolio.titleA")} <em className="text-gradient-gold not-italic">{t("portfolio.titleB")}</em></>}
          description={t("portfolio.desc")}
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

        <motion.div
          layout
          className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((i, idx) => (
              <motion.button
                layout
                key={i.src}
                onClick={() => setActiveIndex(idx)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-md border border-gold/10 bg-card shadow-luxe ring-1 ring-inset ring-white/[0.03] transition-all duration-500 hover:border-gold/40 hover:shadow-gold-glow"
              >
                <div className="overflow-hidden">
                  <img
                    src={i.src}
                    alt={i.alt}
                    loading="lazy"
                    className="block h-auto w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span className="text-[0.6rem] uppercase tracking-[0.4em] text-gold">
                    {i.cat}
                  </span>
                  <span className="h-px w-10 bg-gold/70" />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gold/0 transition-all duration-500 group-hover:ring-gold/30" />
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
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-onyx/95 p-6 backdrop-blur-xl"
          >
            <button
              className="absolute right-6 top-6 rounded-full border border-gold/40 p-3 text-gold hover:bg-gold/10"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
              aria-label="Close"
            >
              <X />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-onyx/70 p-3 text-gold backdrop-blur-xl hover:bg-gold/10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-onyx/70 p-3 text-gold backdrop-blur-xl hover:bg-gold/10"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight />
            </button>
            <motion.div
              key={active.src}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next();
                else if (info.offset.x > 80) prev();
              }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.src}
                alt={active.alt}
                draggable={false}
                className="max-h-[85vh] max-w-[92vw] select-none rounded-sm object-contain shadow-luxe"
              />
              <div className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-gold/80">
                {(activeIndex ?? 0) + 1} / {visible.length} · {active.cat}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

