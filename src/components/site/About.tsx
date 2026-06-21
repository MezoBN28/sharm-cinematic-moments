import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { useI18n } from "@/lib/i18n";
import img from "@/assets/gallery-3.png.asset.json";
import { siteConfig } from "@/lib/site-config";

export function About() {
  const { t } = useI18n();
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
            src={img.url}
            loading="lazy"
            width={1280}
            height={1920}
            alt="Cinematic photography session at a luxury Sharm El Sheikh venue"
            className="relative h-[520px] w-full rounded-sm object-cover shadow-luxe"
          />
        </motion.div>

        <div>
          <SectionHeader
            eyebrow={t("about.eyebrow")}
            title={<>{t("about.titleA")} <em className="text-gradient-gold not-italic">{t("about.titleB")}</em></>}
            description={t("about.desc")}
            align="left"
          />

          <div className="mt-2 rounded-sm border border-gold/30 bg-card/40 p-5">
            <div className="text-[0.6rem] uppercase tracking-[0.35em] text-gold">
              {t("about.lead")}
            </div>
            <div className="mt-2 font-display text-2xl text-foreground">
              {siteConfig.photographer}
              <span className="ml-3 text-sm font-normal text-muted-foreground">
                ({siteConfig.photographerFullName})
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            {[
              { k: "500+", v: "Sessions Delivered" },
              { k: "5 Days", v: "Photography Delivery" },
              { k: "7 Days", v: "Videography Delivery" },
              { k: "5★", v: "Guest Rating" },
            ].map((s) => (
              <div key={s.v} className="border-l border-gold/40 pl-4">
                <div className="font-display text-3xl text-gradient-gold md:text-4xl">{s.k}</div>
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
