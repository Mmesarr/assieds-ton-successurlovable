import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, Clock, Loader2, Send, Sparkles } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SERVICE_OPTIONS = [
  "Business Plan (1M à 10M FCFA)",
  "Business Plan (+10M FCFA)",
  "CV + Orientation",
  "Coaching entrepreneurs",
  "Coaching développement personnel",
  "Coaching personnalisé",
  "Conseil de vie",
  "Formation entrepreneuriat",
  "Formation développement personnel",
  "Formation éducation financière & comptabilité",
  "Renforcement de capacité (sur devis)",
  "Anglais en ligne — groupe",
  "Anglais en ligne — individuel",
] as const;

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const bookingSchema = z.object({
  service: z.string().min(1, "Sélectionnez un service"),
  date: z.date({ required_error: "Choisissez une date" }),
  time: z.string().min(1, "Choisissez une heure"),
  message: z.string().trim().max(500, "Message trop long (500 max)").optional(),
});

export function QuickBookingForm() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = bookingSchema.safeParse({ service, date, time, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    if (!user) {
      toast.info("Connectez-vous pour réserver", {
        description: "Créez un compte ou connectez-vous en quelques secondes.",
      });
      navigate({ to: "/auth", search: { mode: "login" } as never });
      return;
    }

    setSubmitting(true);

    // Combine date + time
    const [hh, mm] = parsed.data.time.split(":").map(Number);
    const requestedAt = new Date(parsed.data.date);
    requestedAt.setHours(hh, mm, 0, 0);

    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      service_title: parsed.data.service,
      requested_at: requestedAt.toISOString(),
      message: parsed.data.message || null,
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la réservation", { description: error.message });
      return;
    }

    setSuccess(true);
    toast.success("Demande envoyée !", {
      description: "Nous vous confirmons votre rendez-vous sous 24h.",
    });
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-card p-10 text-center shadow-elegant">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold">Demande envoyée 🎉</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Merci ! Votre demande de rendez-vous pour <strong className="text-foreground">{service}</strong>{" "}
          le <strong className="text-foreground">{date && format(date, "PPP", { locale: fr })}</strong> à{" "}
          <strong className="text-foreground">{time}</strong> a bien été enregistrée.
          Vous recevrez une confirmation sous 24h.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="gold">
            <Link to="/dashboard">Voir mon tableau de bord</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setService("");
              setDate(undefined);
              setTime("");
              setMessage("");
            }}
          >
            Nouvelle demande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-elegant md:p-10"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-gold opacity-10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-gold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold md:text-3xl">
              Réservez en <span className="text-gradient-gold">1 étape</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Choisissez votre service, votre créneau, c'est tout.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {/* Service */}
          <div className="md:col-span-2">
            <Label htmlFor="service" className="mb-2 block text-sm font-semibold">
              Service souhaité *
            </Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service" className="h-12">
                <SelectValue placeholder="Sélectionnez un service" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {SERVICE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="mb-2 block text-sm font-semibold">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return d < today || d.getDay() === 0;
                  }}
                  initialFocus
                  locale={fr}
                  className={cn("pointer-events-auto p-3")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="time" className="mb-2 block text-sm font-semibold">
              Heure *
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time" className="h-12">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Choisir un créneau" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <Label htmlFor="message" className="mb-2 block text-sm font-semibold">
              Message (optionnel)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Précisez votre besoin, vos objectifs ou toute information utile..."
              rows={3}
              maxLength={500}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {message.length}/500
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            * Champs obligatoires. Confirmation sous 24h.
            {!user && !authLoading && (
              <>
                {" "}
                <Link to="/auth" className="font-semibold text-gold hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour valider.
              </>
            )}
          </p>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={submitting || authLoading}
            className="sm:min-w-48"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Envoi...
              </>
            ) : (
              <>
                <Send /> Confirmer la demande
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
