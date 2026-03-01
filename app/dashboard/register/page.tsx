import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { RegisterKpis } from "@/components/dashboard/register-kpis";
import { RegisterTable } from "@/components/dashboard/register-table";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="pl-64 transition-all duration-300">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">AI-Register</h1>
            <p className="text-muted-foreground">
              Overzicht van alle AI-systemen binnen jouw organisatie, inclusief
              risicoklassificatie en compliance-status.
            </p>
          </div>

          <RegisterKpis />

          <div className="mt-6">
            <RegisterTable />
          </div>
        </main>
      </div>
    </div>
  );
}
