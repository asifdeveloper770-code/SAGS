import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useUser } from "@/lib/auth-store";
import { COURSES, courseById } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — SAGS" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      // Wait a tick to allow hydration
      const t = setTimeout(() => {
        if (!user) navigate({ to: "/auth", search: { mode: "signin" } });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="py-24 text-center font-mono text-xs text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const enrollments = user.enrolledCourseIds.map(id => courseById(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div className="animate-in">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Student Portal</div>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Welcome, {user.fullName}.</h1>
            </div>
            <Link to="/catalog" className="hidden bg-primary px-6 py-3 font-bold text-primary-foreground md:block">
              Browse Catalog
            </Link>
          </div>

          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-4">
            <Stat label="Enrolled" value={enrollments.length} />
            <Stat label="Completed" value={Object.values(user.progress).filter(p => p.certId).length} />
            <Stat label="In Progress" value={enrollments.length - Object.values(user.progress).filter(p => p.certId).length} />
            <Stat label="Certificates" value={Object.values(user.progress).filter(p => p.certId).length} />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Active Enrollments</h2>
          {enrollments.length === 0 ? (
            <div className="mt-6 border border-border p-12 text-center">
              <p className="text-muted-foreground">You have no active enrollments yet.</p>
              <Link to="/catalog" className="mt-6 inline-block bg-primary px-6 py-3 font-bold text-primary-foreground">
                Enroll in a Course
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
              {enrollments.map(c => {
                if (!c) return null;
                const p = user.progress[c.id];
                const totalLessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
                const completed = p?.completedLessons.length ?? 0;
                const pct = Math.round((completed / totalLessons) * 100);
                return (
                  <div key={c.id} className="bg-background p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                          {c.stateLabel}
                        </div>
                        <h3 className="mt-1 text-xl font-bold">{c.title}</h3>
                      </div>
                      {p?.certId && (
                        <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                          CERTIFIED
                        </span>
                      )}
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{completed} / {totalLessons} LESSONS</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <Link
                        to="/learn/$courseId"
                        params={{ courseId: c.id }}
                        className="flex-1 bg-foreground py-2 text-center text-xs font-bold uppercase text-background"
                      >
                        {pct === 0 ? "Start" : pct === 100 ? "Review" : "Resume"}
                      </Link>
                      {p?.certId && (
                        <Link
                          to="/verify/$certId"
                          params={{ certId: p.certId }}
                          className="border border-foreground px-4 py-2 text-xs font-bold uppercase"
                        >
                          Cert
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="mt-16 font-mono text-xs font-bold uppercase tracking-widest text-primary">Recommended</h2>
          <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.slice(0, 4).map(c => (
              <Link
                key={c.id}
                to="/catalog/$courseId"
                params={{ courseId: c.id }}
                className="bg-background p-4 hover:bg-secondary/40"
              >
                <div className="font-mono text-[10px] font-bold text-muted-foreground">{c.state}</div>
                <div className="mt-2 text-sm font-bold">{c.title}</div>
                <div className="mt-2 font-mono text-xs">${c.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background p-6">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-4xl font-extrabold">{value}</div>
    </div>
  );
}
