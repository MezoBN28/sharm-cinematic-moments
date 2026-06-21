import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "sc_visitor_session";
const LAST_PING_KEY = "sc_visitor_last";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export async function trackVisit(path: string) {
  if (typeof window === "undefined") return;
  try {
    // throttle: don't record more than once per 30 min per session per path
    const key = `${LAST_PING_KEY}:${path}`;
    const last = Number(localStorage.getItem(key) ?? 0);
    if (Date.now() - last < 30 * 60 * 1000) return;
    localStorage.setItem(key, String(Date.now()));

    await supabase.from("visitor_events").insert({
      path,
      session_id: getSessionId(),
    });
  } catch {
    // silent
  }
}
