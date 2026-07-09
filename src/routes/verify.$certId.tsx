import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SAMPLE_CERTS } from "@/lib/mock-data";

export const Route = createFileRoute("/verify/$certId")({
  head: ({ params }) => ({ meta: [{ title: `Verify ${params.certId} — SAGS` }] }),
  component: VerifyDetail,
});

function VerifyDetail() {
  const { certId } = Route.useParams();
  const staticMatch = SAMPLE_CERTS.find(c => c.id === certId);

  // Check localStorage for user-issued certs
  let dynamic: { id: string; studentName: string; courseTitle: string; issuedAt: string; expiresAt: string; status: "active" } | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("sags:certs");
      const list = raw ? JSON.parse(raw) as typeof SAMPLE_CERTS : [];
      const hit = list.find(c => c.id === certId);
      if (hit) dynamic = { ...hit, status: "active" };
    } catch {}
  }

  const cert = staticMatch ?? dynamic;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link to="/verify" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
            ← Verification Portal
          </Link>

          {cert ? (
            <div className="mt-6 border border-foreground animate-in">
              <div className={`flex items-center justify-between border-b border-foreground p-6 ${
                cert.status === "active" ? "bg-primary text-primary-foreground" :
                cert.status === "expired" ? "bg-destructive text-destructive-foreground" :
                "bg-secondary"
              }`}>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-80">
                    Certificate Status
                  </div>
                  <div className="mt-1 text-3xl font-extrabold">
                    {cert.status === "active" ? "VALID" : cert.status === "expired" ? "EXPIRED" : "INVALID"}
                  </div>
                </div>
                <div className="text-6xl font-extrabold opacity-30">
                  {cert.status === "active" ? "✓" : "✕"}
                </div>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <Field label="Certificate ID" value={cert.id} mono />
                <Field label="Holder" value={cert.studentName} />
                <Field label="Course" value={cert.courseTitle} />
                <Field label="Issued" value={cert.issuedAt} mono />
                <Field label="Expires" value={cert.expiresAt} mono />
                <Field label="Issuing Authority" value="Sparkle Access Global Services" />
              </div>
              <div className="border-t border-border p-6 text-xs text-muted-foreground">
                This record is provided for regulatory verification purposes. For disputes contact compliance@sags.example.
              </div>
            </div>
          ) : (
            <div className="mt-6 border border-destructive p-8 text-center">
              <div className="text-5xl font-extrabold text-destructive">✕</div>
              <div className="mt-4 text-2xl font-extrabold">Certificate not found</div>
              <div className="mt-2 font-mono text-xs text-muted-foreground">ID: {certId}</div>
              <p className="mt-4 text-sm text-muted-foreground">
                No record matching this ID was found in the SAGS registry.
              </p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-semibold ${mono ? "font-mono text-sm" : ""}`}>{value}</div>
    </div>
  );
}
