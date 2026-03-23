"use client"

import { Brain } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Brain className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Tailpress AI Migrator
          </h1>
          <p className="text-[11px] text-muted-foreground">
            GEO-Optimized WordPress Migration
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          GEO Engine Active
        </span>
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          v2.0
        </span>
      </div>
    </header>
  )
}
