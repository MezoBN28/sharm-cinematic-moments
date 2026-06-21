import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Sharm Cinematic" },
      { name: "description", content: "Your booking has been received. We will contact you shortly." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <I18nProvider>
      <Inner />
    </I18nProvider>
  );
}

function Inner() {
  const { t } = useI18n();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-onyx px-6 py-16 text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_30%,var(--gold)_0%,transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl rounded-sm border border-gold/30 bg-card/60 p-12 text-center shadow-luxe backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-onyx/60 text-gold shadow-gold-glow"
        >
          <CheckCircle2 className="h-10 w-10" strokeWidth={1.25} />
        </motion.div>
        <div className="mt-6 text-[0.65rem] uppercase tracking-[0.45em] text-gold">Sharm Cinematic</div>
        <h1 className="mt-4 font-display text-4xl text-gradient-gold md:text-5xl">{t("thanks.title")}</h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{t("thanks.desc")}</p>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-gradient-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow transition-transform hover:scale-105"
        >
          {t("thanks.home")}
        </Link>
      </motion.div>
    </div>
  );
}
