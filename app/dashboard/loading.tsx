import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
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

          {/* KPI Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-3 h-8 w-16" />
                    <Skeleton className="mt-2 h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Tables & Charts Skeleton */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Tools Table Skeleton */}
            <div className="rounded-lg border border-border bg-card lg:col-span-2">
              <div className="border-b border-border p-5">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="mb-4 flex items-center justify-between py-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Skeleton */}
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-5">
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-5">
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-5">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-5">
                  <Skeleton className="h-64 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
