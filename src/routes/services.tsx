import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services — Assieds Les Conseils" },
      {
        name: "description",
        content:
          "Coaching, formation, rédaction de business plan, conseil de vie et plus encore. Découvrez tous les services d'Assieds Les Conseils.",
      },
      { property: "og:title", content: "Nos services — Assieds Les Conseils" },
      { property: "og:description", content: "Onze services experts pour votre développement personnel et entrepreneurial." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Nos services</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            Onze expertises pour votre <span className="text-gradient-gold">réussite</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Que vous soyez entrepreneur, étudiant ou professionnel, nous avons une solution adaptée à votre étape de vie et à vos ambitions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.slug}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-lg font-semibold leading-tight">{s.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sur devis</span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-smooth group-hover:text-gold"
                    >
                      Commander <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Comment se déroule un accompagnement ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Une méthode éprouvée, structurée en quatre étapes claires pour des résultats concrets.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                { t: "Séance découverte", d: "Comprendre votre situation, vos objectifs et vos contraintes." },
                { t: "Proposition sur mesure", d: "Un plan d'accompagnement adapté à votre projet et votre rythme." },
                { t: "Mise en œuvre", d: "Sessions de coaching, livrables et outils concrets à chaque étape." },
                { t: "Suivi & évaluation", d: "Mesure des progrès et ajustements pour pérenniser les résultats." },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4 rounded-xl bg-card p-5 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-display font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.t}</h3>
                    <p className="text-sm text-muted-foreground">{step.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant md:p-16">
          <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Un service vous intéresse ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Contactez-nous pour échanger sur votre besoin. Nous vous répondrons sous 24h.
          </p>
          <Button asChild variant="hero" size="xl" className="mt-8">
            <Link to="/contact">Démarrer mon projet</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
