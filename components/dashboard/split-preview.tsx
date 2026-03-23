"use client"

import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, Eye, Code } from "lucide-react"
import type { CrawlData } from "./migrator-dashboard"

interface SplitPreviewProps {
  crawlData: CrawlData
}

export function SplitPreview({ crawlData }: SplitPreviewProps) {
  const hasMarkdown = !!crawlData.markdown
  const hasHtml = !!crawlData.html

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Tabs defaultValue="split" className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Extracted Content</h3>
          <TabsList className="h-8 bg-secondary">
            <TabsTrigger value="split" className="h-6 gap-1.5 px-2.5 text-xs">
              <Eye className="h-3 w-3" />
              Split View
            </TabsTrigger>
            <TabsTrigger value="markdown" className="h-6 gap-1.5 px-2.5 text-xs">
              <FileText className="h-3 w-3" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="html" className="h-6 gap-1.5 px-2.5 text-xs">
              <Code className="h-3 w-3" />
              HTML
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="split">
          <div className="grid gap-4 lg:grid-cols-2">
            <MarkdownPanel content={crawlData.markdown} />
            <HtmlPanel content={crawlData.html} metadata={crawlData.metadata} />
          </div>
        </TabsContent>

        <TabsContent value="markdown">
          <MarkdownPanel content={crawlData.markdown} fullWidth />
        </TabsContent>

        <TabsContent value="html">
          <HtmlPanel content={crawlData.html} metadata={crawlData.metadata} fullWidth />
        </TabsContent>
      </Tabs>

      {/* Metadata summary if available */}
      {crawlData.metadata && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 rounded-lg border border-border bg-card p-4"
        >
          <h4 className="mb-2 text-xs font-medium text-foreground">Page Metadata</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {crawlData.metadata.title && (
              <MetadataRow label="Title" value={crawlData.metadata.title} />
            )}
            {crawlData.metadata.description && (
              <MetadataRow label="Description" value={crawlData.metadata.description} />
            )}
            {crawlData.metadata.ogTitle && (
              <MetadataRow label="OG Title" value={crawlData.metadata.ogTitle} />
            )}
            {crawlData.metadata.ogDescription && (
              <MetadataRow label="OG Description" value={crawlData.metadata.ogDescription} />
            )}
          </div>
        </motion.div>
      )}

      {!hasMarkdown && !hasHtml && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No content was extracted. The page may be protected or empty.
          </p>
        </div>
      )}
    </motion.div>
  )
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-hidden">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <p className="truncate text-xs text-foreground">{value}</p>
    </div>
  )
}

function MarkdownPanel({ content, fullWidth }: { content?: string; fullWidth?: boolean }) {
  if (!content) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-xs text-muted-foreground">No markdown content extracted</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-border bg-card ${fullWidth ? "" : ""}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-xs font-medium text-muted-foreground">Markdown</span>
        <span className="ml-auto rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
          {(content.length / 1024).toFixed(1)} KB
        </span>
      </div>
      <div className="max-h-96 overflow-auto p-4">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
          {content}
        </pre>
      </div>
    </div>
  )
}

function HtmlPanel({
  content,
  metadata,
  fullWidth,
}: {
  content?: string
  metadata?: CrawlData["metadata"]
  fullWidth?: boolean
}) {
  if (!content) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-xs text-muted-foreground">No HTML content extracted</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-cyan/20 bg-card ${fullWidth ? "" : ""}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-cyan" />
        <span className="text-xs font-medium text-muted-foreground">Raw HTML</span>
        <span className="ml-auto rounded bg-cyan/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan">
          {(content.length / 1024).toFixed(1)} KB
        </span>
      </div>
      <div className="max-h-96 overflow-auto p-4">
        <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
          {content}
        </pre>
      </div>
    </div>
  )
}
