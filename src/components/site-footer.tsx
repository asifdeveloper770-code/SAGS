import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        <div>
          <span className="font-mono text-lg font-extrabold tracking-tighter text-primary">SAGS</span>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Sparkle Access Global Services — accredited multi-state training and certification.
          </p>
        </div>
        <div>
          <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest">Programs</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" search={{ cat: "food-handler" }} className="hover:text-primary">Food Handler</Link></li>
            <li><Link to="/catalog" search={{ cat: "alcohol" }} className="hover:text-primary">Alcohol Server</Link></li>
            <li><Link to="/catalog" search={{ cat: "additional" }} className="hover:text-primary">Additional Training</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest">Portal</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/verify" className="hover:text-primary">Verify a Certificate</Link></li>
            <li><Link to="/corporate" className="hover:text-primary">Corporate Accounts</Link></li>
            <li><Link to="/auth" search={{ mode: "signin" }} className="hover:text-primary">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest">Legal</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary">Accreditation</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-6 pt-6 text-xs text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} Sparkle Access Global Services. All rights reserved.</span>
        <span className="font-mono">v1.0.0-preview</span>
      </div>
    </footer>
  );
}
