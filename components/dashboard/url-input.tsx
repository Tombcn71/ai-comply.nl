"use client"

import { Globe, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface UrlInputProps {
  url: string
  onUrlChange: (url: string) => void
  onAnalyze: () => void
  isProcessing: boolean
}

export function UrlInput({ url, onUrlChange, onAnalyze, isProcessing }: UrlInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          Generative Engine Optimization
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground text-balance leading-tight">
          Optimize for the Age of
          <br />
          <span className="bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
            AI Search
          </span>
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          Transform legacy WordPress content into AI-readable, high-authority Tailpress sites optimized for Perplexity, SearchGPT, and Gemini.
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg shadow-foreground/[0.03] transition-all focus-within:border-accent/40 focus-within:shadow-accent/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="url"
            placeholder="https://your-wordpress-site.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim()) onAnalyze()
            }}
            disabled={isProcessing}
            className="h-10 flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="WordPress site URL"
          />
          <Button
            onClick={onAnalyze}
            disabled={!url.trim() || isProcessing}
            className="h-10 gap-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Analyzing</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{"Analyze & Transform"}</span>
                <span className="sm:hidden">Go</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <span className="text-[11px] text-muted-foreground/60">Try:</span>
        {["blog.example.com", "shop.wordpress.org", "news.wp-site.com"].map((example) => (
          <button
            key={example}
            onClick={() => onUrlChange(`https://${example}`)}
            className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
