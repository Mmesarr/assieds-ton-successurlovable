import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { AdminClients } from "@/components/admin/AdminClients";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminAppointments } from "@/components/admin/AdminAppointments";
import { AdminStats } from "@/components/admin/AdminStats";

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

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/admin" } });
    }
  }, [loading, user, navigate]);

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
          <p className="mt-2 text-sm text-primary-foreground/70">
            Vue d'ensemble, clients, services et rendez-vous.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-4 sm:max-w-2xl">
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <AdminStats />
            </TabsContent>
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
