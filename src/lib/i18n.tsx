import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.portfolio": "Portfolio",
  "nav.services": "Services",
  "nav.why": "Why Us",
  "nav.contact": "Contact",
  "nav.book": "Book Now",

  "hero.location": "Sharm El Sheikh · Egypt",
  "hero.role": "Professional Cinematic Videographer & Photographer",
  "hero.desc": "Cinematic videography & premium photography for unforgettable moments inside Sharm El Sheikh's finest hotels and resorts.",
  "hero.cta1": "Book Your Session",
  "hero.cta2": "View Portfolio",
  "hero.scroll": "Scroll",

  "about.eyebrow": "About Sharm Cinematic",
  "about.titleA": "Memories crafted",
  "about.titleB": "like cinema.",
  "about.desc": "Sharm Cinematic is a private photography & videography service dedicated to guests of Sharm El Sheikh's most prestigious hotels and resorts. We come to you — directing intimate, cinematic sessions that transform your stay into a film you'll relive forever.",
  "about.lead": "Lead Photographer",

  "portfolio.eyebrow": "Portfolio",
  "portfolio.titleA": "A gallery of",
  "portfolio.titleB": "light & story.",
  "portfolio.desc": "A curated selection of cinematic frames captured across Sharm El Sheikh.",

  "services.eyebrow": "Our Services",
  "services.titleA": "Sessions designed",
  "services.titleB": "for every story.",
  "services.desc": "From intimate couples shoots to full cinematic productions — every session is private, directed, and crafted around you.",

  "why.eyebrow": "Why Choose Us",
  "why.titleA": "The Sharm Cinematic",
  "why.titleB": "difference.",

  "test.eyebrow": "Kind Words",
  "test.titleA": "Stories from",
  "test.titleB": "our guests.",

  "contact.eyebrow": "Get in Touch",
  "contact.titleA": "Let's make something",
  "contact.titleB": "unforgettable.",
  "contact.desc": "Reach out directly — we respond within the hour during daylight in Sharm El Sheikh.",
  "contact.call": "Call",
  "contact.whatsapp": "WhatsApp",
  "contact.email": "Email",
  "contact.instagram": "Instagram",

  "book.eyebrow": "Reserve Your Session",
  "book.titleA": "Book your",
  "book.titleB": "cinematic experience.",
  "book.desc": "Tell us about your stay. We'll personally confirm date, location, and details within hours.",
  "book.fullName": "Full Name",
  "book.phone": "Phone Number",
  "book.emailAddr": "Email Address",
  "book.hotel": "Hotel Name",
  "book.date": "Preferred Date",
  "book.time": "Preferred Time",
  "book.guests": "Number of Guests",
  "book.service": "Service Type",
  "book.serviceSelect": "Select a service",
  "book.notes": "Notes",
  "book.notesPh": "Anything we should know? Special moments, locations, ideas...",
  "book.submit": "Request Booking",
  "book.sending": "Sending...",

  "footer.explore": "Explore",
  "footer.contact": "Contact",
  "footer.adminLogin": "Admin Login",
  "footer.tagline": "Cinematic videography & premium photography for travelers staying in Sharm El Sheikh's finest hotels and resorts.",

  "thanks.title": "Thank you for your booking!",
  "thanks.desc": "Our team will contact you shortly via WhatsApp or Email.",
  "thanks.home": "Back to Home",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.about": "من نحن",
  "nav.portfolio": "أعمالنا",
  "nav.services": "الخدمات",
  "nav.why": "لماذا نحن",
  "nav.contact": "تواصل معنا",
  "nav.book": "احجز الآن",

  "hero.location": "شرم الشيخ · مصر",
  "hero.role": "مصور سينمائي ومصور فوتوغرافي محترف",
  "hero.desc": "تصوير سينمائي وفوتوغرافي راقي للحظات لا تُنسى داخل أفخم فنادق ومنتجعات شرم الشيخ.",
  "hero.cta1": "احجز جلستك",
  "hero.cta2": "شاهد الأعمال",
  "hero.scroll": "تمرير",

  "about.eyebrow": "عن شرم سينماتيك",
  "about.titleA": "ذكريات بصياغة",
  "about.titleB": "سينمائية.",
  "about.desc": "شرم سينماتيك خدمة تصوير خاصة مخصصة لضيوف أفخم فنادق ومنتجعات شرم الشيخ. نأتي إليك لإخراج جلسات حميمية سينمائية تحوّل إقامتك إلى فيلم لا يُنسى.",
  "about.lead": "المصور الرئيسي",

  "portfolio.eyebrow": "معرض الأعمال",
  "portfolio.titleA": "معرض من",
  "portfolio.titleB": "الضوء والحكاية.",
  "portfolio.desc": "مجموعة مختارة من اللقطات السينمائية الملتقطة في شرم الشيخ.",

  "services.eyebrow": "خدماتنا",
  "services.titleA": "جلسات مصممة",
  "services.titleB": "لكل قصة.",
  "services.desc": "من جلسات الأزواج الحميمية إلى الإنتاج السينمائي الكامل — كل جلسة خاصة ومُدارة ومصممة حولك.",

  "why.eyebrow": "لماذا تختارنا",
  "why.titleA": "تميُّز",
  "why.titleB": "شرم سينماتيك.",

  "test.eyebrow": "كلمات طيبة",
  "test.titleA": "قصص من",
  "test.titleB": "ضيوفنا.",

  "contact.eyebrow": "تواصل معنا",
  "contact.titleA": "لنصنع شيئًا",
  "contact.titleB": "لا يُنسى.",
  "contact.desc": "تواصل معنا مباشرة — نرد خلال ساعة في ساعات النهار بشرم الشيخ.",
  "contact.call": "اتصال",
  "contact.whatsapp": "واتساب",
  "contact.email": "بريد إلكتروني",
  "contact.instagram": "إنستغرام",

  "book.eyebrow": "احجز جلستك",
  "book.titleA": "احجز",
  "book.titleB": "تجربتك السينمائية.",
  "book.desc": "أخبرنا عن إقامتك. سنؤكد التاريخ والموقع والتفاصيل خلال ساعات.",
  "book.fullName": "الاسم الكامل",
  "book.phone": "رقم الهاتف",
  "book.emailAddr": "البريد الإلكتروني",
  "book.hotel": "اسم الفندق",
  "book.date": "التاريخ المفضل",
  "book.time": "الوقت المفضل",
  "book.guests": "عدد الأشخاص",
  "book.service": "نوع الخدمة",
  "book.serviceSelect": "اختر خدمة",
  "book.notes": "ملاحظات",
  "book.notesPh": "هل هناك شيء يجب أن نعرفه؟ لحظات خاصة، مواقع، أفكار...",
  "book.submit": "إرسال الطلب",
  "book.sending": "جاري الإرسال...",

  "footer.explore": "استكشف",
  "footer.contact": "تواصل",
  "footer.adminLogin": "دخول الإدارة",
  "footer.tagline": "تصوير سينمائي وفوتوغرافي راقي للمسافرين في أفخم فنادق ومنتجعات شرم الشيخ.",

  "thanks.title": "شكرًا لحجزك!",
  "thanks.desc": "سيتواصل فريقنا معك قريبًا عبر واتساب أو البريد الإلكتروني.",
  "thanks.home": "العودة إلى الرئيسية",
};

const dicts: Record<Lang, Dict> = { en, ar };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dir: "ltr" | "rtl" };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && window.localStorage.getItem("lang")) as Lang | null;
    if (stored === "en" || stored === "ar") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem("lang", l); } catch {}
  };

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (k) => dicts[lang][k] ?? dicts.en[k] ?? k,
    dir: lang === "ar" ? "rtl" : "ltr",
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => dicts.en[k] ?? k, dir: "ltr" as const };
  return ctx;
}
