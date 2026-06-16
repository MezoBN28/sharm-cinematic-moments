import { motion } from "framer-motion";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Cinematic photography in Sharm El Sheikh at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-8 text-[0.7rem] uppercase tracking-[0.5em] text-gold"
        >
          Sharm El Sheikh · Egypt
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display text-5xl leading-[1.05] text-foreground md:text-7xl lg:text-8xl"
        >
          Capture Your Sharm
          <br />
          Experience <em className="text-gradient-gold not-italic">Forever</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-8 max-w-2xl text-base text-foreground/80 md:text-lg"
        >
          Professional cinematic photography for unforgettable moments inside
          Sharm El Sheikh's finest hotels and resorts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
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
