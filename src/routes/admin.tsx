import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, Package, ShieldAlert, Users } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { AdminClients } from "@/components/admin/AdminClients";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminAppointments } from "@/components/admin/AdminAppointments";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Assieds Les Conseils" },
      { name: "description", content: "Espace d'administration sécurisé." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Counts = { clients: number; services: number; appointments: number; pending: number };

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>({ clients: 0, services: 0, appointments: 0, pending: 0 });

  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/admin" } });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [c, s, a, p] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setCounts({
        clients: c.count ?? 0,
        services: s.count ?? 0,
        appointments: a.count ?? 0,
        pending: p.count ?? 0,
      });
    })();
  }, [isAdmin]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-gold" />
            <h1 className="font-display text-3xl font-bold md:text-4xl">Accès restreint</h1>
            <p className="mt-3 text-primary-foreground/70">
              Cette section est réservée aux administrateurs.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link to="/dashboard">Retour à mon espace</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-12 text-primary-foreground md:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Administration</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Tableau de <span className="text-gradient-gold">bord</span>
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/70">Gérez vos clients, services et rendez-vous.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Users} label="Clients" value={counts.clients} />
            <Stat icon={Package} label="Services" value={counts.services} />
            <Stat icon={CalendarDays} label="Rendez-vous" value={counts.appointments} />
            <Stat icon={CalendarDays} label="En attente" value={counts.pending} highlight />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 sm:max-w-md">
              <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <AdminAppointments />
            </TabsContent>
            <TabsContent value="clients">
              <AdminClients />
            </TabsContent>
            <TabsContent value="services">
              <AdminServices />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-5 backdrop-blur ${
        highlight ? "border-gold/40 bg-gold/10" : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-primary-foreground/60">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
