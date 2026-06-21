import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Portfolio } from "@/components/site/Portfolio";
import { Services } from "@/components/site/Services";
import { WhyChoose } from "@/components/site/WhyChoose";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { BookingForm } from "@/components/site/BookingForm";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { MobileBookButton } from "@/components/site/MobileBookButton";
import { I18nProvider } from "@/lib/i18n";
import { trackVisit } from "@/lib/visitor-tracker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sharm Cinematic — Luxury Photography in Sharm El Sheikh" },
      {
        name: "description",
        content:
          "Professional cinematic photography for tourists, couples, families and honeymoon guests at luxury hotels and resorts in Sharm El Sheikh, Egypt.",
      },
      { property: "og:title", content: "Sharm Cinematic — Luxury Photography in Sharm El Sheikh" },
      {
        property: "og:description",
        content:
          "Capture your Sharm experience forever. Private cinematic photoshoots inside Sharm El Sheikh's finest resorts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sharm Cinematic — Luxury Photography in Sharm El Sheikh" },
      {
        name: "twitter:description",
        content:
          "Private cinematic photoshoots inside Sharm El Sheikh's finest resorts.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Sharm Cinematic",
          image: "/og-image.jpg",
          description:
            "Luxury cinematic photography service operating inside hotels and resorts in Sharm El Sheikh.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Sharm El Sheikh",
            addressCountry: "EG",
          },
          areaServed: "Sharm El Sheikh",
          priceRange: "$$$",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    void trackVisit("/");
  }, []);

  return (
    <I18nProvider>
      <div className="bg-background text-foreground">
        <Toaster theme="dark" position="top-center" />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Portfolio />
          <Services />
          <WhyChoose />
          <Testimonials />
          <Contact />
          <BookingForm />
        </main>
        <Footer />
        <FloatingActions />
        <MobileBookButton />
      </div>
    </I18nProvider>
  );
}
