import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const next = lang === "en" ? "ar" : "en";
  const label = lang === "en" ? "العربية" : "English";
  return (
    <button
      onClick={() => setLang(next)}
      aria-label="Toggle language"
      className={`inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/10 ${compact ? "" : ""}`}
    >
      <Languages className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
