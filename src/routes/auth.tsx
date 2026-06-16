import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Sharm Cinematic" },
      { name: "description", content: "Admin access for Sharm Cinematic." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You can sign in now.");
      setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/admin" });
  }

  const field =
    "w-full rounded-sm border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-onyx px-6">
      <Toaster theme="dark" position="top-center" />
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-10 shadow-luxe">
        <Link to="/" className="block text-center">
          <span className="font-display text-2xl tracking-wide text-gradient-gold">Sharm</span>{" "}
          <span className="font-display text-2xl tracking-[0.3em] text-foreground/90">CINEMATIC</span>
        </Link>
        <h1 className="mt-8 text-center font-display text-2xl text-foreground">
          {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-gold">Email</label>
            <input name="email" type="email" required className={field} />
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-gold">Password</label>
            <input name="password" type="password" required minLength={6} className={field} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-gold-glow disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 block w-full text-center text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
        >
          {mode === "signin" ? "Create admin account" : "Have an account? Sign in"}
        </button>
        <Link to="/" className="mt-4 block text-center text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
