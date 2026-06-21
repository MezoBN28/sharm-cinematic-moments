import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative border-t border-border bg-onyx py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wide text-gradient-gold">Sharm</span>
            <span className="font-display text-2xl tracking-[0.3em] text-foreground/90">CINEMATIC</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <a
            href={siteConfig.instagramHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Follow Sharm Cinematic on Instagram"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gradient-to-br from-gold/10 to-transparent px-4 py-2 text-xs uppercase tracking-[0.25em] text-gold transition-all hover:scale-105 hover:border-gold hover:shadow-gold-glow"
          >
            <Instagram className="h-4 w-4" /> {siteConfig.instagram}
          </a>
        </div>

        <div>
          <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{t("footer.explore")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#portfolio" className="hover:text-gold">{t("nav.portfolio")}</a></li>
            <li><a href="#services" className="hover:text-gold">{t("nav.services")}</a></li>
            <li><a href="#booking" className="hover:text-gold">{t("nav.book")}</a></li>
            <li><Link to="/auth" className="hover:text-gold">{t("footer.adminLogin")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{t("footer.contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><a href={siteConfig.phoneHref} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4" /> {siteConfig.phone}</a></li>
            <li><a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
            <li><a href={siteConfig.emailHref} className="flex items-center gap-2 hover:text-gold"><Mail className="h-4 w-4" /> {siteConfig.email}</a></li>
            <li><a href={siteConfig.instagramHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold"><Instagram className="h-4 w-4" /> {siteConfig.instagram}</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border px-6 pt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} Sharm Cinematic</span>
        <span className="text-gold/80">Photography by {siteConfig.photographer} · {siteConfig.photographerFullName}</span>
        <span>{siteConfig.location}</span>
      </div>
    </footer>
  );
}
