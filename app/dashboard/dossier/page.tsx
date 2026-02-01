"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Building2,
  Award,
} from "lucide-react";

const checklistItems = [
  {
    id: 1,
    label: "Inventarisatie AI-systemen",
    detail: "12 tools",
    checked: true,
  },
  {
    id: 2,
    label: "Bewijs AI-geletterdheid",
    detail: "45 certificaten",
    checked: true,
  },
  {
    id: 3,
    label: "Afdelingsrapportages",
    detail: "5 afdelingen",
    checked: true,
  },
  {
    id: 4,
    label: "Officiële Tijdstempel & Audit-trail",
    detail: "Compleet",
    checked: true,
  },
];

const recentDossiers = [
  {
    id: 1,
    filename: "Dossier_Januari_2026.pdf",
    date: "15 jan 2026",
    generatedBy: "Jan de Vries",
  },
  {
    id: 2,
    filename: "Dossier_December_2025.pdf",
    date: "20 dec 2025",
    generatedBy: "Maria Jansen",
  },
  {
    id: 3,
    filename: "Dossier_November_2025.pdf",
    date: "18 nov 2025",
    generatedBy: "Jan de Vries",
  },
  {
    id: 4,
    filename: "Dossier_Oktober_2025.pdf",
    date: "12 okt 2025",
    generatedBy: "Pieter Bakker",
  },
];

export default function DossierPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep("Gegevens verzamelen uit AI-Register...");

    setTimeout(() => {
      setGenerationStep("Training certificaten ophalen...");
    }, 1500);

    setTimeout(() => {
      setGenerationStep("Afdelingsrapportages genereren...");
    }, 3000);

    setTimeout(() => {
      setGenerationStep("PDF samenstellen...");
    }, 4500);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep("");
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div className="pl-0 pt-16 transition-all duration-300 lg:pl-64 lg:pt-0">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Dossier Generator
            </h1>
            <p className="mt-1 text-muted-foreground">
              Genereer een compleet nalevingsdossier voor de Autoriteit
              Persoonsgegevens
            </p>
          </div>

          {/* Main Generator Card */}
          <Card className="relative mb-8 overflow-hidden border-2 border-primary/20">
            {/* Official Badge */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Officieel Compliance Document
              </span>
            </div>

            <CardHeader className="pb-4 pt-8">
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="h-6 w-6 text-primary" />
                Nalevingsdossier Genereren
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Generator Button */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 p-8">
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-14 gap-3 px-8 text-base font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Bezig met genereren...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      Genereer Nalevingsdossier (PDF)
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <p className="mt-4 animate-pulse text-sm text-muted-foreground">
                    {generationStep}
                  </p>
                )}

                {!isGenerating && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Eén klik voor een compleet dossier met alle bewijslast
                  </p>
                )}
              </div>

              {/* Status Checklist */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Status Rapportage
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                        {item.id === 1 && (
                          <Building2 className="h-4 w-4 text-accent" />
                        )}
                        {item.id === 2 && (
                          <Award className="h-4 w-4 text-accent" />
                        )}
                        {item.id === 3 && (
                          <FileText className="h-4 w-4 text-accent" />
                        )}
                        {item.id === 4 && (
                          <Clock className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Dossiers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recente Dossiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bestandsnaam</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Gegenereerd door</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actie
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDossiers.map((dossier) => (
                    <TableRow key={dossier.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">{dossier.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dossier.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dossier.generatedBy}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
