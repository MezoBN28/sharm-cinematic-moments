import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold-glow transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={siteConfig.phoneHref}
        aria-label="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-onyx/80 text-gold backdrop-blur-xl transition-transform hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
