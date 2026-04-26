import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, signUpSchema } from "@/lib/auth-schemas";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const search = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Espace membre — Assieds Les Conseils" },
      { name: "description", content: "Inscrivez-vous ou connectez-vous à votre espace personnel sécurisé." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode = "signup", redirect = "/dashboard" } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(mode);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirect });
    }
  }, [user, loading, navigate, redirect]);

  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-12 text-primary-foreground md:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Espace membre</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            {tab === "signup" ? (
              <>Créez votre <span className="text-gradient-gold">compte</span></>
            ) : (
              <>Bon <span className="text-gradient-gold">retour</span></>
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Accédez à votre profil, vos demandes et prenez rendez-vous en toute simplicité.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <div className="grid grid-cols-2 border-b border-border">
              <button
                onClick={() => setTab("signup")}
                className={`flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-smooth ${
                  tab === "signup"
                    ? "bg-gradient-gold text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <UserPlus className="h-4 w-4" /> Inscription
              </button>
              <button
                onClick={() => setTab("signin")}
                className={`flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-smooth ${
                  tab === "signin"
                    ? "bg-gradient-gold text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LogIn className="h-4 w-4" /> Connexion
              </button>
            </div>

            <div className="p-8 md:p-10">
              {tab === "signup" ? <SignUpForm /> : <SignInForm />}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setLoading(true);
    const { firstName, lastName, phone, cin, email, profession, password } = parsed.data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          cin,
          profession,
        },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        toast.error("Un compte existe déjà avec cet email.");
      } else if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("cin")) {
        toast.error("Ce numéro CIN est déjà utilisé.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.", { duration: 7000 });
    form.reset();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="Prénom *" placeholder="Aminata" />
        <Field id="lastName" label="Nom *" placeholder="Diop" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="Téléphone *" placeholder="+221 77 000 00 00" />
        <Field id="cin" label="CIN *" placeholder="1234567890123" />
      </div>
      <Field id="email" label="Email *" type="email" placeholder="vous@email.com" />
      <Field id="profession" label="Profession ou métier *" placeholder="Entrepreneure, Étudiant…" />

      <div>
        <Label htmlFor="password">Mot de passe *</Label>
        <div className="relative mt-2">
          <Input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            required
            className="pr-10"
            placeholder="Min. 8 caractères, 1 maj, 1 min, 1 chiffre"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={showPwd ? "Masquer" : "Afficher"}
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        En vous inscrivant, vous acceptez notre politique de confidentialité.
        Vos données (CIN, téléphone) sont chiffrées et ne sont jamais partagées.
      </p>
    </form>
  );
}

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = signInSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        toast.error("Email ou mot de passe incorrect.");
      } else if (error.message.toLowerCase().includes("not confirmed")) {
        toast.error("Veuillez d'abord confirmer votre email.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Bienvenue !");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field id="email" label="Email" type="email" placeholder="vous@email.com" />
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative mt-2">
          <Input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/auth" search={{ mode: "signup" }} className="font-semibold text-primary hover:text-gold">
          Inscrivez-vous
        </Link>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} required className="mt-2" placeholder={placeholder} />
    </div>
  );
}
