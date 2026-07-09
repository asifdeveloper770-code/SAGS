import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { mockSignIn } from "@/lib/auth-store";

export const Route = createFileRoute("/corporate")({
  head: () => ({ meta: [{ title: "Corporate Accounts — SAGS" }, { name: "description", content: "Bulk enrollment and centralized team compliance management for businesses." }] }),
  component: Corporate,
});

function Corporate() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(25);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-in max-w-3xl">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Corporate / B2B</div>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight md:text-6xl">
              Compliance at scale.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Buy voucher seats in bulk, invite employees by email or SMS, and track every certificate across your entire workforce from one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => { mockSignIn("corporate@demo.io", "corporate"); navigate({ to: "/corporate/dashboard" }); }}
                className="bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Launch Demo Dashboard
              </button>
              <Link to="/catalog" className="border border-foreground px-8 py-4 font-bold hover:bg-secondary">
                Browse Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Volume Pricing</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">Instant seat estimate.</p>
            <p className="mt-4 text-muted-foreground">Slide to preview per-seat cost across common programs.</p>
            <input
              type="range"
              min={5}
              max={500}
              value={seats}
              onChange={e => setSeats(Number(e.target.value))}
              className="mt-8 w-full"
            />
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">{seats} SEATS</div>
          </div>
          <div className="grid gap-px border border-border bg-border">
            {[
              { name: "TABC Seller-Server", base: 12 },
              { name: "Food Handler (multi-state)", base: 10 },
              { name: "Illinois BASSET", base: 15 },
              { name: "Food Manager (ANSI)", base: 85 },
            ].map(row => {
              const discount = seats >= 100 ? 0.25 : seats >= 25 ? 0.15 : 0.05;
              const perSeat = row.base * (1 - discount);
              return (
                <div key={row.name} className="bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{row.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {(discount * 100).toFixed(0)}% VOLUME DISCOUNT
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold">${perSeat.toFixed(2)}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        TOTAL ${(perSeat * seats).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">B2B Capabilities</h2>
          <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-3">
            {[
              ["Voucher Codes", "Auto-generated codes distributed to your team via email/SMS invitations."],
              ["Team Roster", "Central view of every employee, their assigned courses, and completion status."],
              ["Certificate Ledger", "Download all team certificates in a single ZIP or auto-export to your compliance system."],
              ["Renewal Alerts", "Automated notifications 90/60/30 days before certificates expire."],
              ["Analytics Rollup", "Executive dashboard with completion rates, average time-to-complete, and audit-ready reports."],
              ["Invoice Billing", "Purchase orders, net-30 terms, and consolidated invoicing for enterprise buyers."],
            ].map(([t, d]) => (
              <div key={t} className="bg-background p-6">
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
