"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "./header"
import { UrlInput } from "./url-input"
import { ProgressStepper, DEFAULT_STEPS, type Step } from "./progress-stepper"
import { SplitPreview } from "./split-preview"
import { SeoScorecard } from "./seo-scorecard"
import { PushAction } from "./push-action"

type AppState = "input" | "processing" | "complete"

export interface CrawlData {
  markdown?: string
  html?: string
  metadata?: {
    title?: string
    description?: string
    ogTitle?: string
    ogDescription?: string
    [key: string]: unknown
  }
}

export function MigratorDashboard() {
  const [url, setUrl] = useState("")
  const [appState, setAppState] = useState<AppState>("input")
  const [steps, setSteps] = useState<Step[]>(DEFAULT_STEPS)
  const [crawlData, setCrawlData] = useState<CrawlData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!url) return

    clearTimers()
    setAppState("processing")
    setCrawlData(null)
    setError(null)

    // Reset all steps to pending
    setSteps(DEFAULT_STEPS.map((s) => ({ ...s, status: "pending" as const })))

    try {
      // Step 1 -- Firecrawl Extraction (active)
      setSteps((prev) =>
        prev.map((s, i) => ({ ...s, status: i === 0 ? "active" : "pending" }))
      )

      const response = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || "Migration failed")
      }

      const result = await response.json()
      const data: CrawlData = result.data ?? result

      // Store the real crawled data
      setCrawlData(data)

      // Step 1 complete -- Step 2 GEO-AI Optimization (active)
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i === 0 ? "complete" : i === 1 ? "active" : "pending",
        }))
      )

      await new Promise((resolve) => {
        const t = setTimeout(resolve, 1800)
        timerRef.current.push(t)
      })

      // Step 2 complete -- Step 3 JSON-LD & Schema (active)
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 1 ? "complete" : i === 2 ? "active" : "pending",
        }))
      )

      await new Promise((resolve) => {
        const t = setTimeout(resolve, 1500)
        timerRef.current.push(t)
      })

      // Step 3 complete -- Step 4 Tailpress Injection (active)
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 2 ? "complete" : i === 3 ? "active" : "pending",
        }))
      )

      await new Promise((resolve) => {
        const t = setTimeout(resolve, 1400)
        timerRef.current.push(t)
      })

      // All steps complete
      setSteps((prev) => prev.map((s) => ({ ...s, status: "complete" as const })))
      setAppState("complete")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred."
      setError(message)
      setAppState("input")
      setSteps(DEFAULT_STEPS)
    }
  }, [url, clearTimers])

  const handleReset = useCallback(() => {
    clearTimers()
    setUrl("")
    setAppState("input")
    setSteps(DEFAULT_STEPS)
    setCrawlData(null)
    setError(null)
  }, [clearTimers])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />

      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {appState === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col items-center justify-center px-6 py-12"
            >
              <UrlInput
                url={url}
                onUrlChange={setUrl}
                onAnalyze={handleAnalyze}
                isProcessing={false}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          )}

          {(appState === "processing" || appState === "complete") && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 px-6 py-6"
            >
              <div className="mx-auto max-w-5xl space-y-8">
                {/* URL Display */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-mono text-xs text-muted-foreground">{url}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    New Migration
                  </button>
                </motion.div>

                {/* Progress Stepper */}
                <ProgressStepper steps={steps} />

                {/* Results (shown after complete) */}
                <AnimatePresence>
                  {appState === "complete" && crawlData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <SplitPreview crawlData={crawlData} />
                      <SeoScorecard crawlData={crawlData} />
                      <div className="rounded-xl border border-border bg-card p-6">
                        <PushAction />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {appState === "processing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 rounded-full border-2 border-border" />
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Transforming your content with AI...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Powered by Firecrawl, GEO-AI & Tailpress
          </p>
          <p className="text-[10px] text-muted-foreground">
            Built for modern WordPress migration
          </p>
        </div>
      </footer>
    </div>
  )
}
