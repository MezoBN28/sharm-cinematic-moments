import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function MobileBookButton() {
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const booking = document.getElementById("booking");
      const bookingTop = booking?.getBoundingClientRect().top ?? Infinity;
      // Show after scrolling past hero, hide when booking form is in view
      setShow(y > 400 && bookingTop > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#booking"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow md:hidden"
        >
          <Calendar className="h-4 w-4" />
          {t("nav.book")}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
