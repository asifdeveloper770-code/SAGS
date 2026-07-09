import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SAMPLE_CERTS } from "@/lib/mock-data";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify a Certificate — SAGS" },
      { name: "description", content: "Publicly verify any SAGS-issued training certificate by ID or QR code." },
    ],
  }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Public Verification Portal
          </h1>
          <p className="mt-3 text-5xl font-extrabold tracking-tight">Validate a certificate.</p>
          <p className="mt-4 text-muted-foreground">
            Enter a SAGS certificate ID to instantly verify its status.
          </p>
          <form
            className="mx-auto mt-10 flex max-w-xl"
            onSubmit={e => {
              e.preventDefault();
              if (id.trim()) navigate({ to: "/verify/$certId", params: { certId: id.trim().toUpperCase() } });
            }}
          >
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="SAGS-TX-000142"
              className="h-14 flex-1 border border-foreground bg-background px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="h-14 bg-foreground px-8 font-bold text-background transition-colors hover:bg-primary">
              Verify
            </button>
          </form>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground">
            Try: {SAMPLE_CERTS.map(c => c.id).join(" · ")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Recent Verifications</h2>
          <div className="mt-6 border border-border">
            {SAMPLE_CERTS.map(c => (
              <Link
                key={c.id}
                to="/verify/$certId"
                params={{ certId: c.id }}
                className="flex items-center justify-between border-b border-border p-4 last:border-b-0 hover:bg-secondary/40"
              >
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                  <div className="mt-1 font-semibold">{c.studentName}</div>
                  <div className="text-xs text-muted-foreground">{c.courseTitle}</div>
                </div>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-1 ${
                    c.status === "active" ? "bg-primary/10 text-primary" :
                    c.status === "expired" ? "bg-destructive/10 text-destructive" :
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
