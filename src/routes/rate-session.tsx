import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, Instagram, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/site-config";

type Search = { id?: string };

export const Route = createFileRoute("/rate-session")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Rate Your Session — Sharm Cinematic" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RateSessionPage,
});

type Status = "loading" | "ready" | "already" | "missing" | "submitted" | "error";

function RateSessionPage() {
  const { id } = Route.useSearch();
  const [status, setStatus] = useState<Status>("loading");
  const [name, setName] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) { setStatus("missing"); return; }
      const { data, error } = await (supabase.rpc as any)("get_review_booking", { _id: id });
      if (cancelled) return;
      if (error || !data || (Array.isArray(data) && data.length === 0)) {
        setStatus("missing"); return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      setName(row.full_name);
      setStatus(row.already_reviewed ? "already" : "ready");
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function submit() {
    if (!id || rating < 1) { toast.error("Please choose a star rating"); return; }
    setSubmitting(true);
    const { error } = await (supabase.rpc as any)("submit_review", {
      _booking_id: id,
      _rating: rating,
      _comment: comment,
    });
    setSubmitting(false);
    if (error) {
      if (error.message?.includes("already_reviewed")) setStatus("already");
      else toast.error(error.message || "Could not submit review");
      return;
    }
    setStatus("submitted");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-onyx px-6 py-16 text-foreground">
      <Toaster theme="dark" position="top-center" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_25%,var(--gold)_0%,transparent_60%)]" />

      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-gold" /> Loading your session…
          </motion.div>
        )}

        {(status === "missing" || status === "error") && (
          <Panel key="m">
            <h1 className="font-display text-3xl text-gradient-gold md:text-4xl">Invalid review link</h1>
            <p className="mt-4 text-muted-foreground">This review link is not valid. Please contact us if you believe this is a mistake.</p>
            <HomeButton />
          </Panel>
        )}

        {status === "already" && (
          <Panel key="a">
            <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.25} />
            <h1 className="mt-5 font-display text-3xl text-gradient-gold md:text-4xl">Thank you!</h1>
            <p className="mt-4 text-muted-foreground">You have already submitted your review for this session.</p>
            <InstagramCTA />
            <HomeButton />
          </Panel>
        )}

        {status === "submitted" && (
          <Panel key="s">
            <motion.div
              initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-onyx/60 text-gold shadow-gold-glow">
              <CheckCircle2 className="h-10 w-10" strokeWidth={1.25} />
            </motion.div>
            <h1 className="mt-6 font-display text-4xl text-gradient-gold md:text-5xl">Thank you, {name.split(" ")[0]}!</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Your review means the world to us. Every kind word fuels the next cinematic story.
            </p>
            <InstagramCTA />
            <HomeButton />
          </Panel>
        )}

        {status === "ready" && (
          <Panel key="r">
            <div className="text-[0.65rem] uppercase tracking-[0.45em] text-gold">Sharm Cinematic</div>
            <h1 className="mt-3 font-display text-4xl text-gradient-gold md:text-5xl">Rate your session</h1>
            <p className="mt-3 text-muted-foreground">Hi {name.split(" ")[0]} — how was your experience?</p>

            <div
              className="mt-8 flex justify-center gap-2"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hover || rating);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} stars`}
                    className="group relative p-2 transition-transform duration-200 hover:scale-125 active:scale-110"
                  >
                    <Star
                      className={`h-11 w-11 transition-all duration-300 ${
                        active
                          ? "fill-gold text-gold drop-shadow-[0_0_14px_var(--gold)]"
                          : "text-muted-foreground/40"
                      }`}
                      strokeWidth={1.25}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 h-4 text-xs uppercase tracking-[0.3em] text-gold">
              {(hover || rating) > 0 && ["", "Poor", "Fair", "Good", "Great", "Cinematic"][hover || rating]}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 2000))}
              rows={5}
              placeholder="Share a few words about your experience…"
              className="mt-6 w-full resize-none rounded-sm border border-border bg-background/60 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />

            <button
              onClick={submit}
              disabled={submitting || rating < 1}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Review"}
            </button>
          </Panel>
        )}
      </AnimatePresence>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl rounded-sm border border-gold/30 bg-card/60 p-10 text-center shadow-luxe backdrop-blur-xl md:p-12"
    >
      {children}
    </motion.div>
  );
}

function InstagramCTA() {
  return (
    <a
      href={siteConfig.instagramHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-gold/40 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold shadow-gold-glow transition-all hover:scale-[1.02] hover:bg-gold/20"
    >
      <Instagram className="h-5 w-5 transition-transform group-hover:rotate-6" />
      Follow our cinematic moments on Instagram
    </a>
  );
}

function HomeButton() {
  return (
    <Link
      to="/"
      className="mt-5 inline-flex text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground hover:text-gold"
    >
      ← Back to Home
    </Link>
  );
}
