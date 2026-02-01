"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>EU AI Act Compliance Platform</span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Grip op de AI Act vóór 2 augustus 2026
 –{" "}
            <span className="text-primary">Zonder administratieve rompslomp.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
           Een overzichtelijk dashboard voor HR en ondernemers dat helpt bij het bijhouden en centraliseren van AI-tools en bewijzen van AI-geletterdheid.
Veilig opgeslagen binnen de Europese Unie..
          </p>

          <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md">
            {!isSubmitted ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="je@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 bg-card text-base"
                  required
                />
                <Button type="submit" size="lg" className="h-12 gap-2 px-6">
                  Zet me op de wachtlijst
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-4 text-accent">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Je staat op de wachtlijst!</span>
              </div>
            )}
            
            {!isSubmitted && (
              <p className="mt-3 text-sm text-muted-foreground">
                Al 150+ HR-managers gingen je voor.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
