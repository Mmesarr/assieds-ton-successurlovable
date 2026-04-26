import { useEffect, useState } from "react";
import { Check, Clock, Loader2, X, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type Status = "pending" | "confirmed" | "cancelled" | "completed";

type Appointment = {
  id: string;
  user_id: string;
  service_title: string;
  requested_at: string;
  message: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  profile?: { first_name: string; last_name: string; email: string; phone: string };
};

const STATUS_LABEL: Record<Status, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

const STATUS_COLOR: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
  confirmed: "bg-blue-500/15 text-blue-700 hover:bg-blue-500/15",
  cancelled: "bg-red-500/15 text-red-700 hover:bg-red-500/15",
  completed: "bg-green-500/15 text-green-700 hover:bg-green-500/15",
};

export function AdminAppointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: appts, error } = await supabase
      .from("appointments")
      .select("*")
      .order("requested_at", { ascending: false });
    if (error) {
      toast.error("Erreur chargement");
      setLoading(false);
      return;
    }
    // fetch profiles separately
    const userIds = [...new Set((appts ?? []).map((a) => a.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, email, phone")
      .in("user_id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));
    setItems(
      (appts ?? []).map((a) => ({
        ...a,
        profile: profileMap.get(a.user_id) as Appointment["profile"],
      })) as Appointment[],
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (a: Appointment, status: Status) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", a.id);
    if (error) toast.error(error.message); else { toast.success(`Statut: ${STATUS_LABEL[status]}`); load(); }
  };

  const saveNotes = async () => {
    if (!editing) return;
    const { error } = await supabase.from("appointments").update({ admin_notes: notes }).eq("id", editing.id);
    if (error) toast.error(error.message);
    else { toast.success("Notes enregistrées"); setEditing(null); load(); }
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold">Rendez-vous ({items.length})</h2>
        <p className="text-sm text-muted-foreground">Gérez les demandes de rendez-vous.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Status | "all")} className="mb-5">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmés</TabsTrigger>
          <TabsTrigger value="completed">Terminés</TabsTrigger>
          <TabsTrigger value="cancelled">Annulés</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Aucun rendez-vous.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{a.service_title}</h3>
                    <Badge className={STATUS_COLOR[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm">
                    <Clock className="mr-1 inline h-3.5 w-3.5 text-gold" />
                    {new Date(a.requested_at).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}
                  </p>
                  {a.profile && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.profile.first_name} {a.profile.last_name} · {a.profile.email} · {a.profile.phone}
                    </p>
                  )}
                  {a.message && (
                    <p className="mt-2 rounded-md bg-background p-2 text-sm">{a.message}</p>
                  )}
                  {a.admin_notes && (
                    <p className="mt-2 rounded-md border border-gold/30 bg-gold/5 p-2 text-xs">
                      <strong>Note admin :</strong> {a.admin_notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-1">
                  {a.status === "pending" && (
                    <>
                      <Button size="sm" variant="default" onClick={() => updateStatus(a, "confirmed")}>
                        <Check className="mr-1 h-3.5 w-3.5" /> Confirmer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a, "cancelled")}>
                        <X className="mr-1 h-3.5 w-3.5" /> Refuser
                      </Button>
                    </>
                  )}
                  {a.status === "confirmed" && (
                    <Button size="sm" variant="default" onClick={() => updateStatus(a, "completed")}>
                      <CheckCheck className="mr-1 h-3.5 w-3.5" /> Terminé
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(a); setNotes(a.admin_notes ?? ""); }}>
                    Note
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note administrateur</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="notes">Note interne (visible uniquement par les admins)</Label>
            <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            <Button variant="gold" onClick={saveNotes}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
