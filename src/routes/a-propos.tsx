import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Lightbulb, Target } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Assieds Les Conseils" },
      {
        name: "description",
        content:
          "Notre mission, nos valeurs et notre vision : un accompagnement humain et exigeant pour révéler le potentiel de chacun.",
      },
      { property: "og:title", content: "À propos — Assieds Les Conseils" },
      { property: "og:description", content: "Notre mission : révéler le potentiel des entrepreneurs et professionnels." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Heart, title: "Bienveillance", desc: "Une écoute sincère et un cadre sécurisant à chaque étape." },
  { icon: Target, title: "Exigence", desc: "Un haut niveau de méthode, de rigueur et de résultats." },
  { icon: Lightbulb, title: "Clarté", desc: "Des outils simples, lisibles et immédiatement actionnables." },
  { icon: Award, title: "Engagement", desc: "Votre réussite est notre seul indicateur de performance." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">À propos</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            Un cabinet pensé pour <span className="text-gradient-gold">vous faire grandir</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Depuis sa création, Assieds Les Conseils accompagne avec passion les femmes et les hommes qui veulent entreprendre, se réinventer ou tout simplement mieux se connaître.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Notre mission</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Révéler le meilleur de chaque parcours.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Nous croyons que chaque personne porte en elle un potentiel unique. Notre rôle est de créer les conditions — méthode, écoute, outils — pour qu'il s'exprime pleinement, dans la vie comme dans l'entreprise.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nous travaillons avec des entrepreneurs, des étudiants, des professionnels en transition et des organisations qui souhaitent renforcer les compétences de leurs équipes.
            </p>
          </div>

          <div className="rounded-2xl bg-card p-8 shadow-card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Notre vision</p>
            <h3 className="font-display text-2xl font-bold">
              Devenir une référence du coaching et du conseil en Afrique de l'Ouest.
            </h3>
            <p className="mt-4 text-muted-foreground">
              Bâtir une communauté d'entrepreneurs et de professionnels confiants, outillés et prêts à transformer durablement leur environnement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Nos valeurs</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Quatre piliers qui guident chacun de nos accompagnements
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl bg-card p-7 text-center shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-gold">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Travaillons ensemble</h2>
          <p className="mt-4 text-muted-foreground">
            Une discussion vaut mieux qu'un long discours. Réservez un échange découverte pour évaluer comment nous pouvons vous accompagner.
          </p>
          <Button asChild variant="gold" size="xl" className="mt-8">
            <Link to="/contact">Prendre contact</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
