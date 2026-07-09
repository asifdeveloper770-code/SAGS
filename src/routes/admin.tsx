import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useUser } from "@/lib/auth-store";
import { COURSES } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Control Center — SAGS" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) navigate({ to: "/auth", search: { mode: "signin" } });
    }, 100);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (!user) return <div className="p-12 text-center font-mono text-xs text-muted-foreground">Loading…</div>;

  // Mocked metrics
  const revenue = 148230;
  const activeStudents = 2841;
  const certsIssued = 4127;
  const completionRate = 82;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-in">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Administrator · Control Center</div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Platform overview.</h1>
          </div>
          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-4">
            <Stat label="Revenue (MTD)" value={`$${revenue.toLocaleString()}`} />
            <Stat label="Active Students" value={activeStudents.toLocaleString()} />
            <Stat label="Certs Issued" value={certsIssued.toLocaleString()} />
            <Stat label="Completion Rate" value={`${completionRate}%`} />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
          {/* Chart panel */}
          <div className="border border-border p-6 lg:col-span-2">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Enrollment · Last 12 Weeks</h2>
            <div className="mt-6 flex h-56 items-end gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 30 + Math.abs(Math.sin(i * 1.3) * 70) + i * 4;
                return (
                  <div key={i} className="flex-1 bg-primary/80 transition-all hover:bg-primary" style={{ height: `${h}%` }} />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground">
              <span>W1</span><span>W6</span><span>W12</span>
            </div>
          </div>

          <div className="border border-border p-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Certificate Inventory</h2>
            <div className="mt-6 space-y-4">
              {[
                { state: "TX", used: 1892, total: 3000 },
                { state: "CA", used: 741, total: 2000 },
                { state: "IL", used: 610, total: 1500 },
                { state: "OH", used: 340, total: 1000 },
              ].map(row => {
                const pct = Math.round((row.used / row.total) * 100);
                return (
                  <div key={row.state}>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="font-bold">{row.state}</span>
                      <span className="text-muted-foreground">{row.used} / {row.total}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-secondary">
                      <div className={`h-full ${pct > 70 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User management */}
            <div className="border border-border p-6">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">User Management</h2>
              <input placeholder="Search students by email or ID…" className="mt-4 w-full border border-border bg-background px-3 py-2 text-sm" />
              <div className="mt-4 space-y-2">
                {[
                  { name: "Marcus J. Rivera", email: "marcus@rivera.co", state: "TX" },
                  { name: "Elena Whitfield", email: "elena@w.io", state: "CA" },
                  { name: "Devon Park", email: "devon.p@mail.io", state: "IL" },
                  { name: "Aaron Blake", email: "ablake@mail.io", state: "OH" },
                ].map(u => (
                  <div key={u.email} className="flex items-center justify-between border border-border p-3">
                    <div>
                      <div className="text-sm font-semibold">{u.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{u.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-mono text-[10px] font-bold text-primary">{u.state}</span>
                      <button className="border border-border px-2 py-1 text-[10px] font-bold uppercase hover:border-foreground">Edit</button>
                      <button className="border border-border px-2 py-1 text-[10px] font-bold uppercase hover:border-foreground">Reissue</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit log */}
            <div className="border border-border p-6">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Audit Log</h2>
              <div className="mt-4 space-y-2 font-mono text-[11px]">
                {[
                  ["09:41:23", "CERT_ISSUED", "SAGS-TX-000201 → Sarah Chen"],
                  ["09:38:11", "QUIZ_PASSED", "user:1204 module:al-tabc-m2"],
                  ["09:35:47", "ID_VERIFY_FAIL", "user:1188 course:al-tabc [locked]"],
                  ["09:31:02", "ENROLLMENT", "50 seats · Rivera Group LLC"],
                  ["09:22:19", "CERT_ISSUED", "SAGS-CA-000098 → Elena Whitfield"],
                  ["09:14:55", "REFUND", "user:1102 course:ad-mgr"],
                ].map(([t, ev, d], i) => (
                  <div key={i} className="grid grid-cols-[80px_140px_1fr] gap-3 border-b border-border pb-2">
                    <span className="text-muted-foreground">{t}</span>
                    <span className={`font-bold ${ev === "ID_VERIFY_FAIL" ? "text-destructive" : ev === "REFUND" ? "text-accent" : "text-primary"}`}>{ev}</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Program Performance</h2>
          <div className="mt-4 grid gap-px border border-border bg-border md:grid-cols-3">
            {COURSES.slice(0, 6).map(c => (
              <div key={c.id} className="bg-background p-4">
                <div className="font-mono text-[10px] font-bold text-muted-foreground">{c.state}</div>
                <div className="mt-1 text-sm font-bold">{c.title}</div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>ENROLLED {Math.floor(Math.random() * 500 + 100)}</span>
                  <span>PASS {(80 + Math.random() * 15).toFixed(0)}%</span>
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
