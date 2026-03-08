import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { getTools } from "@/app/actions/tools";

const statusConfig = {
  compliant: {
    label: "Conform",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "In behandeling",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  action: {
    label: "Actie vereist",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export async function ToolsTable() {
  const tools = await getTools();

  // Map database tools to display format
  const displayTools = tools.slice(0, 5).map((tool) => {
    let status: "compliant" | "pending" | "action" = "action";
    if (tool.isCompliant) {
      status = "compliant";
    }

    return {
      name: tool.name,
      department: tool.department,
      riskLevel: statusConfig[status].label,
      status,
      lastAudit: tool.isCompliant
        ? new Date(tool.dateAdded).toLocaleDateString("nl-NL")
        : "Actie vereist",
    };
  });

  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          AI-Register Overzicht
        </CardTitle>
        <Link href="/dashboard/register">
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            Bekijk alles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3">Tool</th>
                <th className="pb-3">Afdeling</th>
                <th className="pb-3">Risiconiveau</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Laatste audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayTools.map((tool) => {
                const status = statusConfig[tool.status];
                return (
                  <tr key={tool.name} className="text-sm">
                    <td className="py-3 font-medium text-foreground">
                      {tool.name}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {tool.department}
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className="font-normal">
                        {tool.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`gap-1 font-normal ${status.className}`}
                      >
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {tool.lastAudit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
