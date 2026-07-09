import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORIES, COURSES, STATES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "SAGS — Accredited Multi-State Training & Certification" }] }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [state, setState] = useState<string>("");
  const featured = useMemo(() => COURSES.slice(0, 4), []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative border-b border-border py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="animate-in lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Accredited National Authority
                </span>
              </div>
              <h1 className="text-balance text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
                Compliance <span className="text-primary">redefined</span> for global standards.
              </h1>
              <p className="mt-8 max-w-[50ch] text-lg text-muted-foreground md:text-xl">
                State-approved training and professional certification delivered through a high-fidelity,
                secure multi-state portal.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <label className="absolute -top-2.5 left-3 z-10 bg-background px-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    Select Jurisdiction
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="h-14 w-full appearance-none rounded-none border border-foreground bg-transparent px-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Jurisdictions</option>
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => navigate({ to: "/catalog", search: { state: state || undefined } })}
                  className="h-14 bg-foreground px-8 font-bold text-background transition-colors hover:bg-primary"
                >
                  View Catalog
                </button>
              </div>
            </div>

            <div className="animate-in lg:col-span-5" style={{ animationDelay: "150ms" }}>
              <div className="aspect-[4/5] w-full border border-border bg-card p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Certificate Registry
                  </span>
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                </div>
                <div className="space-y-3">
                  {[
                    { id: "SAGS-TX-000142", name: "Marcus J. Rivera", course: "TABC Seller-Server", status: "ACTIVE" },
                    { id: "SAGS-CA-000091", name: "Elena Whitfield", course: "California RBS", status: "ACTIVE" },
                    { id: "SAGS-IL-000073", name: "Devon Park", course: "Illinois BASSET", status: "ACTIVE" },
                    { id: "SAGS-OH-000047", name: "Aaron Blake", course: "Food Handler", status: "EXPIRED" },
                  ].map((row, i) => (
                    <div
                      key={row.id}
                      className="animate-in border border-border p-3"
                      style={{ animationDelay: `${300 + i * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">{row.id}</span>
                        <span
                          className={`font-mono text-[9px] font-bold px-1.5 py-0.5 ${
                            row.status === "ACTIVE"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold">{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.course}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-b border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 opacity-50">
          <span className="font-mono text-xs font-bold uppercase">Approved Provider:</span>
          <span className="font-mono text-sm">DSHS TEXAS</span>
          <span className="font-mono text-sm">TABC CERTIFIED</span>
          <span className="font-mono text-sm">ANSI-CFP</span>
          <span className="font-mono text-sm">BASSET IL</span>
          <span className="font-mono text-sm hidden md:inline">CA ABC RBS</span>
        </div>
      </div>

      {/* PILLARS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Catalog Pillars
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">Regulated Learning Streams</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const inCat = COURSES.filter(c => c.category === cat.id);
              const states = Array.from(new Set(inCat.map(c => c.state))).slice(0, 4);
              return (
                <Link
                  key={cat.id}
                  to="/catalog"
                  search={{ cat: cat.id }}
                  className="group animate-in border border-border p-8 transition-colors hover:border-primary"
                  style={{ animationDelay: `${200 + i * 50}ms` }}
                >
                  <div className="mb-12 grid size-12 place-items-center border border-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <span className="font-mono font-bold">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold">{cat.label}</h3>
                  <p className="mt-4 text-sm text-muted-foreground">{cat.description}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {states.map(s => (
                      <span key={s} className="bg-secondary px-2 py-1 font-mono text-[9px] font-bold">
                        {s}
                      </span>
                    ))}
                    <span className="bg-secondary px-2 py-1 font-mono text-[9px] font-bold text-muted-foreground">
                      +{inCat.length} PROGRAMS
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                Featured Certifications
              </h2>
              <p className="mt-2 text-3xl font-extrabold">State-Approved Programs</p>
            </div>
            <Link to="/catalog" className="hidden text-sm font-bold uppercase tracking-widest text-background/70 hover:text-accent md:block">
              View All →
            </Link>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(c => (
              <Link
                key={c.id}
                to="/catalog/$courseId"
                params={{ courseId: c.id }}
                className="group bg-foreground p-6 transition-colors hover:bg-primary/20"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-sm bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                    {c.state}
                  </span>
                  <span className="font-mono text-sm">${c.price.toFixed(2)}</span>
                </div>
                <h4 className="mt-8 text-lg font-bold">{c.title}</h4>
                <p className="mt-2 text-xs text-background/60">
                  {c.authority} • {c.hours}h
                </p>
                <div className="mt-8 border-t border-white/10 pt-4 font-mono text-[10px] font-bold text-background/70 group-hover:text-accent">
                  VIEW COURSE →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LMS FEATURES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Platform</h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">LMS engineered for deep compliance.</p>
              <ul className="mt-10 space-y-6">
                {[
                  { t: "Compliance Gating", d: "Mandatory section timers and passing quiz scores enforce regulatory pace." },
                  { t: "Identity Verification", d: "TABC-style random security prompts lock out impostors during alcohol training." },
                  { t: "Auto-Resume", d: "Start on mobile, finish on desktop. Every second of progress is preserved." },
                  { t: "Instant Certification", d: "Auto-generated PDF certificates with QR codes and public verification portal." },
                ].map(f => (
                  <li key={f.t} className="flex gap-4">
                    <div className="mt-1 size-5 flex-shrink-0 border border-primary" />
                    <div>
                      <h4 className="font-bold">{f.t}</h4>
                      <p className="text-sm text-muted-foreground">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Module 04 · Cross-Contamination
                </span>
                <span className="font-mono text-[10px] text-accent">02:14 / 08:00</span>
              </div>
              <div className="aspect-video bg-foreground/90 grid place-items-center">
                <div className="grid size-14 place-items-center border-2 border-white/40">
                  <div className="ml-1 size-0 border-y-8 border-l-[14px] border-y-transparent border-l-white/80" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full bg-secondary">
                <div className="h-full w-[38%] bg-primary" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">LESSON 2 OF 5</span>
                <button className="border border-foreground px-4 py-2 text-xs font-bold opacity-60" disabled>
                  NEXT · LOCKED 05:46
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFY CTA */}
      <section className="border-y border-border bg-secondary/40 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Public Verification Portal
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">Validate a certificate.</p>
          <p className="mt-3 text-muted-foreground">
            Employers and state regulators can verify any SAGS-issued certificate instantly.
          </p>
          <div className="mt-8">
            <Link
              to="/verify"
              className="inline-block bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Open Verification Portal
            </Link>
          </div>
        </div>
      </section>

      {/* CORPORATE CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center border border-foreground p-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">Scale your enterprise compliance.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Centralized dashboards for corporate bulk purchasing and employee progress tracking.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/corporate" className="bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Corporate Signup
              </Link>
              <Link to="/verify" className="border border-foreground px-8 py-4 font-bold transition-all hover:bg-secondary">
                Verification Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
