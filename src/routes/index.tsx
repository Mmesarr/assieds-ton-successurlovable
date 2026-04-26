import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck2, CheckCircle2, Quote, Sparkles, Star } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assieds Les Conseils — Coaching, Conseil & Formation" },
      {
        name: "description",
        content:
          "Votre partenaire de réussite personnelle et entrepreneuriale. Coaching, conseil et formation pour entrepreneurs à Dakar et au-delà.",
      },
      { property: "og:title", content: "Assieds Les Conseils" },
      { property: "og:description", content: "Coaching, conseil et formation pour libérer votre potentiel." },
    ],
  }),
  component: HomePage,
});

const reasons = [
  { title: "Approche personnalisée", desc: "Chaque parcours est conçu sur mesure selon vos objectifs et votre rythme." },
  { title: "Expertise éprouvée", desc: "Des années d'accompagnement d'entrepreneurs et de porteurs de projets." },
  { title: "Résultats concrets", desc: "Des outils pratiques, des plans d'action clairs et un suivi rigoureux." },
  { title: "Confidentialité absolue", desc: "Un espace bienveillant, sécurisé et entièrement confidentiel." },
];

const testimonials = [
  {
    name: "Awa Diop",
    role: "Fondatrice, Atelier Linguère",
    text: "Un accompagnement structurant qui m'a permis de transformer une intuition en projet concret et financé.",
  },
  {
    name: "Mamadou Sy",
    role: "Consultant indépendant",
    text: "Le coaching m'a donné de la clarté et de la méthode. Mes clients le ressentent immédiatement.",
  },
  {
    name: "Fatou Ndiaye",
    role: "Étudiante en MBA",
    text: "Un soutien humain et exigeant. J'ai gagné en confiance et structuré ma vision de carrière.",
  },
];

function HomePage() {
  const featured = services.slice(0, 6);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-hero pt-32 pb-24 text-primary-foreground md:pt-40 md:pb-32">
        <div className="absolute inset-0 -z-10 opacity-[0.07]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px, 60px 60px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Coaching · Conseil · Formation
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] md:text-6xl">
              Votre partenaire de <span className="text-gradient-gold">réussite</span> personnelle et entrepreneuriale
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
              Nous accompagnons les entrepreneurs, étudiants et professionnels du Sénégal et d'Afrique à travers un coaching structurant, des conseils stratégiques et des formations sur mesure.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Prendre rendez-vous <CalendarCheck2 className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/services">
                  Découvrir nos services <ArrowRight className="ml-1" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-primary-foreground/70">
              <div>
                <div className="font-display text-2xl font-bold text-gold">+200</div>
                <div>clients accompagnés</div>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div>
                <div className="font-display text-2xl font-bold text-gold">11</div>
                <div>services experts</div>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div>
                <div className="font-display text-2xl font-bold text-gold">98%</div>
                <div>satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-700">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-gold opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-elegant ring-1 ring-gold/20">
              <img
                src={heroImg}
                alt="Coach professionnelle souriante en tenue élégante bleu marine"
                width={1536}
                height={1280}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/90 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["A", "M", "F"].map((c) => (
                      <div key={c} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold ring-2 ring-background font-semibold text-primary text-sm">
                        {c}
                      </div>
                    ))}
                  </div>
                  <div className="text-foreground">
                    <div className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs font-medium">Recommandé par +200 entrepreneurs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRÉSENTATION */}
      <section className="bg-secondary py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Qui sommes-nous
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Un cabinet à votre écoute, ancré à Dakar, ouvert sur le monde.
            </h2>
            <p className="mt-6 text-muted-foreground">
              <strong className="text-foreground">Assieds Les Conseils</strong> est un cabinet d'accompagnement spécialisé dans le coaching d'entrepreneurs, le développement personnel et la formation. Notre vocation : vous offrir un cadre structurant, bienveillant et exigeant pour révéler le meilleur de vous-même et de vos projets.
            </p>
            <p className="mt-4 text-muted-foreground">
              De la rédaction d'un business plan à la formation en éducation financière, en passant par le coaching personnalisé, nous mettons notre expertise au service de votre réussite.
            </p>
            <Button asChild className="mt-8" variant="default">
              <Link to="/a-propos">En savoir plus sur nous <ArrowRight /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                <CheckCircle2 className="mb-3 h-6 w-6 text-gold" />
                <h3 className="font-display text-base font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Nos services</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl max-w-2xl">
                Des solutions complètes pour votre développement
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">Voir tous les services <ArrowRight /></Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.slug}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <Link
                    to="/services"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-smooth group-hover:text-gold"
                  >
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-hero py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Témoignages</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ils nous ont fait <span className="text-gradient-gold">confiance</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-7 backdrop-blur-sm transition-smooth hover:bg-primary-foreground/[0.07]"
              >
                <Quote className="h-7 w-7 text-gold" />
                <blockquote className="mt-4 text-primary-foreground/90">"{t.text}"</blockquote>
                <figcaption className="mt-6 border-t border-primary-foreground/10 pt-4">
                  <div className="font-semibold text-gold">{t.name}</div>
                  <div className="text-xs text-primary-foreground/60">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-card p-10 shadow-elegant md:p-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary opacity-10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">
                  Prêt à passer à <span className="text-gradient-gold">l'action</span> ?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Réservez votre première séance découverte. Discutons de votre projet et bâtissons ensemble un plan adapté à vos ambitions.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild variant="gold" size="lg">
                  <Link to="/contact">Prendre rendez-vous</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/services">Explorer les services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
