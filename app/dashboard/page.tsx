import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { ToolsTable } from "@/components/dashboard/tools-table";
import { TrainingChart } from "@/components/dashboard/training-chart";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Overzicht</h1>
            <p className="text-muted-foreground">
              Volledige compliance-status van de AI-verordening binnen jouw
              organisatie
            </p>
          </div>

          <KpiCards />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Suspense
              fallback={
                <Card className="border-border lg:col-span-2">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Tools laden...
                  </CardContent>
                </Card>
              }
            >
              <ToolsTable />
            </Suspense>
            <TrainingChart />
          </div>
        </main>
      </div>
    </div>
  );
}
