"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Settings, X, Globe, User, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PushAction() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Ready to Deploy</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Push optimized content directly to your WordPress instance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2 border-border text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            WP-API Settings
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Upload className="h-3.5 w-3.5" />
            Push to WordPress
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mt-4 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <CardTitle className="text-sm font-medium text-foreground">
                  WordPress API Credentials
                </CardTitle>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Close settings"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    WordPress URL
                  </label>
                  <Input
                    placeholder="https://yoursite.com"
                    className="h-8 bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    Username
                  </label>
                  <Input
                    placeholder="admin"
                    className="h-8 bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <KeyRound className="h-3 w-3" />
                    Application Password
                  </label>
                  <Input
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="h-8 bg-secondary text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
