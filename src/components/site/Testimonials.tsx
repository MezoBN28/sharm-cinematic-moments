import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionHeader } from "./SectionHeader";
import { testimonials } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

function initials(name: string) {
  return name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function Testimonials() {
  const { t } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={t("test.eyebrow")}
          title={<>{t("test.titleA")} <em className="text-gradient-gold not-italic">{t("test.titleB")}</em></>}
        />

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((tt, i) => (
                <div key={tt.name} className="min-w-0 shrink-0 grow-0 basis-full px-3 md:basis-1/2 lg:basis-1/3">
                  <motion.figure
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
                    className="relative h-full rounded-sm border border-gold/15 bg-card/60 p-10 backdrop-blur-xl shadow-luxe"
                  >
                    <Quote className="absolute -top-4 left-8 h-10 w-10 rounded-full bg-card p-2 text-gold" />
                    <div className="flex gap-1 text-gold drop-shadow-[0_0_8px_var(--gold)]">
                      {Array.from({ length: tt.rating ?? 5 }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-current" strokeWidth={0} />
                      ))}
                    </div>
                    <blockquote className="mt-5 font-display text-xl italic leading-relaxed text-foreground">
                      "{tt.quote}"
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-5">
                      <div
                        aria-hidden
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-display text-base text-primary-foreground shadow-gold-glow"
                      >
                        {initials(tt.name)}
                      </div>
                      <div>
                        <div className="font-display text-lg text-gradient-gold">{tt.name}</div>
                        <div className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                          {tt.from}
                        </div>
                      </div>
                    </figcaption>
                  </motion.figure>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold/40 bg-onyx/70 p-3 text-gold backdrop-blur-xl transition-all hover:bg-gold/10 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold/40 bg-onyx/70 p-3 text-gold backdrop-blur-xl transition-all hover:bg-gold/10 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === selectedIndex ? "w-8 bg-gradient-gold" : "w-4 bg-border hover:bg-gold/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
