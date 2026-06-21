import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import * as XLSX from "xlsx";
import { LogOut, Search, Trash2, Download, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sharm Cinematic" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Booking = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  hotel_name: string;
  preferred_date: string;
  preferred_time: string;
  guests: number;
  service_type: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [visitors, setVisitors] = useState({ today: 0, week: 0, todayUnique: 0, weekUnique: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Booking["status"]>("all");

  async function loadVisitors() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("visitor_events")
      .select("created_at, session_id")
      .gte("created_at", weekAgo);
    if (error || !data) return;
    const today: typeof data = [];
    const week = data;
    const todaySessions = new Set<string>();
    const weekSessions = new Set<string>();
    for (const r of data) {
      if (r.session_id) weekSessions.add(r.session_id);
      if (r.created_at >= startOfDay) {
        today.push(r);
        if (r.session_id) todaySessions.add(r.session_id);
      }
    }
    setVisitors({
      today: today.length,
      week: week.length,
      todayUnique: todaySessions.size,
      weekUnique: weekSessions.size,
    });
  }


  async function load() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    const admin = (roles ?? []).some((r) => r.role === "admin");
    setIsAdmin(admin);
    if (!admin) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setBookings((data ?? []) as Booking[]);
    await loadVisitors();
    setLoading(false);
  }


  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("bookings-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          setBookings((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Booking;
              if (prev.some((b) => b.id === row.id)) return prev;
              toast.success("New booking received", { description: row.full_name });
              return [row, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Booking;
              return prev.map((b) => (b.id === row.id ? row : b));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Booking;
              return prev.filter((b) => b.id !== row.id);
            }
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function updateStatus(id: string, newStatus: Booking["status"]) {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking deleted");
    setBookings((b) => b.filter((x) => x.id !== id));
  }

  function exportXlsx() {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `bookings-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function exportCsv() {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        b.full_name.toLowerCase().includes(s) ||
        b.email.toLowerCase().includes(s) ||
        b.phone.toLowerCase().includes(s) ||
        b.hotel_name.toLowerCase().includes(s)
      );
    });
  }, [bookings, search, status]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      upcoming: bookings.filter((b) => b.preferred_date >= today && b.status !== "cancelled" && b.status !== "completed").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
    };
  }, [bookings]);

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-onyx px-6">
        <Toaster theme="dark" position="top-center" />
        <div className="max-w-md rounded-sm border border-border bg-card p-10 text-center shadow-luxe">
          <ShieldAlert className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-display text-2xl text-foreground">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but has no admin role yet. Contact the site owner to grant
            you the <code className="text-gold">admin</code> role.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={signOut} className="rounded-full border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold">
              Sign out
            </button>
            <Link to="/" className="rounded-full bg-gradient-gold px-5 py-2 text-xs uppercase tracking-[0.3em] text-primary-foreground">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" />
      <header className="border-b border-border bg-onyx/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-wide text-gradient-gold">Sharm</span>
            <span className="font-display text-xl tracking-[0.3em] text-foreground/90">CINEMATIC</span>
            <span className="ml-3 rounded-full border border-gold/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gold">
              Admin
            </span>
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { k: "Total", v: stats.total },
            { k: "Pending", v: stats.pending },
            { k: "Upcoming", v: stats.upcoming },
            { k: "Confirmed", v: stats.confirmed },
          ].map((s) => (
            <div key={s.k} className="rounded-sm border border-border bg-card p-6">
              <div className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">{s.k}</div>
              <div className="mt-2 font-display text-4xl text-gradient-gold">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-sm border border-border bg-card p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, hotel..."
              className="w-full rounded-sm border border-border bg-background/60 py-2 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | Booking["status"])}
            className="rounded-sm border border-border bg-background/60 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={exportXlsx} className="flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-xs uppercase tracking-[0.25em] text-primary-foreground">
            <Download className="h-3.5 w-3.5" /> Excel
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs uppercase tracking-[0.25em] text-gold">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-sm border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-onyx/60">
                <tr className="text-left text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                  <th className="px-4 py-4">Guest</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Hotel</th>
                  <th className="px-4 py-4">Date / Time</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Guests</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Loading...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No bookings yet.</td></tr>
                )}
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t border-border hover:bg-onyx/40">
                    <td className="px-4 py-4">
                      <div className="font-medium text-foreground">{b.full_name}</div>
                      {b.notes && <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{b.notes}</div>}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      <div>{b.email}</div>
                      <div className="text-xs">{b.phone}</div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{b.hotel_name}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      <div>{b.preferred_date}</div>
                      <div className="text-xs">{b.preferred_time}</div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{b.service_type || "—"}</td>
                    <td className="px-4 py-4 text-muted-foreground">{b.guests}</td>
                    <td className="px-4 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                        className="rounded-sm border border-border bg-background/60 px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => remove(b.id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
