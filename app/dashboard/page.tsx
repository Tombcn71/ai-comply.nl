import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { ToolsTable } from "@/components/dashboard/tools-table";
import { TrainingChart } from "@/components/dashboard/training-chart";
import { getAllEmployees, getAllTools, getCertificationStats } from "@/lib/db";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Dashboard - AI Comply",
};

export default async function DashboardPage() {
  // Get session with Better Auth via API
  const cookieStore = await cookies();
  let session = null;
  
  try {
    const response = await auth.api.getSession({
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    session = response?.data;
  } catch (error) {
    console.error('[Dashboard] Error fetching session:', error);
  }

  if (!session?.user?.organization_id) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar />
        <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
          <DashboardHeader />
          <main className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Geen toegang</h1>
            <p className="text-muted-foreground">Geen organisatie gekoppeld aan uw account.</p>
          </main>
        </div>
      </div>
    );
  }

  // Fetch all data from database with error handling
  let employees = [];
  let tools = [];
  let stats = { total: 0, certified: 0, percentage: 0 };

  try {
    const results = await Promise.all([
      getAllEmployees(session.user.organization_id),
      getAllTools(session.user.organization_id),
      getCertificationStats(session.user.organization_id),
    ]);
    employees = results[0];
    tools = results[1];
    stats = results[2];
  } catch (error) {
    console.error('[Dashboard] Error fetching data:', error);
    // Render with empty data instead of crashing
  }

  // Calculate KPIs
  const totalTools = tools.length;
  const activeTools = tools.filter((t) => t.is_compliant).length;
  const totalEmployees = employees.length;
  const certifiedEmployees = employees.filter((e) => e.status === "certified").length;
  const certificationPercentage = totalEmployees > 0 
    ? Math.round((certifiedEmployees / totalEmployees) * 100) 
    : 0;
  const pendingActions = tools.filter((t) => !t.is_compliant).length;
  const complianceScore = totalTools > 0 
    ? Math.round((activeTools / totalTools) * 100) 
    : 0;

  // Calculate department stats for training chart
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.department;
      if (!acc[dept]) {
        acc[dept] = { total: 0, certified: 0 };
      }
      acc[dept].total++;
      if (emp.status === "certified") {
        acc[dept].certified++;
      }
      return acc;
    },
    {} as Record<string, { total: number; certified: number }>
  );

  const chartData = Object.entries(departmentStats).map(([dept, data]) => ({
    department: dept,
    completed: data.total > 0 ? Math.round((data.certified / data.total) * 100) : 0,
  }));

  // Calculate certification breakdown for pie chart
  const trainingBreakdown = [
    { name: "Gecertificeerd", value: certifiedEmployees },
    { name: "Niet gecertificeerd", value: totalEmployees - certifiedEmployees },
  ];

  const kpiData = [
    {
      title: "Geregistreerde AI-tools",
      value: totalTools.toString(),
      change: `${activeTools} conform`,
      trend: "up",
      icon: "Server",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Medewerkers getraind",
      value: `${certificationPercentage}%`,
      change: `${certifiedEmployees} van ${totalEmployees}`,
      trend: "up",
      icon: "Users",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Openstaande acties",
      value: pendingActions.toString(),
      change: "Tools vereisen actie",
      trend: pendingActions === 0 ? "down" : "up",
      icon: "AlertTriangle",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Compliance score",
      value: `${complianceScore}%`,
      change: "Voldoet aan AI Act",
      trend: "up",
      icon: "CheckCircle2",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

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

          <KpiCards data={kpiData} />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <ToolsTable tools={tools} />
            <TrainingChart departmentData={chartData} trainingBreakdown={trainingBreakdown} />
          </div>
        </main>
      </div>
    </div>
  );
}
