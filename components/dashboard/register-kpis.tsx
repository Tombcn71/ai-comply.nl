import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  ShieldCheck,
  AlertTriangle,
  Ban,
} from "lucide-react";

const kpis = [
  {
    title: "Totaal AI-systemen",
    value: "24",
    description: "Geregistreerd in het register",
    icon: Server,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Conform",
    value: "18",
    description: "Voldoen aan vereisten",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Actie vereist",
    value: "4",
    description: "Documentatie onvolledig",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Hoog risico",
    value: "2",
    description: "Extra maatregelen nodig",
    icon: Ban,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export function RegisterKpis() {
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
                <p className="mt-1 text-xs text-muted-foreground">
                  {kpi.description}
                </p>
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
