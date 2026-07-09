import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORIES, COURSES, STATES, type Category } from "@/lib/mock-data";

type Search = { cat?: Category; state?: string };

export const Route = createFileRoute("/catalog")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: (["food-handler", "alcohol", "additional"] as const).includes(s.cat as Category) ? (s.cat as Category) : undefined,
    state: typeof s.state === "string" ? s.state : undefined,
  }),
  head: () => ({ meta: [{ title: "Course Catalog — SAGS" }, { name: "description", content: "Browse SAGS state-approved training programs across all US jurisdictions." }] }),
  component: Catalog,
});

function Catalog() {
  const { cat, state } = Route.useSearch();
  const navigate = Route.useNavigate();

  const filtered = useMemo(() => {
    return COURSES.filter(c => (!cat || c.category === cat) && (!state || c.stateLabel === state));
  }, [cat, state]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-in">
            <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Course Catalog</h1>
            <p className="mt-2 text-5xl font-extrabold tracking-tight">Every accredited program.</p>
            <p className="mt-4 max-w-[60ch] text-muted-foreground">
              {filtered.length} programs across {STATES.length} jurisdictions. All courses are mobile-friendly, resume-anywhere, and issue certificates instantly upon completion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap items-center gap-3 border border-border p-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filter:</span>
            <button
              onClick={() => navigate({ search: { cat: undefined, state } })}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${!cat ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => navigate({ search: { cat: c.id, state } })}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${cat === c.id ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`}
              >
                {c.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">State:</span>
              <select
                value={state ?? ""}
                onChange={e => navigate({ search: { cat, state: e.target.value || undefined } })}
                className="border border-border bg-background px-2 py-1 text-xs"
              >
                <option value="">All</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="border border-border p-12 text-center text-muted-foreground">
              No programs match this filter.
            </div>
          ) : (
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => (
                <Link
                  key={c.id}
                  to="/catalog/$courseId"
                  params={{ courseId: c.id }}
                  className="group animate-in bg-background p-6 transition-colors hover:bg-secondary/50"
                  style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                      {c.state}
                    </span>
                    <span className="font-mono text-sm font-bold">${c.price.toFixed(2)}</span>
                  </div>
                  <h4 className="mt-6 text-lg font-bold group-hover:text-primary">{c.title}</h4>
                  <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    {c.authority} · {c.hours}h
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] font-bold text-muted-foreground group-hover:text-primary">
                    ENROLL →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
