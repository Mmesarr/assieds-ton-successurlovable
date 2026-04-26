import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Power, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
};

const empty: Omit<Service, "id"> = {
  slug: "",
  title: "",
  description: "",
  icon: "Sparkles",
  display_order: 0,
  is_active: true,
};

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");
    if (error) toast.error("Erreur chargement");
    setServices((data ?? []) as Service[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty, display_order: services.length + 1 });
    setOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      slug: s.slug,
      title: s.title,
      description: s.description,
      icon: s.icon,
      display_order: s.display_order,
      is_active: s.is_active,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("services").update(form).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Service mis à jour");
    } else {
      const { error } = await supabase.from("services").insert(form);
      if (error) toast.error(error.message); else toast.success("Service ajouté");
    }
    setSaving(false);
    setOpen(false);
    load();
  };

  const toggleActive = async (s: Service) => {
    const { error } = await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) toast.error(error.message); else load();
  };

  const remove = async (s: Service) => {
    if (!confirm(`Supprimer "${s.title}" ?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", s.id);
    if (error) toast.error(error.message); else { toast.success("Supprimé"); load(); }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Services ({services.length})</h2>
          <p className="text-sm text-muted-foreground">Gérez votre catalogue de prestations.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} variant="gold" size="sm"><Plus className="mr-1 h-4 w-4" /> Nouveau</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier" : "Nouveau"} service</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="icon">Icône (Lucide)</Label>
                  <Input id="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="order">Ordre</Label>
                  <Input id="order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Service actif (visible sur le site)
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="gold" onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                {editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : (
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{s.title}</h3>
                  {s.is_active ? (
                    <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/15">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Inactif</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">#{s.display_order}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleActive(s)} title={s.is_active ? "Désactiver" : "Activer"}>
                  <Power className={`h-4 w-4 ${s.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(s)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
