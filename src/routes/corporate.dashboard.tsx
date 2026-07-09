import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useUser } from "@/lib/auth-store";

export const Route = createFileRoute("/corporate/dashboard")({
  head: () => ({ meta: [{ title: "Corporate Dashboard — SAGS" }] }),
  component: CorpDashboard,
});

const EMPLOYEES = [
  { name: "Sarah Chen", role: "Bar Manager", course: "TABC Seller-Server", progress: 100, cert: "SAGS-TX-000201" },
  { name: "Miguel Ortiz", role: "Server", course: "TABC Seller-Server", progress: 85, cert: null },
  { name: "Jamie Robinson", role: "Server", course: "TABC Seller-Server", progress: 62, cert: null },
  { name: "Priya Patel", role: "Host", course: "Food Handler", progress: 100, cert: "SAGS-TX-000198" },
  { name: "Devon Lee", role: "Cook", course: "Food Handler", progress: 45, cert: null },
  { name: "Ashley Kim", role: "Bartender", course: "TABC Seller-Server", progress: 0, cert: null },
  { name: "Marcus Grant", role: "Manager", course: "Food Manager ANSI", progress: 30, cert: null },
];

function CorpDashboard() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) navigate({ to: "/auth", search: { mode: "signin" } });
    }, 100);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (!user) return <div className="p-12 text-center font-mono text-xs text-muted-foreground">Loading…</div>;

  const completed = EMPLOYEES.filter(e => e.progress === 100).length;
  const avgProgress = Math.round(EMPLOYEES.reduce((s, e) => s + e.progress, 0) / EMPLOYEES.length);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-in">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Corporate Portal · Rivera Group LLC</div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Team compliance overview.</h1>
          </div>
          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-4">
            <Stat label="Seats Purchased" value={50} />
            <Stat label="Seats Assigned" value={EMPLOYEES.length} />
            <Stat label="Certified" value={completed} />
            <Stat label="Avg Progress" value={`${avgProgress}%`} />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Employee Roster</h2>
            <div className="flex gap-2">
              <button className="border border-foreground px-4 py-2 text-xs font-bold uppercase">Invite via Email</button>
              <button className="bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground">Buy More Seats</button>
            </div>
          </div>
          <div className="border border-border">
            <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 border-b border-border bg-secondary/40 p-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Employee</span>
              <span>Role</span>
              <span>Course</span>
              <span>Progress</span>
              <span>Certificate</span>
            </div>
            {EMPLOYEES.map((e, i) => (
              <div
                key={e.name}
                className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 border-b border-border p-3 text-sm last:border-b-0 hover:bg-secondary/20"
              >
                <span className="font-semibold">{e.name}</span>
                <span className="text-muted-foreground">{e.role}</span>
                <span>{e.course}</span>
                <span className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${e.progress}%` }} />
                  </div>
                  <span className="font-mono text-xs">{e.progress}%</span>
                </span>
                <span>
                  {e.cert ? (
                    <Link to="/verify/$certId" params={{ certId: e.cert }} className="font-mono text-xs text-primary underline underline-offset-2">
                      {e.cert}
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground">PENDING</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Voucher Codes</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border border-border p-3 text-center">
                <div className="font-mono text-xs">VCH-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
                <div className={`mt-1 font-mono text-[9px] ${i < 5 ? "text-muted-foreground" : "text-primary"}`}>
                  {i < 5 ? "REDEEMED" : "AVAILABLE"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-background p-6">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-4xl font-extrabold">{value}</div>
    </div>
  );
}
