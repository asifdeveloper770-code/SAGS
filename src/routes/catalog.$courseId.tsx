import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { courseById, type Course } from "@/lib/mock-data";
import { enrollCourse, getUser } from "@/lib/auth-store";

export const Route = createFileRoute("/catalog/$courseId")({
  loader: ({ params }): { course: Course } => {
    const course = courseById(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.course.title} — SAGS` : "Course — SAGS" },
      { name: "description", content: loaderData?.course.description ?? "SAGS accredited training." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold">Course not found</h1>
        <Link to="/catalog" className="mt-6 inline-block bg-primary px-6 py-3 font-bold text-primary-foreground">
          Back to catalog
        </Link>
      </div>
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData() as { course: Course };
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [bulk, setBulk] = useState(false);

  const handleEnroll = () => {
    const user = getUser();
    if (!user) {
      navigate({ to: "/auth", search: { mode: "register", next: `/catalog/${course.id}` } });
      return;
    }
    // Simulated checkout — instant enrollment (stubbed payment)
    enrollCourse(course.id);
    navigate({ to: "/learn/$courseId", params: { courseId: course.id } });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link to="/catalog" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
            ← Catalog
          </Link>
          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="animate-in lg:col-span-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                  {course.stateLabel.toUpperCase()}
                </span>
                <span className="rounded-sm bg-accent/10 px-2 py-1 font-mono text-[10px] font-bold text-accent">
                  {course.authority.toUpperCase()}
                </span>
                {course.requiresIdVerify && (
                  <span className="rounded-sm bg-foreground px-2 py-1 font-mono text-[10px] font-bold text-background">
                    ID VERIFICATION REQUIRED
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight">{course.title}</h1>
              <p className="mt-6 text-lg text-muted-foreground">{course.description}</p>

              <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
                {[
                  ["Duration", `${course.hours}h`],
                  ["Modules", String(course.modules.length)],
                  ["Format", "Online"],
                  ["Validity", "2 Years"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-background p-4">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {k}
                    </div>
                    <div className="mt-1 text-2xl font-extrabold">{v}</div>
                  </div>
                ))}
              </div>

              {/* Curriculum */}
              <div className="mt-12">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Curriculum</h2>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{course.modules.length}-module program</p>
                <div className="mt-6 space-y-3">
                  {course.modules.map((m, i) => (
                    <div key={m.id} className="border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-semibold">{m.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {m.lessons.length} LESSONS · {m.minMinutes} MIN
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Sidebar */}
            <div className="animate-in lg:col-span-4" style={{ animationDelay: "150ms" }}>
              <div className="sticky top-24 border border-foreground bg-card p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Course Price
                  </span>
                  <span className="text-4xl font-extrabold">${course.price.toFixed(2)}</span>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={bulk} onChange={e => setBulk(e.target.checked)} />
                    Bulk enrollment (corporate)
                  </label>
                  {bulk && (
                    <div className="mt-3">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Seats
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={500}
                        value={qty}
                        onChange={e => setQty(Math.max(2, Number(e.target.value)))}
                        className="mt-1 w-full border border-border bg-background px-3 py-2"
                      />
                      <div className="mt-2 font-mono text-xs text-muted-foreground">
                        Total: ${(course.price * qty * 0.9).toFixed(2)} (10% volume discount)
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleEnroll}
                  className="mt-6 w-full bg-primary py-4 font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
                >
                  {bulk ? "Purchase Seats" : "Enroll & Start"}
                </button>
                <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
                  DEMO CHECKOUT · NO CARD REQUIRED
                </p>

                <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">✓ Instant access</div>
                  <div className="flex items-center gap-2">✓ Auto-resume on all devices</div>
                  <div className="flex items-center gap-2">✓ Downloadable PDF certificate</div>
                  <div className="flex items-center gap-2">✓ GHL CRM sync (mocked)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
