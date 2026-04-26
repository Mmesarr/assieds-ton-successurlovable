import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, CalendarPlus, IdCard, Loader2, LogOut, Mail, Phone, Sparkles, User as UserIcon } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cin: string;
  profession: string;
  created_at: string;
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mon espace — Assieds Les Conseils" },
      { name: "description", content: "Votre espace personnel sécurisé." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/dashboard" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone, cin, profession, created_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast.error("Impossible de charger le profil");
      } else {
        setProfile(data as Profile | null);
      }
      setLoadingProfile(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("À bientôt !");
    navigate({ to: "/" });
  };

  if (authLoading || !user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </SiteLayout>
    );
  }

  const initials =
    profile && profile.first_name && profile.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : (user.email ?? "U")[0].toUpperCase();

  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold font-display text-2xl font-bold text-primary shadow-gold">
              {initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Mon espace</p>
              <h1 className="font-display text-3xl font-bold md:text-4xl">
                Bonjour, <span className="text-gradient-gold">{profile?.first_name ?? "Bienvenue"}</span>
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/70">{user.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outlineLight" size="sm">
            <LogOut className="mr-1" /> Déconnexion
          </Button>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3">
          {/* Profil */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Mes informations</h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Sécurisé · privé</span>
              </div>

              {loadingProfile ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
              ) : profile ? (
                <dl className="grid gap-5 sm:grid-cols-2">
                  <Info icon={UserIcon} label="Prénom" value={profile.first_name} />
                  <Info icon={UserIcon} label="Nom" value={profile.last_name} />
                  <Info icon={Mail} label="Email" value={profile.email} />
                  <Info icon={Phone} label="Téléphone" value={profile.phone} />
                  <Info icon={IdCard} label="CIN" value={profile.cin} />
                  <Info icon={Briefcase} label="Profession" value={profile.profession} />
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Profil non trouvé.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Card
              icon={CalendarPlus}
              title="Prendre rendez-vous"
              desc="Réservez une séance découverte avec notre équipe."
              cta="Réserver"
              to="/contact"
            />
            <Card
              icon={Sparkles}
              title="Découvrir nos services"
              desc="11 expertises pour votre développement."
              cta="Explorer"
              to="/services"
              variant="ghost"
            />

            <div className="rounded-2xl border border-dashed border-border bg-secondary p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">À venir prochainement</p>
              <ul className="mt-3 space-y-1.5 list-disc pl-5">
                <li>Historique des demandes</li>
                <li>Suivi de projet</li>
                <li>Accès aux formations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-gold text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="mt-1 truncate font-medium">{value || "—"}</dd>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  cta,
  to,
  variant = "primary",
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  cta: string;
  to: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <Button asChild variant={variant === "primary" ? "gold" : "outline"} size="sm" className="mt-4 w-full">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}
