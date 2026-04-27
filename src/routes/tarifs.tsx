import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Briefcase,
  Check,
  FileText,
  GraduationCap,
  HelpCircle,
  Languages,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { QuickBookingForm } from "@/components/QuickBookingForm";
import { SiteLayout } from "@/components/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const faqs: { question: string; answer: string }[] = [
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les paiements via Wave, Orange Money, Free Money, virement bancaire et espèces à nos bureaux. Un acompte de 50% est demandé à la réservation, le solde étant réglé avant la livraison de la prestation.",
  },
  {
    question: "Proposez-vous des facilités de paiement ?",
    answer:
      "Oui. Pour les prestations supérieures à 50 000 FCFA, nous proposons un paiement échelonné en 2 ou 3 fois sans frais. Des tarifs dégressifs sont également disponibles pour les groupes, entreprises et organisations.",
  },
  {
    question: "Quels sont les délais de réalisation d'un business plan ?",
    answer:
      "Un business plan complet est livré entre 7 et 14 jours ouvrés selon la complexité du projet. Une première version intermédiaire vous est présentée à mi-parcours pour validation et ajustements éventuels.",
  },
  {
    question: "Comment se déroule la réservation d'une séance ?",
    answer:
      "Vous pouvez réserver directement depuis votre espace client après inscription, ou via le formulaire de contact. Nous vous confirmons le créneau sous 24h. Une séance découverte gratuite de 30 minutes est offerte avant tout engagement.",
  },
  {
    question: "Que se passe-t-il en cas d'annulation ou de report ?",
    answer:
      "Toute annulation ou report doit être signalé au moins 48h à l'avance pour être gratuit. Passé ce délai, 30% du montant est retenu. En cas d'empêchement de notre part, la séance est intégralement reportée ou remboursée, au choix du client.",
  },
  {
    question: "Les formations sont-elles certifiantes ?",
    answer:
      "Oui. À l'issue de chaque formation (entrepreneuriat, développement personnel, éducation financière), une attestation de participation officielle vous est remise. Les formations se déroulent en groupe de 20 personnes maximum pour garantir la qualité.",
  },
  {
    question: "Les cours d'anglais en ligne sont-ils flexibles ?",
    answer:
      "Absolument. Les horaires sont définis avec vous selon vos disponibilités. Vous pouvez réserver vos heures à l'avance ou opter pour un forfait mensuel. Les cours individuels offrent un suivi totalement personnalisé.",
  },
  {
    question: "Puis-je obtenir un devis pour un programme sur mesure ?",
    answer:
      "Oui, pour le renforcement de capacité ou tout accompagnement spécifique aux entreprises et organisations, nous établissons un devis personnalisé gratuit après une première rencontre de cadrage.",
  },
];

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

      {/* Quick Booking */}
      <section className="border-y border-border bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Prise de rendez-vous express
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Réservez votre <span className="text-gradient-gold">créneau</span> maintenant
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Pas besoin de longs échanges. Choisissez votre service, votre date et
              votre heure — nous confirmons sous 24h.
            </p>
          </div>
          <QuickBookingForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-gold">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Questions fréquentes
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Tout ce qu'il faut <span className="text-gradient-gold">savoir</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Paiement, délais, réservation, remplacements — retrouvez ici les réponses
              aux questions que l'on nous pose le plus souvent.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-card p-2 shadow-card md:p-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="border-border px-4 last:border-b-0 md:px-6"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline md:text-lg">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-xs font-bold text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-10 pr-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Une autre question ?{" "}
            <Link to="/contact" className="font-semibold text-gold hover:underline">
              Contactez-nous
            </Link>
            , nous répondons sous 24h.
          </p>
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
