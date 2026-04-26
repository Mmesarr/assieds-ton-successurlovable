import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { services } from "@/data/services";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Assieds Les Conseils" },
      {
        name: "description",
        content:
          "Contactez Assieds Les Conseils par WhatsApp, email ou via notre formulaire. Réponse sous 24h. Basé à Dakar, Sénégal.",
      },
      { property: "og:title", content: "Contact — Assieds Les Conseils" },
      { property: "og:description", content: "Discutons de votre projet. Réponse sous 24h." },
    ],
  }),
  component: ContactPage,
});

const WHATSAPP_NUMBER = "221770000000";
const CONTACT_EMAIL = "contact@assiedslesconseils.com";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone invalide").max(30),
  service: z.string().max(100).optional(),
  message: z.string().trim().min(10, "Message trop court").max(1000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setLoading(true);
    const { name, email, phone, service, message } = parsed.data;
    const text = `Bonjour, je suis ${name}.%0A%0AEmail: ${email}%0ATéléphone: ${phone}${service ? `%0AService: ${service}` : ""}%0A%0A${encodeURIComponent(message)}`;
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
      toast.success("Message prêt ! Ouverture de WhatsApp...");
      form.reset();
      setLoading(false);
    }, 400);
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-hero pt-32 pb-20 text-primary-foreground md:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Contact</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            Discutons de <span className="text-gradient-gold">votre projet</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Une question, un besoin, un rendez-vous ? Nous sommes à votre écoute. Réponse garantie sous 24h.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Coordonnées */}
          <div className="space-y-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Réponse rapide, du lundi au samedi.</p>
                <p className="mt-2 text-sm font-medium text-primary">+221 77 000 00 00</p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">Pour les demandes détaillées.</p>
                <p className="mt-2 text-sm font-medium text-primary break-all">{CONTACT_EMAIL}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Localisation</h3>
                <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
                <p className="mt-2 text-sm">Sur rendez-vous · Présentiel & visio</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-gold">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Téléphone</h3>
                <p className="text-sm text-muted-foreground">Du lundi au vendredi · 9h - 18h</p>
                <p className="mt-2 text-sm font-medium text-primary">+221 77 000 00 00</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant md:p-10">
            <h2 className="font-display text-2xl font-bold">Envoyez-nous un message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Remplissez ce formulaire, nous vous répondrons par WhatsApp ou email.
            </p>

            <form onSubmit={onSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input id="name" name="name" required maxLength={100} className="mt-2" placeholder="Votre nom" />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" name="phone" required maxLength={30} className="mt-2" placeholder="+221 ..." />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required maxLength={255} className="mt-2" placeholder="vous@email.com" />
              </div>

              <div>
                <Label htmlFor="service">Service qui vous intéresse</Label>
                <select
                  id="service"
                  name="service"
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">— Choisir un service —</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="message">Votre message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  maxLength={1000}
                  rows={5}
                  className="mt-2"
                  placeholder="Parlez-nous de votre projet, vos objectifs, vos questions..."
                />
              </div>

              <Button type="submit" variant="gold" size="lg" disabled={loading} className="mt-2">
                {loading ? "Envoi..." : (<>Envoyer via WhatsApp <Send className="ml-1" /></>)}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Vos données restent confidentielles et ne sont jamais partagées.
              </p>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
