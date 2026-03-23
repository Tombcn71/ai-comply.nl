"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, FileText, Heading, Link2, Image, FileJson, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CrawlData } from "./migrator-dashboard"
import { GeoScore } from "./geo-score"

interface SeoScorecardProps {
  crawlData: CrawlData
}

interface Metric {
  label: string
  value: number
  maxValue: number
  unit: string
  detail: string
  icon: React.ElementType
}

function analyzeContent(crawlData: CrawlData) {
  const md = crawlData.markdown || ""
  const html = crawlData.html || ""
  const meta = crawlData.metadata

  // Word count from markdown
  const words = md.split(/\s+/).filter(Boolean).length

  // Heading count (# in markdown)
  const headings = (md.match(/^#{1,6}\s/gm) || []).length

  // Link count
  const markdownLinks = (md.match(/\[.*?\]\(.*?\)/g) || []).length
  const htmlLinks = (html.match(/<a\s/gi) || []).length
  const totalLinks = Math.max(markdownLinks, htmlLinks)

  // Image count
  const markdownImages = (md.match(/!\[.*?\]\(.*?\)/g) || []).length
  const htmlImages = (html.match(/<img\s/gi) || []).length
  const totalImages = Math.max(markdownImages, htmlImages)

  // Meta tags completeness
  let metaScore = 0
  if (meta?.title) metaScore += 25
  if (meta?.description) metaScore += 25
  if (meta?.ogTitle) metaScore += 25
  if (meta?.ogDescription) metaScore += 25

  // Schema / JSON-LD detection
  const hasJsonLd = html.includes("application/ld+json")
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length

  // Overall GEO score (heuristic based on real signals)
  let geoScore = 0
  // Content richness (0-25)
  geoScore += Math.min(25, Math.floor((words / 500) * 25))
  // Structure (0-25)
  geoScore += Math.min(25, headings * 5)
  // Metadata (0-25)
  geoScore += Math.floor(metaScore * 0.25)
  // Links & media (0-25)
  geoScore += Math.min(15, totalLinks * 3) + Math.min(10, totalImages * 2)

  geoScore = Math.min(100, geoScore)

  return {
    words,
    headings,
    totalLinks,
    totalImages,
    metaScore,
    hasJsonLd,
    jsonLdCount,
    geoScore,
    contentSizeKb: ((md.length + html.length) / 1024).toFixed(1),
  }
}

export function SeoScorecard({ crawlData }: SeoScorecardProps) {
  const analysis = useMemo(() => analyzeContent(crawlData), [crawlData])

  const metrics: Metric[] = [
    {
      label: "Word Count",
      value: analysis.words,
      maxValue: 2000,
      unit: "",
      detail: analysis.words > 300 ? "Good content length" : "Content may be too thin",
      icon: FileText,
    },
    {
      label: "Headings",
      value: analysis.headings,
      maxValue: 10,
      unit: "",
      detail: `${analysis.headings} heading${analysis.headings !== 1 ? "s" : ""} found`,
      icon: Heading,
    },
    {
      label: "Internal Links",
      value: analysis.totalLinks,
      maxValue: 20,
      unit: "",
      detail: `${analysis.totalLinks} link${analysis.totalLinks !== 1 ? "s" : ""} detected`,
      icon: Link2,
    },
    {
      label: "Images",
      value: analysis.totalImages,
      maxValue: 10,
      unit: "",
      detail: analysis.totalImages > 0 ? "Media assets found" : "No images detected",
      icon: Image,
    },
    {
      label: "Meta Completeness",
      value: analysis.metaScore,
      maxValue: 100,
      unit: "%",
      detail: analysis.metaScore === 100 ? "All meta tags present" : "Missing meta tags",
      icon: TrendingUp,
    },
    {
      label: "JSON-LD Schema",
      value: analysis.jsonLdCount,
      maxValue: 3,
      unit: "",
      detail: analysis.hasJsonLd
        ? `${analysis.jsonLdCount} schema block${analysis.jsonLdCount !== 1 ? "s" : ""}`
        : "No structured data found",
      icon: FileJson,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="mb-4 text-sm font-medium text-foreground">SEO / GEO Analysis</h3>

      <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
        {/* Metric cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, i) => {
            const Icon = metric.icon
            const pct = Math.min(100, Math.round((metric.value / metric.maxValue) * 100))

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
              >
                <Card className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {metric.value > 0 && (
                        <div className="flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5">
                          <ArrowUpRight className="h-3 w-3 text-accent" />
                          <span className="text-[10px] font-semibold text-accent">
                            {metric.value}{metric.unit}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="mt-0.5 text-lg font-bold text-foreground">
                        {metric.value}{metric.unit}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{metric.detail}</p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          pct >= 60 ? "bg-accent" : pct >= 30 ? "bg-chart-2" : "bg-destructive/60"
                        )}
                        initial={{ width: "0%" }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* GEO Score gauge */}
        <div className="flex items-center justify-center">
          <GeoScore score={analysis.geoScore} />
        </div>
      </div>

      {/* Content size footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground"
      >
        <span>Total extracted: {analysis.contentSizeKb} KB</span>
        <span>{"/"}</span>
        <span>{analysis.words} words</span>
        <span>{"/"}</span>
        <span>{analysis.headings} headings</span>
      </motion.div>
    </motion.div>
  )
}
