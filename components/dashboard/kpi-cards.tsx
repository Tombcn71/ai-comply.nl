import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface KpiData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  color: string;
  bgColor: string;
}

const iconMap = {
  Server,
  Users,
  AlertTriangle,
  CheckCircle2,
};

export function KpiCards({ data }: { data: KpiData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi) => {
        const IconComponent = iconMap[kpi.icon as keyof typeof iconMap];
        return (
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
                  {IconComponent && <IconComponent className={`h-5 w-5 ${kpi.color}`} />}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
