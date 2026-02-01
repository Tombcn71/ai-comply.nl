import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const kpis = [
  {
    title: "Geregistreerde AI-tools",
    value: "24",
    change: "+3 deze maand",
    trend: "up",
    icon: Server,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Medewerkers getraind",
    value: "87%",
    change: "+12% vs vorige maand",
    trend: "up",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Openstaande acties",
    value: "5",
    change: "-2 vs vorige week",
    trend: "down",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Compliance score",
    value: "92%",
    change: "Voldoet aan AI Act",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {kpi.value}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`rounded-lg p-2.5 ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
