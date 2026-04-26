import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Votre partenaire de réussite personnelle et entrepreneuriale. Coaching, conseil et formation pour libérer votre plein potentiel.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Navigation</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/" className="transition-smooth hover:text-gold">Accueil</Link></li>
            <li><Link to="/services" className="transition-smooth hover:text-gold">Services</Link></li>
            <li><Link to="/a-propos" className="transition-smooth hover:text-gold">À propos</Link></li>
            <li><Link to="/contact" className="transition-smooth hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-gold" /> +221 77 000 00 00</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-gold" /> contact@assiedslesconseils.com</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-gold" /> Dakar, Sénégal</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-primary-foreground/50 md:flex-row">
          <p>© {new Date().getFullYear()} Assieds Les Conseils. Tous droits réservés.</p>
          <p>Conçu avec élégance à Dakar.</p>
        </div>
      </div>
    </footer>
  );
}
