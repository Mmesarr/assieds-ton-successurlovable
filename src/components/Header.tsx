import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-smooth ${
        scrolled ? "bg-background/85 backdrop-blur-lg shadow-card" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="transition-smooth hover:opacity-80">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="default" size="sm" asChild>
              <Link to="/dashboard"><LayoutDashboard className="mr-1" /> Mon espace</Link>
            </Button>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary"
              >
                Connexion
              </Link>
              <Button variant="gold" size="sm" asChild>
                <Link to="/auth" search={{ mode: "signup" }}><LogIn className="mr-1" /> S'inscrire</Link>
              </Button>
            </>
          )}
        </nav>

        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent"
                activeProps={{ className: "text-primary bg-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2" variant="gold">
              {user ? (
                <Link to="/dashboard" onClick={() => setOpen(false)}>Mon espace</Link>
              ) : (
                <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>S'inscrire</Link>
              )}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
