import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarCheck, CalendarClock, CalendarX, CheckCircle2, Loader2, Package, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  clients: number;
  servicesActive: number;
  servicesTotal: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  byMonth: { month: string; count: number }[];
  topServices: { name: string; count: number }[];
};

const STATUS_COLORS = {
  pending: "hsl(38 92% 50%)",
  confirmed: "hsl(217 91% 60%)",
  completed: "hsl(142 71% 45%)",
  cancelled: "hsl(0 72% 51%)",
};

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [clientsRes, servicesRes, apptsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id, is_active"),
        supabase.from("appointments").select("status, requested_at, service_title"),
      ]);

      const services = servicesRes.data ?? [];
      const appts = apptsRes.data ?? [];

      // Status counts
      const statusCount = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
      appts.forEach((a) => {
        statusCount[a.status as keyof typeof statusCount]++;
      });

      // RDV by month (last 6 months)
      const now = new Date();
      const monthBuckets: { month: string; count: number; key: string }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthBuckets.push({
          month: MONTHS_FR[d.getMonth()],
          count: 0,
          key: `${d.getFullYear()}-${d.getMonth()}`,
        });
      }
      appts.forEach((a) => {
        const d = new Date(a.requested_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const bucket = monthBuckets.find((b) => b.key === key);
        if (bucket) bucket.count++;
      });

      // Top services
      const serviceCount = new Map<string, number>();
      appts.forEach((a) => {
        serviceCount.set(a.service_title, (serviceCount.get(a.service_title) ?? 0) + 1);
      });
      const topServices = [...serviceCount.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        clients: clientsRes.count ?? 0,
        servicesActive: services.filter((s) => s.is_active).length,
        servicesTotal: services.length,
        pending: statusCount.pending,
        confirmed: statusCount.confirmed,
        completed: statusCount.completed,
        cancelled: statusCount.cancelled,
        byMonth: monthBuckets.map(({ month, count }) => ({ month, count })),
        topServices,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const totalRdv = stats.pending + stats.confirmed + stats.completed + stats.cancelled;
  const pieData = [
    { name: "En attente", value: stats.pending, color: STATUS_COLORS.pending },
    { name: "Confirmés", value: stats.confirmed, color: STATUS_COLORS.confirmed },
    { name: "Terminés", value: stats.completed, color: STATUS_COLORS.completed },
    { name: "Annulés", value: stats.cancelled, color: STATUS_COLORS.cancelled },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Users} label="Clients inscrits" value={stats.clients} />
        <KpiCard icon={Package} label="Services actifs" value={`${stats.servicesActive}/${stats.servicesTotal}`} />
        <KpiCard icon={CalendarCheck} label="Total rendez-vous" value={totalRdv} />
        <KpiCard
          icon={TrendingUp}
          label="Taux confirmation"
          value={totalRdv > 0 ? `${Math.round(((stats.confirmed + stats.completed) / totalRdv) * 100)}%` : "—"}
        />
      </div>

      {/* Status breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard icon={CalendarClock} label="En attente" value={stats.pending} color="text-amber-600" />
        <StatusCard icon={CalendarCheck} label="Confirmés" value={stats.confirmed} color="text-blue-600" />
        <StatusCard icon={CheckCircle2} label="Terminés" value={stats.completed} color="text-green-600" />
        <StatusCard icon={CalendarX} label="Annulés" value={stats.cancelled} color="text-red-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie chart - status */}
        <ChartCard title="Répartition des statuts" subtitle="Vue d'ensemble des rendez-vous">
          {pieData.length === 0 ? (
            <EmptyChart message="Aucun rendez-vous pour le moment" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={28} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Bar chart - by month */}
        <ChartCard title="Rendez-vous par mois" subtitle="6 derniers mois">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.byMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" fill="hsl(45 95% 55%)" radius={[6, 6, 0, 0]} name="Rendez-vous" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top services */}
      <ChartCard title="Services les plus demandés" subtitle="Top 5 par nombre de rendez-vous">
        {stats.topServices.length === 0 ? (
          <EmptyChart message="Aucune demande de service pour le moment" />
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, stats.topServices.length * 50)}>
            <BarChart data={stats.topServices} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={180}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} name="Demandes" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
      <Icon className={`h-8 w-8 ${color}`} />
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
