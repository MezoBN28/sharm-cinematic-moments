import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { siteConfig } from "@/lib/site-config";

export function Contact() {
  const items = [
    { icon: Phone, label: "Call", value: siteConfig.phone, href: siteConfig.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: siteConfig.whatsapp, href: siteConfig.whatsappHref },
    { icon: Mail, label: "Email", value: siteConfig.email, href: siteConfig.emailHref },
  ];
  return (
    <section id="contact" className="relative bg-gradient-onyx py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Get in Touch"
          title={<>Let's make something <em className="text-gradient-gold not-italic">unforgettable.</em></>}
          description="Reach out directly — we respond within the hour during daylight in Sharm El Sheikh."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.a
              key={it.label}
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col items-center rounded-sm border border-border bg-card p-10 text-center transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-gold-glow"
            >
              <it.icon className="h-9 w-9 text-gold" strokeWidth={1.25} />
              <div className="mt-6 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                {it.label}
              </div>
              <div className="mt-2 font-display text-xl text-foreground">
                {it.value}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
