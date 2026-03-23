"use client"

import { Flame, Brain, Code2, Paintbrush, Check, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type StepStatus = "pending" | "active" | "complete"

export interface Step {
  id: string
  label: string
  description: string
  icon: React.ElementType
  status: StepStatus
}

const STEP_ICONS = {
  firecrawl: Flame,
  geo: Brain,
  schema: Code2,
  tailpress: Paintbrush,
}

export const DEFAULT_STEPS: Step[] = [
  {
    id: "firecrawl",
    label: "Firecrawl Extraction",
    description: "Crawling pages and extracting content",
    icon: STEP_ICONS.firecrawl,
    status: "pending",
  },
  {
    id: "geo",
    label: "GEO-AI Optimization",
    description: "Enhancing content with AI-powered SEO",
    icon: STEP_ICONS.geo,
    status: "pending",
  },
  {
    id: "schema",
    label: "JSON-LD & Schema",
    description: "Generating structured data markup",
    icon: STEP_ICONS.schema,
    status: "pending",
  },
  {
    id: "tailpress",
    label: "Tailpress Injection",
    description: "Applying modern Tailwind theme",
    icon: STEP_ICONS.tailpress,
    status: "pending",
  },
]

interface ProgressStepperProps {
  steps: Step[]
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    scale: step.status === "active" ? 1.1 : 1,
                  }}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    step.status === "complete" && "border-accent bg-accent",
                    step.status === "active" && "border-accent bg-accent/10",
                    step.status === "pending" && "border-border bg-secondary"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {step.status === "complete" ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4 text-accent-foreground" />
                      </motion.div>
                    ) : step.status === "active" ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors",
                      step.status === "complete" && "text-accent",
                      step.status === "active" && "text-foreground",
                      step.status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-2 mt-[-28px] h-0.5 flex-1">
                  <div className="h-full rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          step.status === "complete"
                            ? "100%"
                            : step.status === "active"
                            ? "50%"
                            : "0%",
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
