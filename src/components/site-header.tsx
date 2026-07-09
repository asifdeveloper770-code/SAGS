import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUser, setUser } from "@/lib/auth-store";
import { CATEGORIES, COURSES } from "@/lib/mock-data";

export function SiteHeader() {
  const user = useUser();
  const navigate = useNavigate();
  const [openMega, setOpenMega] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono text-xl font-extrabold tracking-tighter text-primary">
            SAGS
          </Link>
          <div className="hidden gap-6 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setOpenMega(true)}
              onMouseLeave={() => setOpenMega(false)}
            >
              <Link to="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
                Programs
              </Link>
              {openMega && (
                <div className="absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 border border-border bg-background p-6 shadow-2xl animate-fade">
                  <div className="grid grid-cols-3 gap-6">
                    {CATEGORIES.map(cat => {
                      const items = COURSES.filter(c => c.category === cat.id).slice(0, 5);
                      return (
                        <div key={cat.id}>
                          <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                            {cat.label}
                          </div>
                          <ul className="space-y-2">
                            {items.map(c => (
                              <li key={c.id}>
                                <Link
                                  to="/catalog/$courseId"
                                  params={{ courseId: c.id }}
                                  className="block text-sm hover:text-primary"
                                >
                                  {c.title}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link to="/catalog" search={{ cat: cat.id }} className="text-xs text-muted-foreground underline underline-offset-4">
                                View all →
                              </Link>
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <Link to="/verify" className="text-sm font-medium transition-colors hover:text-primary">
              Verification
            </Link>
            <Link to="/corporate" className="text-sm font-medium transition-colors hover:text-primary">
              Corporate
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium text-accent transition-colors hover:text-primary">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === "corporate" ? "/corporate/dashboard" : user.role === "admin" ? "/admin" : "/dashboard"}
                className="hidden text-xs font-semibold text-muted-foreground hover:text-foreground sm:block"
              >
                {user.fullName}
              </Link>
              <button
                onClick={() => {
                  setUser(null);
                  navigate({ to: "/" });
                }}
                className="rounded-sm border border-foreground px-4 py-2 text-xs font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "signin" }} className="text-sm font-semibold hover:text-primary">
                Student Login
              </Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
