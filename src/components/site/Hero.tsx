import { motion } from "framer-motion";
import heroAsset from "@/assets/hero.png.asset.json";

export function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <img
        src={heroAsset.url}
        alt="Aerial cinematic view of a luxury Sharm El Sheikh resort at sunset"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-onyx/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-gold md:text-xs"
        >
          Sharm El Sheikh · Egypt
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <h1 className="font-display text-[4.5rem] leading-none tracking-[0.05em] text-gradient-gold md:text-[7rem] lg:text-[8.5rem]">
            Luca
          </h1>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-5 text-[0.65rem] uppercase tracking-[0.5em] text-foreground/85 md:text-xs">
            Professional Cinematic Videographer &amp; Photographer
          </p>
          <p className="mt-3 font-display text-xs italic tracking-[0.2em] text-foreground/55 md:text-sm">
            Khalid Ramadan Shaaban
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="mt-10 max-w-2xl text-sm text-foreground/75 md:text-base"
        >
          Cinematic videography &amp; premium photography for unforgettable
          moments inside Sharm El Sheikh's finest hotels and resorts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#booking"
            className="group relative overflow-hidden rounded-full bg-gradient-gold px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-gold-glow transition-transform hover:scale-105"
          >
            Book Your Session
          </a>
          <a
            href="#portfolio"
            className="rounded-full border border-gold/60 px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-gold/10"
          >
            View Portfolio
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gold/70">
          <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
