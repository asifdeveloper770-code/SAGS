import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { mockSignIn } from "@/lib/auth-store";

type Search = { mode?: "signin" | "register"; next?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s.mode === "register" ? "register" : "signin",
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign In or Register — SAGS" }] }),
  component: Auth,
});

function Auth() {
  const { mode = "signin", next } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", dob: "", email: "", phone: "", address: "",
    username: "", password: "", ssnLast4: "",
    role: "student" as "student" | "corporate" | "admin",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mockSignIn(form.email || "demo@sags.io", form.role);
    if (next) window.location.href = next;
    else if (form.role === "corporate") navigate({ to: "/corporate/dashboard" });
    else if (form.role === "admin") navigate({ to: "/admin" });
    else navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div className="animate-in">
            <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              {mode === "register" ? "Student Registration" : "Student Portal"}
            </h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">
              {mode === "register" ? "Create your account." : "Welcome back."}
            </p>
            <p className="mt-4 text-muted-foreground">
              {mode === "register"
                ? "Enrollment data syncs to GoHighLevel CRM (mocked in preview) and enables instant course access."
                : "Sign in to resume your training or download certificates."}
            </p>

            <div className="mt-8 flex gap-2 border border-border p-1">
              <button
                onClick={() => navigate({ to: "/auth", search: { mode: "signin", next } })}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider ${mode === "signin" ? "bg-foreground text-background" : ""}`}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate({ to: "/auth", search: { mode: "register", next } })}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider ${mode === "register" ? "bg-foreground text-background" : ""}`}
              >
                Register
              </button>
            </div>

            <div className="mt-6 border border-accent/30 bg-accent/5 p-3 text-xs">
              <div className="font-mono font-bold uppercase text-accent">Demo Mode</div>
              <p className="mt-1 text-muted-foreground">Use any email. Choose a role below to preview each portal:</p>
              <div className="mt-2 flex gap-2">
                {(["student", "corporate", "admin"] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`px-2 py-1 text-[10px] font-bold uppercase ${form.role === r ? "bg-foreground text-background" : "border border-border"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="animate-in border border-border bg-card p-8" style={{ animationDelay: "100ms" }}>
            {mode === "signin" ? (
              <div className="space-y-4">
                <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                <Input label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} />
                <button className="mt-4 w-full bg-primary py-3 font-bold uppercase text-primary-foreground">Sign In</button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Step {step} of 3</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(n => (
                      <span key={n} className={`h-1 w-8 ${n <= step ? "bg-primary" : "bg-border"}`} />
                    ))}
                  </div>
                </div>
                {step === 1 && (
                  <div className="space-y-4">
                    <Input label="Full Legal Name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} />
                    <Input label="Date of Birth" type="date" value={form.dob} onChange={v => setForm({ ...form, dob: v })} />
                    <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                    <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                    <button type="button" onClick={() => setStep(2)} className="mt-4 w-full bg-foreground py-3 font-bold uppercase text-background">
                      Continue
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <Input label="Physical Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
                    <Input label="Username" value={form.username} onChange={v => setForm({ ...form, username: v })} />
                    <Input label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-foreground py-3 font-bold uppercase">
                        Back
                      </button>
                      <button type="button" onClick={() => setStep(3)} className="flex-1 bg-foreground py-3 font-bold uppercase text-background">
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="border border-accent/40 bg-accent/5 p-3 text-xs">
                      <div className="font-mono font-bold uppercase text-accent">Regulatory Compliance</div>
                      <p className="mt-1 text-muted-foreground">Alcohol server programs require identity verification.</p>
                    </div>
                    <Input label="Last 4 of SSN or State ID" value={form.ssnLast4} onChange={v => setForm({ ...form, ssnLast4: v })} />
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" required className="mt-1" />
                      I certify all information is accurate and agree to the Terms of Service and Privacy Policy.
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(2)} className="w-1/3 border border-foreground py-3 font-bold uppercase">
                        Back
                      </button>
                      <button type="submit" className="flex-1 bg-primary py-3 font-bold uppercase text-primary-foreground">
                        Create Account
                      </button>
                    </div>
                    <p className="text-center font-mono text-[10px] text-muted-foreground">
                      SYNCS TO GHL CRM (MOCKED)
                    </p>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Input({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-3 py-2 focus:border-foreground focus:outline-none"
      />
    </label>
  );
}
