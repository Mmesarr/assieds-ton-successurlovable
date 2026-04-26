import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Briefcase,
  Check,
  FileText,
  GraduationCap,
  Languages,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — Assieds Les Conseils" },
      {
        name: "description",
        content:
          "Tarifs transparents pour business plan, coaching, formations, CV, anglais en ligne et renforcement de capacité au Sénégal.",
      },
      { property: "og:title", content: "Tarifs — Assieds Les Conseils" },
      {
        property: "og:description",
        content: "Découvrez nos prix clairs pour tous nos accompagnements.",
      },
    ],
  }),
  component: PricingPage,
});

type PriceItem = {
  label: string;
  price: string;
  unit?: string;
  highlight?: boolean;
};

type PricingCategory = {
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  items: PriceItem[];
  badge?: string;
};

const categories: PricingCategory[] = [
  {
    icon: FileText,
    emoji: "💰",
    title: "Business Plan",
    description: "Élaboration complète et bancable de votre business plan.",
    items: [
      { label: "Projet de 1M à 10M FCFA", price: "50 000", unit: "FCFA" },
      { label: "Projet supérieur à 10M FCFA", price: "100 000", unit: "FCFA", highlight: true },
    ],
  },
  {
    icon: Briefcase,
    emoji: "💼",
    title: "CV + Orientation",
    description: "CV professionnel et conseils d'orientation de carrière.",
    items: [{ label: "Pack complet CV + orientation", price: "15 000", unit: "FCFA" }],
  },
  {
    icon: Brain,
    emoji: "🧠",
    title: "Coaching",
    description: "Accompagnement personnalisé pour atteindre vos objectifs.",
    badge: "Le plus demandé",
    items: [
      { label: "Coaching entrepreneurs", price: "25 000", unit: "FCFA" },
      { label: "Développement personnel", price: "25 000", unit: "FCFA" },
      { label: "Coaching personnalisé", price: "35 000", unit: "FCFA", highlight: true },
      { label: "Conseil de vie", price: "25 000", unit: "FCFA" },
    ],
  },
  {
    icon: GraduationCap,
    emoji: "🎓",
    title: "Formations",
    description: "Formations en groupe de 20 personnes, certifiantes et pratiques.",
    items: [
      { label: "Entrepreneuriat", price: "50 000", unit: "FCFA / pers." },
      { label: "Développement personnel", price: "50 000", unit: "FCFA / pers." },
      { label: "Éducation financière & Comptabilité", price: "50 000", unit: "FCFA / pers." },
    ],
  },
  {
    icon: TrendingUp,
    emoji: "📈",
    title: "Renforcement de capacité",
    description: "Programmes sur-mesure pour entreprises et organisations.",
    items: [{ label: "Programme personnalisé", price: "Sur devis", unit: "" }],
  },
  {
    icon: Languages,
    emoji: "🇬🇧",
    title: "Anglais en ligne",
    description: "Cours d'anglais flexibles en ligne, du débutant à l'avancé.",
    items: [
      { label: "Cours en groupe", price: "5 000", unit: "FCFA / heure" },
      { label: "Cours individuel", price: "10 000", unit: "FCFA / heure", highlight: true },
    ],
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40 md:pb-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Tarification
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            Des prix <span className="text-gradient-gold">clairs</span> et justes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/80">
            Investissez dans votre développement avec des tarifs transparents, sans
            surprise. Choisissez l'accompagnement qui vous correspond.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Badge icon={Check}>Sans frais cachés</Badge>
            <Badge icon={Check}>Devis personnalisé gratuit</Badge>
            <Badge icon={Check}>Paiement sécurisé</Badge>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <PricingCard key={cat.title} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Besoin d'un <span className="text-gradient-gold">accompagnement sur mesure</span> ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Chaque parcours est unique. Discutons de vos besoins lors d'une séance
            découverte gratuite et trouvons la formule idéale pour vous.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">
                <MessageCircle /> Demander un devis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                <BookOpen /> Voir nos services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
            <p>
              💡 Les tarifs affichés sont en <strong className="text-foreground">Francs CFA (FCFA)</strong> et
              s'entendent par séance ou prestation. Des facilités de paiement et tarifs
              dégressifs sont disponibles pour les groupes et entreprises.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Badge({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-primary-foreground/90">
      <Icon className="h-3.5 w-3.5 text-gold" />
      {children}
    </span>
  );
}

function PricingCard({ category }: { category: PricingCategory }) {
  const { icon: Icon, emoji, title, description, items, badge } = category;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant">
      {/* Decorative gradient corner */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-gold opacity-10 blur-2xl transition-smooth group-hover:opacity-25" />

      {badge && (
        <span className="absolute right-5 top-5 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-gold">
          {badge}
        </span>
      )}

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-gold">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl">{emoji}</p>
          </div>
        </div>

        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="relative mt-6 flex-1 space-y-3 border-t border-border pt-5">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-baseline justify-between gap-3 rounded-xl px-3 py-2.5 transition-smooth ${
              item.highlight
                ? "bg-gradient-to-r from-gold/15 to-transparent"
                : "hover:bg-secondary/60"
            }`}
          >
            <span className="text-sm font-medium text-foreground/85">{item.label}</span>
            <span className="shrink-0 text-right">
              <span
                className={`font-display text-lg font-bold ${
                  item.highlight ? "text-gradient-gold" : "text-foreground"
                }`}
              >
                {item.price}
              </span>
              {item.unit && (
                <span className="ml-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {item.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <Button asChild variant="outline" size="sm" className="relative mt-6 w-full">
        <Link to="/contact">Réserver</Link>
      </Button>
    </div>
  );
}
